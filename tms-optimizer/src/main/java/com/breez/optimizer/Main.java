package com.breez.optimizer;

import java.nio.file.Path;
import java.util.Locale;

public final class Main {

    public static void main(String[] args) throws Exception {

        if (args.length == 0) {
            System.out.println("Usage: check | snapshot | prepare <mb> | test | optimize");
            return;
        }

        Path optimizerDir = Path.of(".")
                .toAbsolutePath()
                .normalize();

        switch (args[0]) {
            case "check" -> {
                DockerManager docker = new DockerManager(optimizerDir);
                docker.check();
            }
            case "snapshot" -> {
                DockerManager docker = new DockerManager(optimizerDir);
                docker.snapshot();
            }
            case "prepare" -> {
                if (args.length != 2) {
                    throw new IllegalArgumentException(
                            "Example: prepare 256"
                    );
                }
                DockerManager docker = new DockerManager(optimizerDir);
                docker.prepare(Integer.parseInt(args[1]));
            }
            case "test" -> {
                JMeterRunner runner = new JMeterRunner(optimizerDir);
                JMeterRunner.TestRun test = runner.run(
                        5, 180, 30
                );
                ResultAnalyzer.Result result =
                        new ResultAnalyzer().analyze(
                                test.jtl(), 45
                        );
                System.out.println("\n=== Load Test Result ===");
                System.out.println("Requests: " + result.requests());
                System.out.println("Successful: " + result.successful());
                System.out.println("Errors: " + result.errors());
                System.out.printf(Locale.US, "RPS: %.2f%n", result.rps());
                System.out.println("P95: " + result.p95Ms() + " ms");
                System.out.printf(Locale.US, "Error Rate: %.2f%%%n", result.errorPercent());
                System.out.printf(Locale.US, "Measured duration: %.2f s%n", result.measuredSeconds());
                System.out.println("Results: " + test.directory());
            }
            case "optimize" -> {
                ConfigurationOptimizer optimizer =
                        new ConfigurationOptimizer(optimizerDir);
                optimizer.run(
                        5,
                        180,
                        30,
                        45
                );
            }
            case "plot" -> {
                if (args.length != 2) {
                    throw new IllegalArgumentException(
                            "Usage: plot <configurations.csv>"
                    );
                }
                Path csv = optimizerDir.resolve(args[1]).normalize();
                ReportGenerator.generate(csv);
            }
            default -> throw new IllegalArgumentException("Unknown command: " + args[0]);
        }
    }
}