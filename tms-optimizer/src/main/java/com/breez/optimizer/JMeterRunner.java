package com.breez.optimizer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JMeterRunner {

    public record TestRun(Path directory, Path jtl) {}

    private final Path projectRoot;
    private final Path optimizerDir;

    public JMeterRunner(Path optimizerDir) {
        this.optimizerDir = optimizerDir.toAbsolutePath().normalize();
        this.projectRoot = this.optimizerDir.getParent();
    }

    public TestRun run(int usersPerRole, int durationSeconds, int rampSeconds)
            throws IOException, InterruptedException {

        if (usersPerRole < 1 || durationSeconds < 120 || rampSeconds < 0) {
            throw new IllegalArgumentException(
                    "Expected usersPerRole >= 1, durationSeconds >= 120, rampSeconds >= 0"
            );
        }

        Path plan = projectRoot.resolve("jmeter/scenarios/tms-load.jmx");

        if (!Files.isRegularFile(plan)) {
            throw new IOException("JMeter test plan not found: " + plan);
        }

        String id = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss-SSS"));

        Path directory = optimizerDir.resolve("results").resolve(id);
        Files.createDirectories(directory);

        Path jtl = directory.resolve("results.jtl");
        Path consoleLog = directory.resolve("console.log");
        Path jmeterLog = directory.resolve("jmeter.log");

        String executable = System.getenv("JMETER_BIN");
        if (executable == null || executable.isBlank()) {
            executable = System.getProperty("os.name")
                    .toLowerCase()
                    .contains("win")
                    ? "jmeter.bat"
                    : "jmeter";
        }

        List<String> command = new ArrayList<>(List.of(
                executable,
                "-n",
                "-t", plan.toString(),
                "-l", jtl.toString(),
                "-j", jmeterLog.toString(),

                "-Jport=8080",
                "-Jusers=" + usersPerRole,
                "-Jramp=" + rampSeconds,
                "-Jduration=" + durationSeconds,

                "-Jjmeter.save.saveservice.output_format=csv",
                "-Jjmeter.save.saveservice.print_field_names=true",
                "-Jjmeter.save.saveservice.timestamp_format=ms",
                "-Jjmeter.save.saveservice.default_delimiter=,",
                "-Jsampleresult.timestamp.start=false"
        ));

        ProcessRunner.run(
                projectRoot,
                Map.of(),
                null,
                consoleLog,
                command
        );

        if (!Files.isRegularFile(jtl) || Files.size(jtl) == 0) {
            throw new IOException("JMeter finished without a JTL: " + jtl);
        }

        return new TestRun(directory, jtl);
    }

}
