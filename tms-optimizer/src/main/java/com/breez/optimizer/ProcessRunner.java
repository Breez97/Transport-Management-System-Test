package com.breez.optimizer;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

public final class ProcessRunner {

    private ProcessRunner() {}

    public static void run(
            Path workDir,
            Map<String, String> environment,
            Path input,
            Path output,
            List<String> command
    ) throws IOException, InterruptedException {

        System.out.println("$ " + String.join(" ", command));

        ProcessBuilder builder = new ProcessBuilder(command);

        builder.directory(workDir.toFile());
        builder.environment().putAll(environment);

        builder.redirectError(ProcessBuilder.Redirect.INHERIT);

        builder.redirectInput(input == null
                ? ProcessBuilder.Redirect.INHERIT
                : ProcessBuilder.Redirect.from(input.toFile())
        );

        builder.redirectOutput(output == null
                ? ProcessBuilder.Redirect.INHERIT
                : ProcessBuilder.Redirect.to(output.toFile())
        );

        int exitCode = builder.start().waitFor();

        if (exitCode != 0) {
            throw new IOException(
                    "Command finished with code "
                            + exitCode + ": "
                            + String.join(" ", command)
            );
        }
    }

    public static boolean succeeds(
            Path workDir,
            List<String> command
    ) throws IOException, InterruptedException {

        ProcessBuilder builder = new ProcessBuilder(command);

        builder.directory(workDir.toFile());
        builder.redirectOutput(ProcessBuilder.Redirect.DISCARD);
        builder.redirectError(ProcessBuilder.Redirect.DISCARD);

        return builder.start().waitFor() == 0;
    }
}