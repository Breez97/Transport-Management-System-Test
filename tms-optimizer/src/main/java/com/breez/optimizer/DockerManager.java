package com.breez.optimizer;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class DockerManager {

    private final Path projectRoot;
    private final Path override;
    private final Path baseline;

    private final String dbUser;
    private final String dbName;

    public DockerManager(Path optimizerDir) throws IOException {
        projectRoot = optimizerDir.toAbsolutePath()
                .normalize()
                .getParent();

        if (projectRoot == null || !Files.isRegularFile(projectRoot.resolve("docker-compose.yml"))) {
            throw new IOException("Need to put tms-optimizer next to docker-compose.yml TMS");
        }

        override = optimizerDir
                .resolve("docker-compose.optimization.yml")
                .toAbsolutePath();

        baseline = optimizerDir
                .resolve("baseline.dump")
                .toAbsolutePath();

        if (!Files.isRegularFile(override)) {
            throw new IOException("File " + override + " not found");
        }

        dbUser = readEnv("POSTGRES_USER", "tms");
        dbName = readEnv("POSTGRES_DB", "tmsdb");
    }

    public void check() throws IOException, InterruptedException {
        compose(128, "config", "--quiet");

        System.out.println("docker compose: config correct");
        System.out.println("Base dump: " + baseline + " (exists: " + Files.exists(baseline) + ")");
        System.out.println("JMeter plan: " + projectRoot.resolve("jmeter/scenarios/tms-load.jmx"));
    }

    public void snapshot() throws IOException, InterruptedException {
        if (Files.exists(baseline)) {
            throw new IOException("Dump already exists: " + baseline + ". Do not rewrite");
        }

        stopApplication(128);

        compose(128, "up", "-d", "postgres");
        waitPostgres();

        Path temporary = baseline.resolveSibling("baseline.dump.part");
         try {
             runDocker(
                     null,
                     temporary,
                     "exec", "tms-postgres",
                     "pg_dump",
                     "-U", dbUser,
                     "-d", dbName,
                     "-Fc",
                     "--no-owner",
                     "--no-acl"
             );

             if (Files.size(temporary) < 1000) {
                 throw new IOException("Too little dump");
             }

             Files.move(temporary, baseline);
             System.out.println("Dump created: " + baseline);
         } finally {
             Files.deleteIfExists(temporary);
         }
    }

    public void prepare(int sharedBuffersMb) throws IOException, InterruptedException {
        if (sharedBuffersMb < 64 || sharedBuffersMb > 384) {
            throw new IllegalArgumentException("shared_buffers must be in range 64..384 MB");
        }

        if (!Files.isRegularFile(baseline)) {
            throw new IOException("Baseline.dump must be created");
        }

        stopApplication(sharedBuffersMb);

        compose(
                sharedBuffersMb,
                "up", "-d", "--force-recreate", "postgres"
        );

        waitPostgres();

        runDocker(
                null, null,
                "exec", "tms-postgres",
                "dropdb",
                "-U", dbUser,
                "--if-exists",
                "--force",
                dbName
        );

        runDocker(
                null, null,
                "exec", "tms-postgres",
                "createdb",
                "-U", dbUser,
                dbName
        );

        runDocker(
                baseline, null,
                "exec", "-i", "tms-postgres",
                "pg_restore",
                "-U", dbUser,
                "-d", dbName,
                "--no-owner",
                "--no-privileges",
                "--exit-on-error"
        );

        runDocker(
                null, null,
                "exec", "tms-postgres",
                "vacuumdb",
                "-U", dbUser,
                "-d", dbName,
                "--analyze"
        );

        runDocker(
                null, null,
                "exec", "tms-postgres",
                "psql",
                "-U", dbUser,
                "-d", dbName,
                "-Atc",
                "SHOW shared_buffers;"
        );

        compose(
                sharedBuffersMb,
                "up", "-d", "--no-deps",
                "backend-1", "backend-2", "load-balancer"
        );

        waitBackend();

        System.out.println(
                "Ready: shared_buffers=" + sharedBuffersMb + "MB"
        );
    }

    private String readEnv(String key, String fallback) throws IOException {
        Path envFile = projectRoot.resolve(".env");
        if (!Files.isRegularFile(envFile)) {
            return fallback;
        }

        for (String line : Files.readAllLines(envFile)) {
            String value = line.strip();
            if (value.startsWith(key + "=")) {
                value = value
                        .substring(key.length() + 1)
                        .strip();
                if (value.length() >= 2 &&
                        (value.startsWith("\"") && value.endsWith("\"")
                                || value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length() - 1);
                }
                return value;
            }
        }

        return fallback;
    }

    private void compose(int sharedBuffersMb, String... args) throws IOException, InterruptedException {
        List<String> command = new ArrayList<>(List.of(
                "docker",
                "compose",
                "-f",
                projectRoot.resolve("docker-compose.yml").toString(),
                "-f",
                override.toString()
        ));

        command.addAll(List.of(args));
        ProcessRunner.run(
                projectRoot,
                Map.of(
                        "PG_SHARED_BUFFERS",
                        sharedBuffersMb + "MB"
                ),
                null,
                null,
                command
        );
    }

    private void stopApplication(int sharedBuffersMb) throws IOException, InterruptedException {
        compose(
                sharedBuffersMb,
                "stop",
                "frontend",
                "load-balancer",
                "backend-1",
                "backend-2"
        );
    }

    private void waitPostgres() throws IOException, InterruptedException {
        long deadline = System.nanoTime() + Duration.ofMinutes(2).toNanos();
        while (System.nanoTime() < deadline) {
            boolean ready = ProcessRunner.succeeds(
                    projectRoot,
                    List.of(
                            "docker",
                            "exec",
                            "tms-postgres",
                            "pg_isready",
                            "-U", dbUser,
                            "-d", "postgres"
                    )
            );

            if (ready) {
                return;
            }

            Thread.sleep(2000);
        }

        throw new IOException("PostgreSQL didn't start in 2 minutes");
    }

    private void runDocker(Path input, Path output, String... args) throws IOException, InterruptedException {
        List<String> command = new ArrayList<>(List.of("docker"));
        command.addAll(List.of(args));
        ProcessRunner.run(
                projectRoot,
                Map.of(),
                input,
                output,
                command
        );
    }

    private void waitBackend() throws IOException, InterruptedException {
        try (HttpClient client = HttpClient.newHttpClient()) {
            HttpRequest request = HttpRequest.newBuilder()
                    .GET()
                    .uri(URI.create("http://localhost:8080/api/v1/vehicles"))
                    .timeout(Duration.ofSeconds(3))
                    .build();
            long deadline = System.nanoTime() + Duration.ofMinutes(2).toNanos();
            while (System.nanoTime() < deadline) {
                try {
                    int status = client.send(
                            request,
                            HttpResponse.BodyHandlers.discarding()
                    ).statusCode();

                    if (status >= 200 && status < 500) {
                        return;
                    }
                } catch (IOException ignored) {}

                Thread.sleep(2000);
            }
        }
        throw new IOException("backend doesn't respond through localhost:8080");
    }

}
