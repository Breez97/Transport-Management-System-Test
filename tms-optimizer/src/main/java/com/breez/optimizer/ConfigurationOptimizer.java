package com.breez.optimizer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

public final class ConfigurationOptimizer {

    private static final int BASELINE_MB = 128;
    private static final List<Integer> INITIAL_VALUES = List.of(128, 64, 192, 256, 320, 384);

    private static final double MAX_ERROR_PERCENT = 1.0;

    private record Trial(int mb, int repetition, ResultAnalyzer.Result result, Path jtl) {}

    private record Stats(int count, double avgRps, double avgP95, double avgErrors) {}

    private final Path optimizerDir;
    private final DockerManager docker;
    private final JMeterRunner jmeter;
    private final ResultAnalyzer analyzer = new ResultAnalyzer();

    private final List<Trial> trials = new ArrayList<>();

    public ConfigurationOptimizer(Path optimizerDir) throws IOException {
        this.optimizerDir = optimizerDir.toAbsolutePath().normalize();
        this.docker = new DockerManager(this.optimizerDir);
        this.jmeter = new JMeterRunner(this.optimizerDir);
    }

    public void run(int usersPerRole, int duration, int ramp, int warmup)
            throws IOException, InterruptedException {

        if (usersPerRole < 1 || ramp < 0 ||
                warmup < ramp || duration - warmup < 60) {
            throw new IllegalArgumentException("Invalid load test parameters");
        }

        String id = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss-SSS"));
        Path directory = optimizerDir
                .resolve("optimization-results")
                .resolve(id);
        Files.createDirectories(directory);
        Path trialsCsv = directory.resolve("trials.csv");
        Files.writeString(
                trialsCsv,
                "shared_buffers_mb,repetition,requests,successful,"
                        + "errors,rps,p95_ms,error_percent,"
                        + "measured_seconds,jtl\n",
                StandardCharsets.UTF_8
        );
        System.out.println("Results directory: " + directory);

        System.out.println("Phase 1: initial configurations");
        for (int mb : INITIAL_VALUES) {
            measure(
                    mb, usersPerRole, duration,
                    ramp, warmup, trialsCsv
            );
        }
        int coarseWinner = bestSingleTrial().mb();

        System.out.println("Phase 2: refine around " + coarseWinner + "MB");
        for (int mb : List.of(
                coarseWinner - 32,
                coarseWinner + 32
        )) {
            if (mb >= 64 && mb <= 384 && !wasTested(mb)) {
                measure(
                        mb, usersPerRole, duration,
                        ramp, warmup, trialsCsv
                );
            }
        }
        int selected = bestSingleTrial().mb();
        System.out.println(
                "Phase 3: validate baseline 128MB "
                        + "and candidate " + selected + "MB"
        );

        for (int i = 0; i < 2; i++) {
            measure(
                    BASELINE_MB, usersPerRole, duration,
                    ramp, warmup, trialsCsv
            );
            if (selected != BASELINE_MB) {
                measure(
                        selected, usersPerRole, duration,
                        ramp, warmup, trialsCsv
                );
            }
        }

        saveConfigurations(directory.resolve("configurations.csv"));
        saveSummary(directory.resolve("summary.txt"), selected);
        System.out.println("Search completed. Results: " + directory);
    }

    private void measure(int mb, int users, int duration, int ramp, int warmup, Path csv)
            throws IOException, InterruptedException {

        int repetition = (int) trials.stream()
                .filter(t -> t.mb() == mb)
                .count() + 1;

        System.out.printf(
                "%n=== shared_buffers=%dMB, run=%d ===%n",
                mb, repetition
        );

        docker.prepare(mb);
        JMeterRunner.TestRun test = jmeter.run(
                users, duration, ramp
        );

        ResultAnalyzer.Result result = analyzer.analyze(
                test.jtl(), warmup
        );
        Trial trial = new Trial(
                mb, repetition, result, test.jtl()
        );
        trials.add(trial);

        String line = String.format(
                Locale.US,
                "%d,%d,%d,%d,%d,%.3f,%d,%.3f,%.2f,\"%s\"%n",
                mb,
                repetition,
                result.requests(),
                result.successful(),
                result.errors(),
                result.rps(),
                result.p95Ms(),
                result.errorPercent(),
                result.measuredSeconds(),
                test.jtl().toString().replace("\"", "\"\"")
        );

        Files.writeString(
                csv,
                line,
                StandardCharsets.UTF_8,
                StandardOpenOption.APPEND
        );

        System.out.printf(
                Locale.US,
                "RPS %.2f | P95 %d ms | errors %.2f%%%n",
                result.rps(),
                result.p95Ms(),
                result.errorPercent()
        );
    }

