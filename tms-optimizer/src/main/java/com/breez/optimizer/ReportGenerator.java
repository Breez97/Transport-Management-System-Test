package com.breez.optimizer;

import org.knowm.xchart.ChartEncoder;
import org.knowm.xchart.XYChart;
import org.knowm.xchart.XYChartBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public final class ReportGenerator {

    private ReportGenerator() {}

    public static void generate(Path csvPath) throws IOException {
        if (!Files.isRegularFile(csvPath)) {
            throw new IOException("CSV file not found: " + csvPath);
        }

        List<String> lines = Files.readAllLines(
                csvPath, StandardCharsets.UTF_8
        );

        if (lines.size() < 2) {
            throw new IOException("CSV contains no data");
        }

        String[] header = lines.getFirst().split(",");

        int mbIndex = column(header, "shared_buffers_mb");
        int rpsIndex = column(header, "avg_rps");

        // TreeMap sorts configurations by shared_buffers.
        Map<Integer, Double> results = new TreeMap<>();

        for (int i = 1; i < lines.size(); i++) {
            if (lines.get(i).isBlank()) {
                continue;
            }

            String[] values = lines.get(i).split(",");

            int mb = Integer.parseInt(values[mbIndex].trim());
            double rps = Double.parseDouble(values[rpsIndex].trim());

            results.put(mb, rps);
        }

        if (results.isEmpty()) {
            throw new IOException("No configurations found");
        }

        double[] x = results.keySet().stream()
                .mapToDouble(Integer::doubleValue)
                .toArray();

        double[] y = results.values().stream()
                .mapToDouble(Double::doubleValue)
                .toArray();

        XYChart chart = new XYChartBuilder()
                .width(1200)
                .height(700)
                .title("PostgreSQL Configuration Optimization")
                .xAxisTitle("shared_buffers (MB)")
                .yAxisTitle("Average RPS")
                .build();

        chart.getStyler().setLegendVisible(false);
        chart.getStyler().setMarkerSize(10);
        chart.getStyler().setYAxisMin(0.0);

        chart.addSeries("RPS", x, y);

        Path output = csvPath.getParent()
                .resolve("performance-chart");

        ChartEncoder.saveChart(
                chart,
                output.toString(),
                "png"
        );

        System.out.println("Chart generated: " + output + ".png");
    }

    private static int column(String[] header, String name) {
        for (int i = 0; i < header.length; i++) {
            if (header[i].trim().equals(name)) {
                return i;
            }
        }

        throw new IllegalArgumentException(
                "Missing CSV column: " + name
        );
    }
}
