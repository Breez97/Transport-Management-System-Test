package com.breez.optimizer;

import java.io.IOException;
import java.io.PushbackReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public final class ResultAnalyzer {

    private record Sample(
            long timestamp,
            long elapsedMs,
            boolean success
    ) {}

    public record Result(
            int requests,
            int successful,
            int errors,
            double rps,
            long p95Ms,
            double errorPercent,
            double measuredSeconds
    ) {}

    public Result analyze(Path jtl, int warmupSeconds) throws IOException {

        if (warmupSeconds < 0) {
            throw new IllegalArgumentException(
                    "warmupSeconds must not be negative"
            );
        }

        List<Sample> samples = new ArrayList<>();

        try (PushbackReader reader = new PushbackReader(
                Files.newBufferedReader(jtl, StandardCharsets.UTF_8), 1)) {

            List<String> columns = readRecord(reader);

            if (columns == null) {
                throw new IOException("JTL is empty: " + jtl);
            }

            columns.set(0, columns.getFirst().replace("\uFEFF", ""));

            int timestampColumn = requiredColumn(columns, "timeStamp");
            int elapsedColumn = requiredColumn(columns, "elapsed");
            int successColumn = requiredColumn(columns, "success");

            int maxColumn = Math.max(
                    timestampColumn,
                    Math.max(elapsedColumn, successColumn)
            );

            List<String> row;

            while ((row = readRecord(reader)) != null) {

                if (row.size() == 1 && row.getFirst().isBlank()) {
                    continue;
                }

                if (row.size() <= maxColumn) {
                    throw new IOException("Malformed JTL row: " + row);
                }

                try {
                    samples.add(new Sample(
                            Long.parseLong(row.get(timestampColumn).trim()),
                            Long.parseLong(row.get(elapsedColumn).trim()),
                            Boolean.parseBoolean(row.get(successColumn).trim())
                    ));
                } catch (NumberFormatException exception) {
                    throw new IOException(
                            "Invalid numeric value in JTL: " + row,
                            exception
                    );
                }
            }
        }

        if (samples.isEmpty()) {
            throw new IOException("No samples found in " + jtl);
        }

        long firstTimestamp = samples.stream()
                .mapToLong(Sample::timestamp)
                .min()
                .orElseThrow();

        long lastTimestamp = samples.stream()
                .mapToLong(Sample::timestamp)
                .max()
                .orElseThrow();

        long cutoff = firstTimestamp + warmupSeconds * 1000L;

        double measuredSeconds = (lastTimestamp - cutoff) / 1000.0;

        if (measuredSeconds < 60) {
            throw new IOException(
                    "Less than 60 seconds of measurement after warmup: "
                            + measuredSeconds
                            + " s. Check JMeter duration settings."
            );
        }

        List<Sample> stable = samples.stream()
                .filter(sample -> sample.timestamp() >= cutoff)
                .toList();

        int successful = (int) stable.stream()
                .filter(Sample::success)
                .count();

        int errors = stable.size() - successful;

        List<Long> successfulTimes = stable.stream()
                .filter(Sample::success)
                .map(Sample::elapsedMs)
                .sorted(Comparator.naturalOrder())
                .toList();

        long p95 = successfulTimes.isEmpty()
                ? 0
                : successfulTimes.get(
                (int) Math.ceil(successfulTimes.size() * 0.95) - 1
        );

        Result result = new Result(
                stable.size(),
                successful,
                errors,
                successful / measuredSeconds,
                p95,
                errors * 100.0 / stable.size(),
                measuredSeconds
        );

        String csv = "requests,successful,errors,rps,p95_ms,"
                + "error_percent,measured_seconds\n"
                + String.format(
                Locale.US,
                "%d,%d,%d,%.3f,%d,%.3f,%.2f%n",
                result.requests(),
                result.successful(),
                result.errors(),
                result.rps(),
                result.p95Ms(),
                result.errorPercent(),
                result.measuredSeconds()
        );

        Files.writeString(
                jtl.getParent().resolve("summary.csv"),
                csv,
                StandardCharsets.UTF_8
        );

        return result;
    }

    private static int requiredColumn(
            List<String> header,
            String name
    ) throws IOException {

        int index = header.indexOf(name);

        if (index < 0) {
            throw new IOException(
                    "Missing JTL column '" + name + "'. Found: " + header
            );
        }

        return index;
    }

    private static List<String> readRecord(
            PushbackReader reader
    ) throws IOException {

        List<String> fields = new ArrayList<>();
        StringBuilder field = new StringBuilder();

        boolean quoted = false;
        boolean readAnything = false;

        int value;

        while ((value = reader.read()) != -1) {

            readAnything = true;
            char ch = (char) value;

            if (ch == '"') {

                if (quoted) {
                    int next = reader.read();

                    if (next == '"') {
                        field.append('"');
                    } else {
                        quoted = false;

                        if (next != -1) {
                            reader.unread(next);
                        }
                    }

                } else if (field.isEmpty()) {
                    quoted = true;
                } else {
                    field.append(ch);
                }

            } else if (ch == ',' && !quoted) {

                fields.add(field.toString());
                field.setLength(0);

            } else if ((ch == '\r' || ch == '\n') && !quoted) {

                if (ch == '\r') {
                    int next = reader.read();

                    if (next != '\n' && next != -1) {
                        reader.unread(next);
                    }
                }

                fields.add(field.toString());
                return fields;

            } else {
                field.append(ch);
            }
        }

        if (quoted) {
            throw new IOException("Unclosed CSV quoted field");
        }

        if (!readAnything) {
            return null;
        }

        fields.add(field.toString());

        return fields;
    }
}