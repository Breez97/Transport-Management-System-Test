package com.tms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TripDetailsCsvService {

    private final JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public byte[] export(LocalDate from, LocalDate to, int limit) {

        String sql = """
            SELECT
                t.id,
                t.status,
                t.start_time,
                t.end_time,
                v.vehicle_number,
                d.name AS driver_name,
                r.origin,
                r.destination
            FROM trips t
            JOIN vehicles v ON v.id = t.vehicle_id
            JOIN drivers d ON d.id = t.driver_id
            LEFT JOIN routes r ON r.id = t.route_id
            WHERE t.created_at >= ?
              AND t.created_at < ?
            ORDER BY t.created_at, t.id
            LIMIT ?
            """;

        StringBuilder csv = new StringBuilder();

        csv.append(
                "Trip ID,Status,Start Time,End Time," +
                        "Vehicle,Driver,Origin,Destination\n"
        );

        jdbcTemplate.query(
                sql,
                rs -> {
                    appendRow(
                            csv,
                            rs.getObject("id"),
                            rs.getString("status"),
                            rs.getObject("start_time"),
                            rs.getObject("end_time"),
                            rs.getString("vehicle_number"),
                            rs.getString("driver_name"),
                            rs.getString("origin"),
                            rs.getString("destination")
                    );
                },
                Timestamp.valueOf(from.atStartOfDay()),
                Timestamp.valueOf(to.plusDays(1).atStartOfDay()),
                limit
        );

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static void appendRow(StringBuilder csv, Object... values) {
        for (int i = 0; i < values.length; i++) {
            if (i > 0) csv.append(',');

            String value = Objects.toString(values[i], "");
            csv.append('"')
                    .append(value.replace("\"", "\"\""))
                    .append('"');
        }
        csv.append('\n');
    }
}