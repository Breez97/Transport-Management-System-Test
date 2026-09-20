package com.tms.service;

import com.tms.repository.*;
import com.tms.enums.TripStatus;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    @Data @Builder
    public static class ReportRow {
        private String label;
        private long count;
        private BigDecimal amount;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTripReport(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalTrips", tripRepository.countByCreatedAtBetween(start, end));
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (TripStatus s : TripStatus.values()) {
            byStatus.put(s.name(), tripRepository.countByStatus(s));
        }
        report.put("byStatus", byStatus);
        report.put("totalBookings", bookingRepository.countBookingsInDateRange(start, end));
        report.put("totalExpenses", expenseRepository.sumInDateRange(from, to));
        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getVehicleUtilizationReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalVehicles", vehicleRepository.count());
        report.put("availableVehicles", vehicleRepository.countByStatus(com.tms.enums.VehicleStatus.AVAILABLE));
        report.put("busyVehicles", vehicleRepository.countByStatus(com.tms.enums.VehicleStatus.BUSY));
        report.put("maintenanceVehicles", vehicleRepository.countByStatus(com.tms.enums.VehicleStatus.MAINTENANCE));
        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDriverPerformanceReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalDrivers", driverRepository.count());
        report.put("activeDrivers", driverRepository.countByStatus(com.tms.enums.DriverStatus.ACTIVE));
        report.put("inactiveDrivers", driverRepository.countByStatus(com.tms.enums.DriverStatus.INACTIVE));
        return report;
    }

    public String exportCsv(Map<String, Object> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("Key,Value\n");
        data.forEach((key, value) -> {
            if (value instanceof Map) {
                ((Map<?, ?>) value).forEach((k, v) -> sb.append(key).append(".").append(k).append(",").append(v).append("\n"));
            } else {
                sb.append(key).append(",").append(value).append("\n");
            }
        });
        return sb.toString();
    }
}

