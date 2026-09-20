package com.tms.config;

import com.tms.entity.*;
import com.tms.enums.*;
import com.tms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo data programmatically for the dev profile (H2 in-memory DB).
 * When Flyway is enabled (prod), the SQL migration V2__seed_demo_data.sql
 * handles seeding instead — this bean is not loaded in that case.
 */
@Component
@ConditionalOnProperty(name = "spring.flyway.enabled", havingValue = "false", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final TripRepository tripRepository;
    private final LorryReceiptRepository lrRepository;
    private final BookingRepository bookingRepository;
    private final GeofenceRepository geofenceRepository;
    private final ExpenseRepository expenseRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        log.info("Seeding initial data...");

        seedUsers();
        List<Vehicle> vehicles = seedVehicles();
        List<Driver> drivers = seedDrivers();
        List<Route> routes = seedRoutes();
        List<LorryReceipt> lorryReceipts = seedLorryReceipts();
        List<Trip> trips = seedTrips(vehicles, drivers, lorryReceipts, routes);
        seedBookings(trips);
        seedExpenses(trips, vehicles);
        seedGeofences();
        seedAuditLogs(vehicles, drivers, trips);

        log.info("Data seeding completed — {} users, {} vehicles, {} drivers, {} routes, {} LRs, {} trips, {} bookings, {} expenses, {} geofences, {} audit logs.",
                userRepository.count(), vehicleRepository.count(), driverRepository.count(),
                routeRepository.count(), lrRepository.count(), tripRepository.count(), bookingRepository.count(),
                expenseRepository.count(), geofenceRepository.count(), auditLogRepository.count());
    }

    // ───────────────────────────── Users ─────────────────────────────
    private void seedUsers() {
        userRepository.saveAll(List.of(
                User.builder().username("admin").email("admin@tms.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Administrator").role(UserRole.ADMIN).build(),
                User.builder().username("admin2").email("admin2@tms.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Priya Sharma").role(UserRole.ADMIN).build(),

                User.builder().username("dispatcher").email("dispatcher@tms.com")
                        .password(passwordEncoder.encode("dispatch123"))
                        .fullName("John Dispatcher").role(UserRole.DISPATCHER).build(),
                User.builder().username("dispatcher2").email("dispatcher2@tms.com")
                        .password(passwordEncoder.encode("dispatch123"))
                        .fullName("Anita Verma").role(UserRole.DISPATCHER).build(),
                User.builder().username("dispatcher3").email("dispatcher3@tms.com")
                        .password(passwordEncoder.encode("dispatch123"))
                        .fullName("Robert Chen").role(UserRole.DISPATCHER).build(),

                User.builder().username("driver1").email("driver1@tms.com")
                        .password(passwordEncoder.encode("driver123"))
                        .fullName("Mike Driver").role(UserRole.DRIVER).build(),
                User.builder().username("driver2").email("driver2@tms.com")
                        .password(passwordEncoder.encode("driver123"))
                        .fullName("Sarah Wilson").role(UserRole.DRIVER).build(),
                User.builder().username("driver3").email("driver3@tms.com")
                        .password(passwordEncoder.encode("driver123"))
                        .fullName("Raj Patel").role(UserRole.DRIVER).build(),
                User.builder().username("driver4").email("driver4@tms.com")
                        .password(passwordEncoder.encode("driver123"))
                        .fullName("Carlos Rivera").role(UserRole.DRIVER).build(),

                User.builder().username("client1").email("client1@tms.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Jane Client").role(UserRole.CLIENT).build(),
                User.builder().username("client2").email("client2@tms.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Ahmed Khan").role(UserRole.CLIENT).build(),
                User.builder().username("client3").email("client3@tms.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Lisa Wong").role(UserRole.CLIENT).build(),
                User.builder().username("client4").email("client4@tms.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("David Brown").role(UserRole.CLIENT).build(),
                User.builder().username("client5").email("client5@tms.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Maria Garcia").role(UserRole.CLIENT).build()
        ));
    }

    // ───────────────────────────── Vehicles ─────────────────────────────
    private List<Vehicle> seedVehicles() {
        return vehicleRepository.saveAll(List.of(
                Vehicle.builder().vehicleNumber("TMS-TRK-001").type(VehicleType.TRUCK).capacity(20)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Main Depot, New York")
                        .make("Volvo").model("FH16").year(2023).build(),
                Vehicle.builder().vehicleNumber("TMS-TRK-002").type(VehicleType.TRUCK).capacity(30)
                        .status(VehicleStatus.MAINTENANCE).currentLocation("Service Center, Newark")
                        .make("Tata").model("Prima").year(2022).build(),
                Vehicle.builder().vehicleNumber("TMS-TRK-003").type(VehicleType.TRUCK).capacity(25)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Warehouse, Chicago")
                        .make("Scania").model("R500").year(2024).build(),
                Vehicle.builder().vehicleNumber("TMS-TRK-004").type(VehicleType.TRUCK).capacity(18)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Main Depot, New York")
                        .make("MAN").model("TGX").year(2023).build(),
                Vehicle.builder().vehicleNumber("TMS-TRK-005").type(VehicleType.TRUCK).capacity(35)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Logistics Park, Houston")
                        .make("Kenworth").model("T680").year(2024).build(),

                Vehicle.builder().vehicleNumber("TMS-VAN-001").type(VehicleType.VAN).capacity(5)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Main Depot, New York")
                        .make("Mercedes").model("Sprinter").year(2024).build(),
                Vehicle.builder().vehicleNumber("TMS-VAN-002").type(VehicleType.VAN).capacity(4)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Branch Office, Boston")
                        .make("Ford").model("Transit").year(2023).build(),
                Vehicle.builder().vehicleNumber("TMS-VAN-003").type(VehicleType.VAN).capacity(6)
                        .status(VehicleStatus.MAINTENANCE).currentLocation("Service Center, Newark")
                        .make("Ram").model("ProMaster").year(2022).build(),

                Vehicle.builder().vehicleNumber("TMS-BUS-001").type(VehicleType.BUS).capacity(50)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Bus Terminal, New York")
                        .make("Volvo").model("9700").year(2024).build(),
                Vehicle.builder().vehicleNumber("TMS-BUS-002").type(VehicleType.BUS).capacity(45)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Bus Terminal, Philadelphia")
                        .make("Blue Bird").model("Vision").year(2023).build(),

                Vehicle.builder().vehicleNumber("TMS-MNB-001").type(VehicleType.MINI_BUS).capacity(20)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Main Depot, New York")
                        .make("Toyota").model("Coaster").year(2024).build(),
                Vehicle.builder().vehicleNumber("TMS-MNB-002").type(VehicleType.MINI_BUS).capacity(15)
                        .status(VehicleStatus.AVAILABLE).currentLocation("Branch Office, Washington DC")
                        .make("Mercedes").model("Sprinter Minibus").year(2023).build()
        ));
    }

    // ───────────────────────────── Drivers ─────────────────────────────
    private List<Driver> seedDrivers() {
        return driverRepository.saveAll(List.of(
                Driver.builder().name("Mike Driver").licenseNumber("DL-2024-001")
                        .phone("+1-212-555-0101").email("mike@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Sarah Wilson").licenseNumber("DL-2024-002")
                        .phone("+1-212-555-0102").email("sarah@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Raj Patel").licenseNumber("DL-2024-003")
                        .phone("+1-212-555-0103").email("raj@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Carlos Rivera").licenseNumber("DL-2024-004")
                        .phone("+1-212-555-0104").email("carlos@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("James Thompson").licenseNumber("DL-2024-005")
                        .phone("+1-312-555-0105").email("james@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Amira Hassan").licenseNumber("DL-2024-006")
                        .phone("+1-312-555-0106").email("amira@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Tom O'Brien").licenseNumber("DL-2024-007")
                        .phone("+1-713-555-0107").email("tom@tms.com").status(DriverStatus.ACTIVE).build(),
                Driver.builder().name("Wei Zhang").licenseNumber("DL-2024-008")
                        .phone("+1-713-555-0108").email("wei@tms.com").status(DriverStatus.INACTIVE).build(),
                Driver.builder().name("Patricia Adams").licenseNumber("DL-2024-009")
                        .phone("+1-215-555-0109").email("patricia@tms.com").status(DriverStatus.INACTIVE).build(),
                Driver.builder().name("Nikolai Petrov").licenseNumber("DL-2024-010")
                        .phone("+1-202-555-0110").email("nikolai@tms.com").status(DriverStatus.ACTIVE).build()
        ));
    }

    // ───────────────────────────── Routes ─────────────────────────────
    private List<Route> seedRoutes() {
        return routeRepository.saveAll(List.of(
                Route.builder().origin("New York").destination("Boston")
                        .distance(346.0).estimatedTimeMinutes(240)
                        .description("NY to Boston via I-95 N").build(),
                Route.builder().origin("New York").destination("Philadelphia")
                        .distance(151.0).estimatedTimeMinutes(120)
                        .description("NY to Philly via NJ Turnpike").build(),
                Route.builder().origin("New York").destination("Washington DC")
                        .distance(365.0).estimatedTimeMinutes(270)
                        .description("NY to DC via I-95 S").build(),
                Route.builder().origin("Chicago").destination("Detroit")
                        .distance(382.0).estimatedTimeMinutes(280)
                        .description("Chicago to Detroit via I-94 E").build(),
                Route.builder().origin("Chicago").destination("Indianapolis")
                        .distance(265.0).estimatedTimeMinutes(200)
                        .description("Chicago to Indianapolis via I-65 S").build(),
                Route.builder().origin("Houston").destination("Dallas")
                        .distance(362.0).estimatedTimeMinutes(240)
                        .description("Houston to Dallas via I-45 N").build(),
                Route.builder().origin("Houston").destination("San Antonio")
                        .distance(317.0).estimatedTimeMinutes(200)
                        .description("Houston to San Antonio via I-10 W").build(),
                Route.builder().origin("Philadelphia").destination("Pittsburgh")
                        .distance(491.0).estimatedTimeMinutes(330)
                        .description("Philly to Pittsburgh via PA Turnpike").build(),
                Route.builder().origin("Boston").destination("Hartford")
                        .distance(160.0).estimatedTimeMinutes(120)
                        .description("Boston to Hartford via I-90 W / I-84 W").build(),
                Route.builder().origin("Washington DC").destination("Richmond")
                        .distance(171.0).estimatedTimeMinutes(130)
                        .description("DC to Richmond via I-95 S").build(),
                Route.builder().origin("New York").destination("Chicago")
                        .distance(1270.0).estimatedTimeMinutes(780)
                        .description("NY to Chicago via I-80 W (long-haul)").build(),
                Route.builder().origin("Dallas").destination("Houston")
                        .distance(362.0).estimatedTimeMinutes(240)
                        .description("Dallas to Houston via I-45 S (return leg)").build()
        ));
    }

    // ───────────────────────────── Lorry Receipts ─────────────────────────────
    private List<LorryReceipt> seedLorryReceipts() {
        return lrRepository.saveAll(List.of(
                // CREATED (awaiting pickup)
                LorryReceipt.builder().lrNumber("LR-2026-0001").consignor("ABC Industries").consignee("XYZ Traders")
                        .origin("New York").destination("Boston").material("Steel Pipes")
                        .weight(5000.0).quantity(100).status(LrStatus.CREATED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0002").consignor("Global Corp").consignee("Local Mart")
                        .origin("New York").destination("Philadelphia").material("Electronics")
                        .weight(2000.0).quantity(50).status(LrStatus.CREATED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0003").consignor("Metro Chemicals").consignee("Green Pharma")
                        .origin("Chicago").destination("Detroit").material("Pharmaceutical Raw Materials")
                        .weight(3500.0).quantity(75).status(LrStatus.CREATED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0004").consignor("Fresh Farms Co").consignee("City Grocers")
                        .origin("Houston").destination("Dallas").material("Frozen Foods")
                        .weight(8000.0).quantity(200).status(LrStatus.CREATED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0005").consignor("Textile Hub").consignee("Fashion Retail Ltd")
                        .origin("New York").destination("Washington DC").material("Cotton Fabric Rolls")
                        .weight(4500.0).quantity(120).status(LrStatus.CREATED).build(),

                // IN_TRANSIT
                LorryReceipt.builder().lrNumber("LR-2026-0006").consignor("AutoParts Inc").consignee("QuickFix Garage")
                        .origin("Philadelphia").destination("Pittsburgh").material("Auto Spare Parts")
                        .weight(1800.0).quantity(300).status(LrStatus.IN_TRANSIT).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0007").consignor("BuildRight Materials").consignee("SkyHigh Constructions")
                        .origin("New York").destination("Boston").material("Cement Bags")
                        .weight(12000.0).quantity(240).status(LrStatus.IN_TRANSIT).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0008").consignor("DataTech Solutions").consignee("CloudNet Inc")
                        .origin("Chicago").destination("Indianapolis").material("Server Equipment")
                        .weight(900.0).quantity(15).status(LrStatus.IN_TRANSIT).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0009").consignor("Fresh Farms Co").consignee("Healthy Bites")
                        .origin("Houston").destination("San Antonio").material("Organic Vegetables")
                        .weight(6000.0).quantity(150).status(LrStatus.IN_TRANSIT).build(),

                // DELIVERED
                LorryReceipt.builder().lrNumber("LR-2026-0010").consignor("Pacific Imports").consignee("East Coast Retail")
                        .origin("New York").destination("Philadelphia").material("Furniture")
                        .weight(7500.0).quantity(45).status(LrStatus.DELIVERED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0011").consignor("ABC Industries").consignee("MegaBuild Corp")
                        .origin("New York").destination("Washington DC").material("Structural Steel")
                        .weight(15000.0).quantity(60).status(LrStatus.DELIVERED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0012").consignor("Global Corp").consignee("TechZone Retail")
                        .origin("Boston").destination("Hartford").material("Laptops & Monitors")
                        .weight(1200.0).quantity(80).status(LrStatus.DELIVERED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0013").consignor("Metro Chemicals").consignee("CleanAll Products")
                        .origin("Houston").destination("Dallas").material("Cleaning Chemicals")
                        .weight(4000.0).quantity(180).status(LrStatus.DELIVERED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0014").consignor("Textile Hub").consignee("Stitch Masters")
                        .origin("Washington DC").destination("Richmond").material("Sewing Machines")
                        .weight(2200.0).quantity(30).status(LrStatus.DELIVERED).build(),
                LorryReceipt.builder().lrNumber("LR-2026-0015").consignor("AutoParts Inc").consignee("National Motors")
                        .origin("Chicago").destination("Detroit").material("Engine Components")
                        .weight(3000.0).quantity(500).status(LrStatus.DELIVERED).build()
        ));
    }

    // ───────────────────────────── Trips ─────────────────────────────
    private List<Trip> seedTrips(List<Vehicle> vehicles, List<Driver> drivers, List<LorryReceipt> lrs, List<Route> routes) {
        LocalDateTime now = LocalDateTime.now();

        // Route indexes: 0=NY→Boston(346), 1=NY→Philly(151), 2=NY→DC(365), 3=Chicago→Detroit(382),
        // 4=Chicago→Indy(265), 5=Houston→Dallas(362), 6=Houston→SA(317), 7=Philly→Pittsburgh(491),
        // 8=Boston→Hartford(160), 9=DC→Richmond(171), 10=NY→Chicago(1270), 11=Dallas→Houston(362)

        // --- PLANNED trips (future) ---
        Trip trip1 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(0))  // TRK-001
                .driver(drivers.get(0))    // Mike
                .route(routes.get(0))      // NY → Boston (346 km)
                .status(TripStatus.PLANNED)
                .startTime(now.plusDays(1).withHour(8).withMinute(0))
                .endTime(now.plusDays(1).withHour(16).withMinute(0))
                .notes("NY → Boston freight — steel pipes & cement")
                .lorryReceipts(List.of(lrs.get(0), lrs.get(6)))  // LR-0001, LR-0007
                .build());
        vehicles.get(0).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(0));

        Trip trip2 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(3))  // TRK-004
                .driver(drivers.get(2))    // Raj
                .route(routes.get(1))      // NY → Philly (151 km)
                .status(TripStatus.PLANNED)
                .startTime(now.plusDays(2).withHour(6).withMinute(0))
                .endTime(now.plusDays(2).withHour(12).withMinute(0))
                .notes("NY → Philadelphia electronics delivery")
                .lorryReceipts(List.of(lrs.get(1)))  // LR-0002
                .build());
        vehicles.get(3).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(3));

        Trip trip3 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(4))  // TRK-005
                .driver(drivers.get(6))    // Tom
                .route(routes.get(5))      // Houston → Dallas (362 km)
                .status(TripStatus.PLANNED)
                .startTime(now.plusDays(3).withHour(5).withMinute(30))
                .endTime(now.plusDays(3).withHour(11).withMinute(30))
                .notes("Houston → Dallas frozen food shipment")
                .lorryReceipts(List.of(lrs.get(3)))  // LR-0004
                .build());
        vehicles.get(4).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(4));

        Trip trip4 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(8))  // BUS-001
                .driver(drivers.get(4))    // James
                .route(routes.get(0))      // NY → Boston (346 km)
                .status(TripStatus.PLANNED)
                .startTime(now.plusDays(1).withHour(7).withMinute(0))
                .endTime(now.plusDays(1).withHour(11).withMinute(0))
                .notes("NY → Boston passenger bus service")
                .lorryReceipts(List.of())
                .build());
        vehicles.get(8).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(8));

        Trip trip5 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(10)) // MNB-001
                .driver(drivers.get(5))    // Amira
                .route(routes.get(2))      // NY → DC (365 km)
                .status(TripStatus.PLANNED)
                .startTime(now.plusDays(4).withHour(9).withMinute(0))
                .endTime(now.plusDays(4).withHour(14).withMinute(0))
                .notes("NY → Washington DC shuttle service")
                .lorryReceipts(List.of(lrs.get(4)))  // LR-0005
                .build());

        // --- IN_PROGRESS trips ---
        Trip trip6 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(5))  // VAN-001
                .driver(drivers.get(1))    // Sarah
                .route(routes.get(7))      // Philly → Pittsburgh (491 km)
                .status(TripStatus.IN_PROGRESS)
                .startTime(now.minusHours(3))
                .endTime(now.plusHours(3))
                .notes("Philly → Pittsburgh auto parts — in transit")
                .lorryReceipts(List.of(lrs.get(5)))  // LR-0006
                .build());
        vehicles.get(5).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(5));

        Trip trip7 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(2))  // TRK-003
                .driver(drivers.get(3))    // Carlos
                .route(routes.get(4))      // Chicago → Indianapolis (265 km)
                .status(TripStatus.IN_PROGRESS)
                .startTime(now.minusHours(2))
                .endTime(now.plusHours(4))
                .notes("Chicago → Indianapolis server equipment")
                .lorryReceipts(List.of(lrs.get(7)))  // LR-0008
                .build());
        vehicles.get(2).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(2));

        Trip trip8 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(9))  // BUS-002
                .driver(drivers.get(9))    // Nikolai
                .route(routes.get(6))      // Houston → San Antonio (317 km)
                .status(TripStatus.IN_PROGRESS)
                .startTime(now.minusHours(1))
                .endTime(now.plusHours(5))
                .notes("Houston → San Antonio express — organic goods")
                .lorryReceipts(List.of(lrs.get(8)))  // LR-0009
                .build());
        vehicles.get(9).setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicles.get(9));

        // --- COMPLETED trips (past) ---
        Trip trip9 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(6))  // VAN-002
                .driver(drivers.get(1))    // Sarah
                .route(routes.get(1))      // NY → Philly (151 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(5).withHour(8).withMinute(0))
                .endTime(now.minusDays(5).withHour(14).withMinute(0))
                .notes("NY → Philly furniture delivery — completed on time")
                .lorryReceipts(List.of(lrs.get(9)))  // LR-0010 (DELIVERED)
                .build());

        Trip trip10 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(0))  // TRK-001
                .driver(drivers.get(0))    // Mike
                .route(routes.get(2))      // NY → DC (365 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(7).withHour(6).withMinute(0))
                .endTime(now.minusDays(7).withHour(16).withMinute(0))
                .notes("NY → Washington DC structural steel — heavy load")
                .lorryReceipts(List.of(lrs.get(10))) // LR-0011 (DELIVERED)
                .build());

        Trip trip11 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(6))  // VAN-002
                .driver(drivers.get(4))    // James
                .route(routes.get(8))      // Boston → Hartford (160 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(3).withHour(9).withMinute(0))
                .endTime(now.minusDays(3).withHour(13).withMinute(0))
                .notes("Boston → Hartford laptops delivery")
                .lorryReceipts(List.of(lrs.get(11))) // LR-0012 (DELIVERED)
                .build());

        Trip trip12 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(4))  // TRK-005
                .driver(drivers.get(6))    // Tom
                .route(routes.get(5))      // Houston → Dallas (362 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(10).withHour(5).withMinute(0))
                .endTime(now.minusDays(10).withHour(11).withMinute(0))
                .notes("Houston → Dallas cleaning chemicals")
                .lorryReceipts(List.of(lrs.get(12))) // LR-0013 (DELIVERED)
                .build());

        Trip trip13 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(11)) // MNB-002
                .driver(drivers.get(9))    // Nikolai
                .route(routes.get(9))      // DC → Richmond (171 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(6).withHour(10).withMinute(0))
                .endTime(now.minusDays(6).withHour(14).withMinute(0))
                .notes("DC → Richmond sewing machines")
                .lorryReceipts(List.of(lrs.get(13))) // LR-0014 (DELIVERED)
                .build());

        Trip trip14 = tripRepository.save(Trip.builder()
                .vehicle(vehicles.get(2))  // TRK-003
                .driver(drivers.get(3))    // Carlos
                .route(routes.get(3))      // Chicago → Detroit (382 km)
                .status(TripStatus.COMPLETED)
                .startTime(now.minusDays(8).withHour(4).withMinute(0))
                .endTime(now.minusDays(8).withHour(12).withMinute(0))
                .notes("Chicago → Detroit engine components — completed")
                .lorryReceipts(List.of(lrs.get(14))) // LR-0015 (DELIVERED)
                .build());

        return List.of(trip1, trip2, trip3, trip4, trip5, trip6, trip7, trip8,
                trip9, trip10, trip11, trip12, trip13, trip14);
    }

    // ───────────────────────────── Bookings ─────────────────────────────
    private void seedBookings(List<Trip> trips) {
        // Bookings for trip4 — planned bus NY→Boston (capacity 50)
        Trip busTripNYBoston = trips.get(3);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("Jane Client").customerPhone("+1-646-555-0201")
                        .customerEmail("jane@example.com").trip(busTripNYBoston).seatCount(2)
                        .status(BookingStatus.CONFIRMED).notes("Window seats preferred").build(),
                Booking.builder().customerName("Ahmed Khan").customerPhone("+1-646-555-0202")
                        .customerEmail("ahmed@example.com").trip(busTripNYBoston).seatCount(4)
                        .status(BookingStatus.CONFIRMED).notes("Family trip — 2 adults, 2 children").build(),
                Booking.builder().customerName("Lisa Wong").customerPhone("+1-646-555-0203")
                        .customerEmail("lisa@example.com").trip(busTripNYBoston).seatCount(1)
                        .status(BookingStatus.CONFIRMED).notes("Business travel").build(),
                Booking.builder().customerName("David Brown").customerPhone("+1-646-555-0204")
                        .customerEmail("david@example.com").trip(busTripNYBoston).seatCount(3)
                        .status(BookingStatus.CANCELLED).notes("Plans changed — cancelled by customer").build(),
                Booking.builder().customerName("Maria Garcia").customerPhone("+1-646-555-0205")
                        .customerEmail("maria@example.com").trip(busTripNYBoston).seatCount(2)
                        .status(BookingStatus.CONFIRMED).notes(null).build()
        ));

        // Bookings for trip5 — planned mini-bus NY→DC (capacity 20)
        Trip minibusTripNYDC = trips.get(4);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("Robert Fernandez").customerPhone("+1-202-555-0301")
                        .customerEmail("robert.f@example.com").trip(minibusTripNYDC).seatCount(5)
                        .status(BookingStatus.CONFIRMED).notes("Group booking — colleagues").build(),
                Booking.builder().customerName("Priya Nair").customerPhone("+1-202-555-0302")
                        .customerEmail("priya.n@example.com").trip(minibusTripNYDC).seatCount(2)
                        .status(BookingStatus.CONFIRMED).notes(null).build(),
                Booking.builder().customerName("Tom Henderson").customerPhone("+1-202-555-0303")
                        .customerEmail("tom.h@example.com").trip(minibusTripNYDC).seatCount(1)
                        .status(BookingStatus.CANCELLED).notes("Rescheduled to next week").build()
        ));

        // Bookings for trip1 — planned freight NY→Boston (freight trips can have bookings too)
        Trip freightTrip1 = trips.get(0);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("ABC Industries").customerPhone("+1-800-555-0401")
                        .customerEmail("logistics@abcindustries.com").trip(freightTrip1).seatCount(1)
                        .status(BookingStatus.CONFIRMED).notes("Freight booking — steel pipes consignment").build(),
                Booking.builder().customerName("BuildRight Materials").customerPhone("+1-800-555-0402")
                        .customerEmail("dispatch@buildright.com").trip(freightTrip1).seatCount(1)
                        .status(BookingStatus.CONFIRMED).notes("Freight booking — cement bags").build()
        ));

        // Bookings for completed trips (trip9 — NY→Philly)
        Trip completedTrip1 = trips.get(8);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("Pacific Imports").customerPhone("+1-800-555-0501")
                        .customerEmail("ops@pacificimports.com").trip(completedTrip1).seatCount(1)
                        .status(BookingStatus.COMPLETED).notes("Furniture delivery completed successfully").build()
        ));

        // Bookings for completed trips (trip11 — Boston→Hartford)
        Trip completedTrip2 = trips.get(10);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("Global Corp").customerPhone("+1-800-555-0601")
                        .customerEmail("shipping@globalcorp.com").trip(completedTrip2).seatCount(1)
                        .status(BookingStatus.COMPLETED).notes("Laptops delivered — POD signed").build(),
                Booking.builder().customerName("TechZone Retail").customerPhone("+1-800-555-0602")
                        .customerEmail("receiving@techzone.com").trip(completedTrip2).seatCount(1)
                        .status(BookingStatus.COMPLETED).notes("Monitors received in good condition").build()
        ));

        // Bookings for in-progress trip (trip6 — Philly→Pittsburgh)
        Trip inProgressTrip = trips.get(5);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("AutoParts Inc").customerPhone("+1-800-555-0701")
                        .customerEmail("orders@autoparts.com").trip(inProgressTrip).seatCount(1)
                        .status(BookingStatus.CONFIRMED).notes("Spare parts shipment — handle with care").build()
        ));

        // Bookings for in-progress bus trip (trip8 — Houston→San Antonio)
        Trip inProgressBus = trips.get(7);
        bookingRepository.saveAll(List.of(
                Booking.builder().customerName("Elena Martinez").customerPhone("+1-210-555-0801")
                        .customerEmail("elena.m@example.com").trip(inProgressBus).seatCount(3)
                        .status(BookingStatus.CONFIRMED).notes("Traveling with elderly parents").build(),
                Booking.builder().customerName("Kevin Wright").customerPhone("+1-210-555-0802")
                        .customerEmail("kevin.w@example.com").trip(inProgressBus).seatCount(1)
                        .status(BookingStatus.CONFIRMED).notes(null).build(),
                Booking.builder().customerName("Sophia Lee").customerPhone("+1-210-555-0803")
                        .customerEmail("sophia.l@example.com").trip(inProgressBus).seatCount(2)
                        .status(BookingStatus.CANCELLED).notes("Flight booked instead").build()
        ));
    }

    // ───────────────────────────── Expenses (incl. Fuel) ─────────────────────────────
    private void seedExpenses(List<Trip> trips, List<Vehicle> vehicles) {
        LocalDate today = LocalDate.now();

        // Completed trip9 — VAN-002, NY→Philly (5 days ago)
        Trip t9 = trips.get(8);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t9).vehicle(vehicles.get(6)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("4500.00")).description("Diesel fill-up before trip")
                        .expenseDate(today.minusDays(5)).build(),
                Expense.builder().trip(t9).vehicle(vehicles.get(6)).category(ExpenseCategory.TOLL)
                        .amount(new BigDecimal("350.00")).description("NJ Turnpike toll")
                        .expenseDate(today.minusDays(5)).build()
        ));

        // Completed trip10 — TRK-001, NY→DC (7 days ago)
        Trip t10 = trips.get(9);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t10).vehicle(vehicles.get(0)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("12500.00")).description("Full tank diesel — heavy load")
                        .expenseDate(today.minusDays(7)).build(),
                Expense.builder().trip(t10).vehicle(vehicles.get(0)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("3200.00")).description("Top-up en route near Delaware")
                        .expenseDate(today.minusDays(7)).build(),
                Expense.builder().trip(t10).vehicle(vehicles.get(0)).category(ExpenseCategory.TOLL)
                        .amount(new BigDecimal("800.00")).description("I-95 toll charges")
                        .expenseDate(today.minusDays(7)).build(),
                Expense.builder().trip(t10).vehicle(vehicles.get(0)).category(ExpenseCategory.DRIVER_ALLOWANCE)
                        .amount(new BigDecimal("1500.00")).description("Driver daily allowance")
                        .expenseDate(today.minusDays(7)).build()
        ));

        // Completed trip11 — VAN-002, Boston→Hartford (3 days ago)
        Trip t11 = trips.get(10);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t11).vehicle(vehicles.get(6)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("3800.00")).description("Diesel fill-up Boston depot")
                        .expenseDate(today.minusDays(3)).build(),
                Expense.builder().trip(t11).vehicle(vehicles.get(6)).category(ExpenseCategory.TOLL)
                        .amount(new BigDecimal("200.00")).description("Mass Turnpike toll")
                        .expenseDate(today.minusDays(3)).build()
        ));

        // Completed trip12 — TRK-005, Houston→Dallas (10 days ago)
        Trip t12 = trips.get(11);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t12).vehicle(vehicles.get(4)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("11800.00")).description("Full tank before Houston departure")
                        .expenseDate(today.minusDays(10)).build(),
                Expense.builder().trip(t12).vehicle(vehicles.get(4)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("2500.00")).description("Top-up midway near Huntsville")
                        .expenseDate(today.minusDays(10)).build(),
                Expense.builder().trip(t12).vehicle(vehicles.get(4)).category(ExpenseCategory.DRIVER_ALLOWANCE)
                        .amount(new BigDecimal("1200.00")).description("Driver allowance")
                        .expenseDate(today.minusDays(10)).build()
        ));

        // Completed trip13 — MNB-002, DC→Richmond (6 days ago)
        Trip t13 = trips.get(12);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t13).vehicle(vehicles.get(11)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("3500.00")).description("Fuel — DC depot")
                        .expenseDate(today.minusDays(6)).build(),
                Expense.builder().trip(t13).vehicle(vehicles.get(11)).category(ExpenseCategory.TOLL)
                        .amount(new BigDecimal("250.00")).description("I-95 toll")
                        .expenseDate(today.minusDays(6)).build()
        ));

        // Completed trip14 — TRK-003, Chicago→Detroit (8 days ago)
        Trip t14 = trips.get(13);
        expenseRepository.saveAll(List.of(
                Expense.builder().trip(t14).vehicle(vehicles.get(2)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("9800.00")).description("Diesel — Chicago depot")
                        .expenseDate(today.minusDays(8)).build(),
                Expense.builder().trip(t14).vehicle(vehicles.get(2)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("4200.00")).description("Top-up near Kalamazoo")
                        .expenseDate(today.minusDays(8)).build(),
                Expense.builder().trip(t14).vehicle(vehicles.get(2)).category(ExpenseCategory.MAINTENANCE)
                        .amount(new BigDecimal("2800.00")).description("Tire rotation pre-trip")
                        .expenseDate(today.minusDays(9)).build(),
                Expense.builder().trip(t14).vehicle(vehicles.get(2)).category(ExpenseCategory.TOLL)
                        .amount(new BigDecimal("450.00")).description("Indiana Toll Road + Michigan tolls")
                        .expenseDate(today.minusDays(8)).build()
        ));

        // Additional standalone fuel expenses (older, for monthly trend data)
        expenseRepository.saveAll(List.of(
                Expense.builder().vehicle(vehicles.get(0)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("8500.00")).description("Monthly fuel — TRK-001")
                        .expenseDate(today.minusDays(35)).build(),
                Expense.builder().vehicle(vehicles.get(2)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("7200.00")).description("Monthly fuel — TRK-003")
                        .expenseDate(today.minusDays(40)).build(),
                Expense.builder().vehicle(vehicles.get(4)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("9100.00")).description("Monthly fuel — TRK-005")
                        .expenseDate(today.minusDays(45)).build(),
                Expense.builder().vehicle(vehicles.get(6)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("3200.00")).description("Monthly fuel — VAN-002")
                        .expenseDate(today.minusDays(38)).build(),
                Expense.builder().vehicle(vehicles.get(11)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("2800.00")).description("Monthly fuel — MNB-002")
                        .expenseDate(today.minusDays(42)).build(),
                Expense.builder().vehicle(vehicles.get(0)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("10200.00")).description("Monthly fuel — TRK-001")
                        .expenseDate(today.minusDays(65)).build(),
                Expense.builder().vehicle(vehicles.get(2)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("8800.00")).description("Monthly fuel — TRK-003")
                        .expenseDate(today.minusDays(70)).build(),
                Expense.builder().vehicle(vehicles.get(4)).category(ExpenseCategory.FUEL)
                        .amount(new BigDecimal("11500.00")).description("Monthly fuel — TRK-005")
                        .expenseDate(today.minusDays(75)).build()
        ));
    }

    // ───────────────────────────── Audit Logs ─────────────────────────────
    private void seedAuditLogs(List<Vehicle> vehicles, List<Driver> drivers, List<Trip> trips) {
        LocalDateTime now = LocalDateTime.now();

        auditLogRepository.saveAll(List.of(
                // User creation logs
                AuditLog.builder().entityType("User").entityId("admin").action(AuditAction.CREATE)
                        .changedBy("system").timestamp(now.minusDays(30))
                        .newValue("{\"username\":\"admin\",\"role\":\"ADMIN\",\"email\":\"admin@tms.com\"}").build(),
                AuditLog.builder().entityType("User").entityId("dispatcher").action(AuditAction.CREATE)
                        .changedBy("admin").timestamp(now.minusDays(28))
                        .newValue("{\"username\":\"dispatcher\",\"role\":\"DISPATCHER\",\"email\":\"dispatcher@tms.com\"}").build(),
                AuditLog.builder().entityType("User").entityId("driver1").action(AuditAction.CREATE)
                        .changedBy("admin").timestamp(now.minusDays(28))
                        .newValue("{\"username\":\"driver1\",\"role\":\"DRIVER\",\"email\":\"driver1@tms.com\"}").build(),

                // Vehicle creation & updates
                AuditLog.builder().entityType("Vehicle").entityId(vehicles.get(0).getId().toString()).action(AuditAction.CREATE)
                        .changedBy("admin").timestamp(now.minusDays(25))
                        .newValue("{\"vehicleNumber\":\"TMS-TRK-001\",\"type\":\"TRUCK\",\"status\":\"AVAILABLE\"}").build(),
                AuditLog.builder().entityType("Vehicle").entityId(vehicles.get(1).getId().toString()).action(AuditAction.CREATE)
                        .changedBy("admin").timestamp(now.minusDays(25))
                        .newValue("{\"vehicleNumber\":\"TMS-TRK-002\",\"type\":\"TRUCK\",\"status\":\"AVAILABLE\"}").build(),
                AuditLog.builder().entityType("Vehicle").entityId(vehicles.get(1).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(20))
                        .oldValue("{\"status\":\"AVAILABLE\"}")
                        .newValue("{\"status\":\"MAINTENANCE\"}").build(),

                // Driver updates
                AuditLog.builder().entityType("Driver").entityId(drivers.get(7).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("admin").timestamp(now.minusDays(15))
                        .oldValue("{\"status\":\"ACTIVE\"}")
                        .newValue("{\"status\":\"INACTIVE\"}").build(),

                // Trip lifecycle logs
                AuditLog.builder().entityType("Trip").entityId(trips.get(8).getId().toString()).action(AuditAction.CREATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(6))
                        .newValue("{\"vehicle\":\"TMS-VAN-002\",\"driver\":\"Sarah Wilson\",\"status\":\"PLANNED\"}").build(),
                AuditLog.builder().entityType("Trip").entityId(trips.get(8).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(5).withHour(8))
                        .oldValue("{\"status\":\"PLANNED\"}")
                        .newValue("{\"status\":\"IN_PROGRESS\"}").build(),
                AuditLog.builder().entityType("Trip").entityId(trips.get(8).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(5).withHour(14))
                        .oldValue("{\"status\":\"IN_PROGRESS\"}")
                        .newValue("{\"status\":\"COMPLETED\"}").build(),

                AuditLog.builder().entityType("Trip").entityId(trips.get(9).getId().toString()).action(AuditAction.CREATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(8))
                        .newValue("{\"vehicle\":\"TMS-TRK-001\",\"driver\":\"Mike Driver\",\"status\":\"PLANNED\"}").build(),
                AuditLog.builder().entityType("Trip").entityId(trips.get(9).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(7).withHour(6))
                        .oldValue("{\"status\":\"PLANNED\"}")
                        .newValue("{\"status\":\"IN_PROGRESS\"}").build(),
                AuditLog.builder().entityType("Trip").entityId(trips.get(9).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(7).withHour(16))
                        .oldValue("{\"status\":\"IN_PROGRESS\"}")
                        .newValue("{\"status\":\"COMPLETED\"}").build(),

                // Booking logs
                AuditLog.builder().entityType("Booking").entityId("1").action(AuditAction.CREATE)
                        .changedBy("client1").timestamp(now.minusDays(4))
                        .newValue("{\"customerName\":\"Jane Client\",\"seatCount\":2,\"status\":\"CONFIRMED\"}").build(),
                AuditLog.builder().entityType("Booking").entityId("4").action(AuditAction.UPDATE)
                        .changedBy("client4").timestamp(now.minusDays(3))
                        .oldValue("{\"status\":\"CONFIRMED\"}")
                        .newValue("{\"status\":\"CANCELLED\"}").build(),

                // Expense logs
                AuditLog.builder().entityType("Expense").entityId("fuel-001").action(AuditAction.CREATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(7))
                        .newValue("{\"category\":\"FUEL\",\"amount\":12500,\"vehicle\":\"TMS-TRK-001\"}").build(),
                AuditLog.builder().entityType("Expense").entityId("toll-001").action(AuditAction.CREATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(7))
                        .newValue("{\"category\":\"TOLL\",\"amount\":800,\"vehicle\":\"TMS-TRK-001\"}").build(),

                // LR status updates
                AuditLog.builder().entityType("LorryReceipt").entityId("LR-2026-0010").action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(5))
                        .oldValue("{\"status\":\"IN_TRANSIT\"}")
                        .newValue("{\"status\":\"DELIVERED\"}").build(),
                AuditLog.builder().entityType("LorryReceipt").entityId("LR-2026-0006").action(AuditAction.UPDATE)
                        .changedBy("dispatcher").timestamp(now.minusDays(3))
                        .oldValue("{\"status\":\"CREATED\"}")
                        .newValue("{\"status\":\"IN_TRANSIT\"}").build(),

                // User role change
                AuditLog.builder().entityType("User").entityId("client1").action(AuditAction.UPDATE)
                        .changedBy("admin").timestamp(now.minusDays(10))
                        .oldValue("{\"role\":\"CLIENT\",\"active\":true}")
                        .newValue("{\"role\":\"CLIENT\",\"active\":true}").build(),

                // Vehicle location update
                AuditLog.builder().entityType("Vehicle").entityId(vehicles.get(5).getId().toString()).action(AuditAction.UPDATE)
                        .changedBy("system").timestamp(now.minusHours(3))
                        .oldValue("{\"latitude\":null,\"longitude\":null}")
                        .newValue("{\"latitude\":39.95,\"longitude\":-75.17,\"currentLocation\":\"En route to Pittsburgh\"}").build(),

                // Geofence creation
                AuditLog.builder().entityType("Geofence").entityId("ny-depot").action(AuditAction.CREATE)
                        .changedBy("admin").timestamp(now.minusDays(2))
                        .newValue("{\"name\":\"NY Main Depot\",\"type\":\"DEPOT\",\"radiusMeters\":500}").build()
        ));
    }

    // ───────────────────────────── Geofences ─────────────────────────────
    private void seedGeofences() {
        geofenceRepository.saveAll(List.of(
                Geofence.builder().name("NY Main Depot").description("Main depot in New York City")
                        .latitude(40.7128).longitude(-74.006).radiusMeters(500.0)
                        .type(GeofenceType.DEPOT).build(),
                Geofence.builder().name("Chicago Warehouse").description("Chicago distribution warehouse")
                        .latitude(41.8781).longitude(-87.6298).radiusMeters(750.0)
                        .type(GeofenceType.DEPOT).build(),
                Geofence.builder().name("Houston Logistics Park").description("Houston logistics and loading area")
                        .latitude(29.7604).longitude(-95.3698).radiusMeters(1000.0)
                        .type(GeofenceType.DELIVERY_ZONE).build(),
                Geofence.builder().name("Philadelphia Restricted").description("Restricted zone - no unauthorized entry")
                        .latitude(39.9526).longitude(-75.1652).radiusMeters(300.0)
                        .type(GeofenceType.RESTRICTED_ZONE).build()
        ));
    }
}