    private boolean wasTested(int mb) {
        return trials.stream()
                .anyMatch(t -> t.mb() == mb);
    }

    private Trial bestSingleTrial() {
        return trials.stream()
                .filter(t -> t.repetition() == 1)
                .filter(t -> t.result().successful() > 0)
                .filter(t ->
                        t.result().errorPercent() <= MAX_ERROR_PERCENT
                )
                .max(Comparator.comparingDouble(
                        t -> t.result().rps()
                ))
                .orElseThrow(() -> new IllegalStateException(
                        "No configuration meets the error-rate limit"
                ));
    }

    private Stats stats(int mb) {

        List<Trial> matching = trials.stream()
                .filter(t -> t.mb() == mb)
                .toList();

        if (matching.isEmpty()) {
            throw new IllegalArgumentException("No tests for " + mb + "MB");
        }

        return new Stats(
                matching.size(),

                matching.stream()
                        .mapToDouble(t -> t.result().rps())
                        .average()
                        .orElseThrow(),

                matching.stream()
                        .mapToDouble(t -> t.result().p95Ms())
                        .average()
                        .orElseThrow(),

                matching.stream()
                        .mapToDouble(t -> t.result().errorPercent())
                        .average()
                        .orElseThrow()
        );
    }

    private void saveConfigurations(Path file) throws IOException {

        Map<Integer, List<Trial>> grouped = new TreeMap<>();
        for (Trial trial : trials) {
            grouped.computeIfAbsent(
                    trial.mb(),
                    ignored -> new ArrayList<>()
            ).add(trial);
        }

        StringBuilder csv = new StringBuilder(
                "shared_buffers_mb,runs,avg_rps,"
                        + "avg_p95_ms,avg_error_percent\n"
        );
        for (int mb : grouped.keySet()) {
            Stats stat = stats(mb);
            csv.append(String.format(
                    Locale.US,
                    "%d,%d,%.3f,%.1f,%.3f%n",
                    mb,
                    stat.count(),
                    stat.avgRps(),
                    stat.avgP95(),
                    stat.avgErrors()
            ));
        }

        Files.writeString(
                file,
                csv.toString(),
                StandardCharsets.UTF_8
        );
    }

    private void saveSummary(Path file, int selected) throws IOException {
        Stats baseline = stats(BASELINE_MB);
        Stats winner = stats(selected);
        double improvement = (winner.avgRps() / baseline.avgRps() - 1.0) * 100.0;
        boolean allCandidateRunsValid = trials.stream()
                .filter(t -> t.mb() == selected)
                .allMatch(t ->
                        t.result().errorPercent() <= MAX_ERROR_PERCENT
                );
        String report = String.format(
                Locale.US,
                "Baseline: %dMB, %d runs, "
                        + "mean RPS %.3f, mean P95 %.1fms, "
                        + "mean errors %.3f%%%n"

                        + "Selected candidate: %dMB, %d runs, "
                        + "mean RPS %.3f, mean P95 %.1fms, "
                        + "mean errors %.3f%%%n"

                        + "RPS change: %+.2f%%%n",

                BASELINE_MB,
                baseline.count(),
                baseline.avgRps(),
                baseline.avgP95(),
                baseline.avgErrors(),

                selected,
                winner.count(),
                winner.avgRps(),
                winner.avgP95(),
                winner.avgErrors(),

                improvement,
                MAX_ERROR_PERCENT,
                allCandidateRunsValid
        );
        Files.writeString(
                file,
                report,
                StandardCharsets.UTF_8
        );
        System.out.println("\n" + report);
    }
}