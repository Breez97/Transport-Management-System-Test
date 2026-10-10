package com.tms.controller;

import com.tms.dto.response.ApiResponse;
import com.tms.service.ReportService;
import com.tms.service.TripDetailsCsvService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Reports & analytics APIs")
public class ReportController {

    private final ReportService reportService;
    private final TripDetailsCsvService tripDetailsCsvService;

    @GetMapping("/trips")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTripReport(
            @RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getTripReport(from, to)));
    }

    @GetMapping("/trips/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<byte[]> getTripReportCsv(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        String csv = reportService.exportCsv(reportService.getTripReport(from, to));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trip-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }

    @GetMapping("/vehicles")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVehicleReport() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getVehicleUtilizationReport()));
    }

    @GetMapping("/drivers")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDriverReport() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getDriverPerformanceReport()));
    }

    @GetMapping("/trips/details/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<byte[]> exportTripDetails(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam(defaultValue = "10000") int limit) {

        if (from.isAfter(to) || limit < 1 || limit > 20000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid date range or limit (1-20000)"
            );
        }

        byte[] csv = tripDetailsCsvService.export(from, to, limit);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=trip-details.csv"
                )
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(csv);
    }
}

