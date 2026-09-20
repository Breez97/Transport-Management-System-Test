-- ============================================================================
-- V2__seed_demo_data.sql
-- Production-grade demo data for Transport Management System
--
-- Covers all entities with realistic data across every status.
--   • 14 users   (ADMIN, DISPATCHER, DRIVER, CLIENT)
--   • 12 vehicles (TRUCK, VAN, BUS, MINI_BUS — AVAILABLE / BUSY / MAINTENANCE)
--   • 10 drivers  (ACTIVE / INACTIVE)
--   • 12 routes   (major US city pairs)
--   • 15 lorry receipts (CREATED / IN_TRANSIT / DELIVERED)
--   • 14 trips    (PLANNED / IN_PROGRESS / COMPLETED)
--   • 18 bookings (CONFIRMED / CANCELLED / COMPLETED)
--
-- Login credentials (all BCrypt-encoded):
--   admin     / admin123      (ADMIN)
--   dispatcher/ dispatch123   (DISPATCHER)
--   driver1   / driver123     (DRIVER)
--   client1   / client123     (CLIENT)
-- ============================================================================

-- ─── Guard: skip if data already exists ─────────────────────────────────────
DO $$
BEGIN
    IF (SELECT count(*) FROM users) > 0 THEN
        RAISE NOTICE 'Demo data already present — skipping V2 seed.';
        RETURN;
    END IF;

-- ═══════════════════════════════════════════════════════════════════════════
-- USERS
-- ═══════════════════════════════════════════════════════════════════════════
-- BCrypt hashes:  admin123    = $2a$10$pyDdfcKxAzocbEIb1/Bnzui7HDbrgBc2Dlowlb8vW5m1zE5YbggpK
--                 dispatch123 = $2a$10$DTrJIn7wlPFXArswaZAXJu4fjoxj64uFLcC5649bMqzVIrzcxKTFK
--                 driver123   = $2a$10$pE4evsOcgZVLigC.58rph.Na4C.gCXC/3XNk97GzVLwaYJDNSyMja
--                 client123   = $2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G

INSERT INTO users (id, username, email, password, full_name, role, active, created_at, updated_at, created_by)
VALUES
  -- Admins
  ('a0000000-0000-0000-0000-000000000001', 'admin',       'admin@tms.com',       '$2a$10$pyDdfcKxAzocbEIb1/Bnzui7HDbrgBc2Dlowlb8vW5m1zE5YbggpK', 'System Administrator', 'ADMIN',      true, NOW() - INTERVAL '90 days', NOW(), 'system'),
  ('a0000000-0000-0000-0000-000000000002', 'admin2',      'admin2@tms.com',      '$2a$10$pyDdfcKxAzocbEIb1/Bnzui7HDbrgBc2Dlowlb8vW5m1zE5YbggpK', 'Emily Carter',         'ADMIN',      true, NOW() - INTERVAL '85 days', NOW(), 'system'),
  -- Dispatchers
  ('a0000000-0000-0000-0000-000000000003', 'dispatcher',  'dispatcher@tms.com',  '$2a$10$DTrJIn7wlPFXArswaZAXJu4fjoxj64uFLcC5649bMqzVIrzcxKTFK', 'John Dispatcher',      'DISPATCHER', true, NOW() - INTERVAL '80 days', NOW(), 'admin'),
  ('a0000000-0000-0000-0000-000000000004', 'dispatcher2', 'dispatcher2@tms.com', '$2a$10$DTrJIn7wlPFXArswaZAXJu4fjoxj64uFLcC5649bMqzVIrzcxKTFK', 'Olivia Bennett',       'DISPATCHER', true, NOW() - INTERVAL '75 days', NOW(), 'admin'),
  ('a0000000-0000-0000-0000-000000000005', 'dispatcher3', 'dispatcher3@tms.com', '$2a$10$DTrJIn7wlPFXArswaZAXJu4fjoxj64uFLcC5649bMqzVIrzcxKTFK', 'Robert Chen',          'DISPATCHER', true, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  -- Drivers
  ('a0000000-0000-0000-0000-000000000006', 'driver1',     'driver1@tms.com',     '$2a$10$pE4evsOcgZVLigC.58rph.Na4C.gCXC/3XNk97GzVLwaYJDNSyMja', 'Mike Driver',          'DRIVER',     true, NOW() - INTERVAL '70 days', NOW(), 'admin'),
  ('a0000000-0000-0000-0000-000000000007', 'driver2',     'driver2@tms.com',     '$2a$10$pE4evsOcgZVLigC.58rph.Na4C.gCXC/3XNk97GzVLwaYJDNSyMja', 'Sarah Wilson',         'DRIVER',     true, NOW() - INTERVAL '68 days', NOW(), 'admin'),
  ('a0000000-0000-0000-0000-000000000008', 'driver3',     'driver3@tms.com',     '$2a$10$pE4evsOcgZVLigC.58rph.Na4C.gCXC/3XNk97GzVLwaYJDNSyMja', 'Ethan Parker',         'DRIVER',     true, NOW() - INTERVAL '65 days', NOW(), 'admin'),
  ('a0000000-0000-0000-0000-000000000009', 'driver4',     'driver4@tms.com',     '$2a$10$pE4evsOcgZVLigC.58rph.Na4C.gCXC/3XNk97GzVLwaYJDNSyMja', 'Carlos Rivera',        'DRIVER',     true, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  -- Clients
  ('a0000000-0000-0000-0000-000000000010', 'client1',     'client1@tms.com',     '$2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G', 'Jane Client',          'CLIENT',     true, NOW() - INTERVAL '55 days', NOW(), 'system'),
  ('a0000000-0000-0000-0000-000000000011', 'client2',     'client2@tms.com',     '$2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G', 'Ahmed Khan',           'CLIENT',     true, NOW() - INTERVAL '50 days', NOW(), 'system'),
  ('a0000000-0000-0000-0000-000000000012', 'client3',     'client3@tms.com',     '$2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G', 'Lisa Wong',            'CLIENT',     true, NOW() - INTERVAL '45 days', NOW(), 'system'),
  ('a0000000-0000-0000-0000-000000000013', 'client4',     'client4@tms.com',     '$2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G', 'David Brown',          'CLIENT',     true, NOW() - INTERVAL '40 days', NOW(), 'system'),
  ('a0000000-0000-0000-0000-000000000014', 'client5',     'client5@tms.com',     '$2a$10$aaaLMZ3tX3bh2pJCSvABQeRBfDzEAKCaaHmX9axYQ/1iKJKm8LR6G', 'Maria Garcia',         'CLIENT',     true, NOW() - INTERVAL '30 days', NOW(), 'system');


-- ═══════════════════════════════════════════════════════════════════════════
-- VEHICLES  (5 trucks, 3 vans, 2 buses, 2 mini-buses)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO vehicles (id, vehicle_number, type, capacity, status, current_location, make, model, manufacture_year, created_at, updated_at, created_by)
VALUES
  -- Trucks
  ('b0000000-0000-0000-0000-000000000001', 'TMS-TRK-001', 'TRUCK',    20, 'AVAILABLE',   'Main Depot, New York',        'Volvo',    'FH16',     2023, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000002', 'TMS-TRK-002', 'TRUCK',    30, 'MAINTENANCE',  'Service Center, Newark',      'Tata',     'Prima',    2022, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000003', 'TMS-TRK-003', 'TRUCK',    25, 'AVAILABLE',   'Warehouse, Chicago',          'Scania',   'R500',     2024, NOW() - INTERVAL '45 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000004', 'TMS-TRK-004', 'TRUCK',    18, 'AVAILABLE',   'Main Depot, New York',        'MAN',      'TGX',      2023, NOW() - INTERVAL '50 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000005', 'TMS-TRK-005', 'TRUCK',    35, 'AVAILABLE',   'Logistics Park, Houston',     'Kenworth', 'T680',     2024, NOW() - INTERVAL '30 days', NOW(), 'admin'),
  -- Vans
  ('b0000000-0000-0000-0000-000000000006', 'TMS-VAN-001', 'VAN',       5, 'AVAILABLE',   'Main Depot, New York',        'Mercedes', 'Sprinter', 2024, NOW() - INTERVAL '55 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000007', 'TMS-VAN-002', 'VAN',       4, 'AVAILABLE',   'Branch Office, Boston',       'Ford',     'Transit',  2023, NOW() - INTERVAL '50 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000008', 'TMS-VAN-003', 'VAN',       6, 'MAINTENANCE',  'Service Center, Newark',      'Ram',      'ProMaster',2022, NOW() - INTERVAL '50 days', NOW(), 'admin'),
  -- Buses
  ('b0000000-0000-0000-0000-000000000009', 'TMS-BUS-001', 'BUS',      50, 'AVAILABLE',   'Bus Terminal, New York',      'Volvo',    '9700',     2024, NOW() - INTERVAL '40 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000010', 'TMS-BUS-002', 'BUS',      45, 'AVAILABLE',   'Bus Terminal, Philadelphia',  'Blue Bird','Vision',   2023, NOW() - INTERVAL '40 days', NOW(), 'admin'),
  -- Mini-buses
  ('b0000000-0000-0000-0000-000000000011', 'TMS-MNB-001', 'MINI_BUS', 20, 'AVAILABLE',   'Main Depot, New York',        'Toyota',   'Coaster',  2024, NOW() - INTERVAL '35 days', NOW(), 'admin'),
  ('b0000000-0000-0000-0000-000000000012', 'TMS-MNB-002', 'MINI_BUS', 15, 'AVAILABLE',   'Branch Office, Washington DC','Mercedes', 'Sprinter Minibus', 2023, NOW() - INTERVAL '35 days', NOW(), 'admin');


-- ═══════════════════════════════════════════════════════════════════════════
-- DRIVERS  (8 active, 2 inactive)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO drivers (id, name, phone, license_number, email, status, created_at, updated_at, created_by)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Mike Driver',      '+1-212-555-0101', 'DL-2024-001', 'mike@tms.com',     'ACTIVE',   NOW() - INTERVAL '70 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000002', 'Sarah Wilson',     '+1-212-555-0102', 'DL-2024-002', 'sarah@tms.com',    'ACTIVE',   NOW() - INTERVAL '68 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000003', 'Raj Patel',        '+1-212-555-0103', 'DL-2024-003', 'raj@tms.com',      'ACTIVE',   NOW() - INTERVAL '65 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000004', 'Carlos Rivera',    '+1-212-555-0104', 'DL-2024-004', 'carlos@tms.com',   'ACTIVE',   NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000005', 'James Thompson',   '+1-312-555-0105', 'DL-2024-005', 'james@tms.com',    'ACTIVE',   NOW() - INTERVAL '55 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000006', 'Amira Hassan',     '+1-312-555-0106', 'DL-2024-006', 'amira@tms.com',    'ACTIVE',   NOW() - INTERVAL '55 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000007', 'Tom O''Brien',     '+1-713-555-0107', 'DL-2024-007', 'tom@tms.com',      'ACTIVE',   NOW() - INTERVAL '50 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000008', 'Wei Zhang',        '+1-713-555-0108', 'DL-2024-008', 'wei@tms.com',      'INACTIVE', NOW() - INTERVAL '45 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000009', 'Patricia Adams',   '+1-215-555-0109', 'DL-2024-009', 'patricia@tms.com', 'INACTIVE', NOW() - INTERVAL '45 days', NOW(), 'admin'),
  ('c0000000-0000-0000-0000-000000000010', 'Nikolai Petrov',   '+1-202-555-0110', 'DL-2024-010', 'nikolai@tms.com',  'ACTIVE',   NOW() - INTERVAL '40 days', NOW(), 'admin');


-- ═══════════════════════════════════════════════════════════════════════════
-- ROUTES  (12 major US city pairs)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO routes (origin, destination, distance, estimated_time_minutes, description, active, created_at, updated_at, created_by)
VALUES
  ('New York',      'Boston',        346.0,  240, 'NY to Boston via I-95 N',                    true, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('New York',      'Philadelphia',  151.0,  120, 'NY to Philly via NJ Turnpike',               true, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('New York',      'Washington DC', 365.0,  270, 'NY to DC via I-95 S',                        true, NOW() - INTERVAL '60 days', NOW(), 'admin'),
  ('Chicago',       'Detroit',       382.0,  280, 'Chicago to Detroit via I-94 E',               true, NOW() - INTERVAL '55 days', NOW(), 'admin'),
  ('Chicago',       'Indianapolis',  265.0,  200, 'Chicago to Indianapolis via I-65 S',          true, NOW() - INTERVAL '55 days', NOW(), 'admin'),
  ('Houston',       'Dallas',        362.0,  240, 'Houston to Dallas via I-45 N',                true, NOW() - INTERVAL '50 days', NOW(), 'admin'),
  ('Houston',       'San Antonio',   317.0,  200, 'Houston to San Antonio via I-10 W',           true, NOW() - INTERVAL '50 days', NOW(), 'admin'),
  ('Philadelphia',  'Pittsburgh',    491.0,  330, 'Philly to Pittsburgh via PA Turnpike',         true, NOW() - INTERVAL '45 days', NOW(), 'admin'),
  ('Boston',        'Hartford',      160.0,  120, 'Boston to Hartford via I-90 W / I-84 W',      true, NOW() - INTERVAL '45 days', NOW(), 'admin'),
  ('Washington DC', 'Richmond',      171.0,  130, 'DC to Richmond via I-95 S',                   true, NOW() - INTERVAL '40 days', NOW(), 'admin'),
  ('New York',      'Chicago',      1270.0,  780, 'NY to Chicago via I-80 W (long-haul)',         true, NOW() - INTERVAL '40 days', NOW(), 'admin'),
  ('Dallas',        'Houston',       362.0,  240, 'Dallas to Houston via I-45 S (return leg)',    true, NOW() - INTERVAL '35 days', NOW(), 'admin');


-- ═══════════════════════════════════════════════════════════════════════════
-- LORRY RECEIPTS  (5 CREATED, 4 IN_TRANSIT, 6 DELIVERED)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO lorry_receipts (id, lr_number, consignor, consignee, origin, destination, material, weight, quantity, status, created_at, updated_at, created_by)
VALUES
  -- CREATED (awaiting pickup)
  ('d0000000-0000-0000-0000-000000000001', 'LR-2026-0001', 'ABC Industries',      'XYZ Traders',           'New York',     'Boston',        'Steel Pipes',                 5000.0,  100, 'CREATED',    NOW() - INTERVAL '5 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000002', 'LR-2026-0002', 'Global Corp',         'Local Mart',            'New York',     'Philadelphia',  'Electronics',                 2000.0,   50, 'CREATED',    NOW() - INTERVAL '4 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000003', 'LR-2026-0003', 'Metro Chemicals',     'Green Pharma',          'Chicago',      'Detroit',       'Pharmaceutical Raw Materials', 3500.0,   75, 'CREATED',    NOW() - INTERVAL '3 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000004', 'LR-2026-0004', 'Fresh Farms Co',      'City Grocers',          'Houston',      'Dallas',        'Frozen Foods',                8000.0,  200, 'CREATED',    NOW() - INTERVAL '2 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000005', 'LR-2026-0005', 'Textile Hub',         'Fashion Retail Ltd',    'New York',     'Washington DC', 'Cotton Fabric Rolls',         4500.0,  120, 'CREATED',    NOW() - INTERVAL '1 day',   NOW(), 'dispatcher'),
  -- IN_TRANSIT
  ('d0000000-0000-0000-0000-000000000006', 'LR-2026-0006', 'AutoParts Inc',       'QuickFix Garage',       'Philadelphia', 'Pittsburgh',    'Auto Spare Parts',            1800.0,  300, 'IN_TRANSIT', NOW() - INTERVAL '2 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000007', 'LR-2026-0007', 'BuildRight Materials','SkyHigh Constructions', 'New York',     'Boston',        'Cement Bags',                12000.0,  240, 'IN_TRANSIT', NOW() - INTERVAL '3 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000008', 'LR-2026-0008', 'DataTech Solutions',  'CloudNet Inc',          'Chicago',      'Indianapolis',  'Server Equipment',             900.0,   15, 'IN_TRANSIT', NOW() - INTERVAL '1 day',   NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000009', 'LR-2026-0009', 'Fresh Farms Co',      'Healthy Bites',         'Houston',      'San Antonio',   'Organic Vegetables',          6000.0,  150, 'IN_TRANSIT', NOW() - INTERVAL '1 day',   NOW(), 'dispatcher'),
  -- DELIVERED
  ('d0000000-0000-0000-0000-000000000010', 'LR-2026-0010', 'Pacific Imports',     'East Coast Retail',     'New York',     'Philadelphia',  'Furniture',                   7500.0,   45, 'DELIVERED',  NOW() - INTERVAL '10 days', NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000011', 'LR-2026-0011', 'ABC Industries',      'MegaBuild Corp',        'New York',     'Washington DC', 'Structural Steel',           15000.0,   60, 'DELIVERED',  NOW() - INTERVAL '14 days', NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000012', 'LR-2026-0012', 'Global Corp',         'TechZone Retail',       'Boston',       'Hartford',      'Laptops & Monitors',          1200.0,   80, 'DELIVERED',  NOW() - INTERVAL '8 days',  NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000013', 'LR-2026-0013', 'Metro Chemicals',     'CleanAll Products',     'Houston',      'Dallas',        'Cleaning Chemicals',          4000.0,  180, 'DELIVERED',  NOW() - INTERVAL '18 days', NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000014', 'LR-2026-0014', 'Textile Hub',         'Stitch Masters',        'Washington DC','Richmond',      'Sewing Machines',             2200.0,   30, 'DELIVERED',  NOW() - INTERVAL '12 days', NOW(), 'dispatcher'),
  ('d0000000-0000-0000-0000-000000000015', 'LR-2026-0015', 'AutoParts Inc',       'National Motors',       'Chicago',      'Detroit',       'Engine Components',           3000.0,  500, 'DELIVERED',  NOW() - INTERVAL '16 days', NOW(), 'dispatcher');


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIPS  (5 PLANNED, 3 IN_PROGRESS, 6 COMPLETED)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO trips (id, vehicle_id, driver_id, status, start_time, end_time, notes, created_at, updated_at, created_by)
VALUES
  -- ── PLANNED (future) ──────────────────────────────────────────────────
  ('e0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
    'PLANNED',
    NOW() + INTERVAL '1 day'  + TIME '08:00', NOW() + INTERVAL '1 day'  + TIME '16:00',
    'NY → Boston freight — steel pipes & cement',
    NOW() - INTERVAL '1 day', NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003',
    'PLANNED',
    NOW() + INTERVAL '2 days' + TIME '06:00', NOW() + INTERVAL '2 days' + TIME '12:00',
    'NY → Philadelphia electronics delivery',
    NOW() - INTERVAL '1 day', NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000007',
    'PLANNED',
    NOW() + INTERVAL '3 days' + TIME '05:30', NOW() + INTERVAL '3 days' + TIME '11:30',
    'Houston → Dallas frozen food shipment',
    NOW(), NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000005',
    'PLANNED',
    NOW() + INTERVAL '1 day'  + TIME '07:00', NOW() + INTERVAL '1 day'  + TIME '11:00',
    'NY → Boston passenger bus service',
    NOW(), NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000006',
    'PLANNED',
    NOW() + INTERVAL '4 days' + TIME '09:00', NOW() + INTERVAL '4 days' + TIME '14:00',
    'NY → Washington DC shuttle service',
    NOW(), NOW(), 'dispatcher'),

  -- ── IN_PROGRESS (ongoing) ─────────────────────────────────────────────
  ('e0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002',
    'IN_PROGRESS',
    NOW() - INTERVAL '3 hours', NOW() + INTERVAL '3 hours',
    'Philly → Pittsburgh auto parts — in transit',
    NOW() - INTERVAL '4 hours', NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000007',
    'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004',
    'IN_PROGRESS',
    NOW() - INTERVAL '2 hours', NOW() + INTERVAL '4 hours',
    'Chicago → Indianapolis server equipment',
    NOW() - INTERVAL '3 hours', NOW(), 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000008',
    'b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010',
    'IN_PROGRESS',
    NOW() - INTERVAL '1 hour', NOW() + INTERVAL '5 hours',
    'Houston → San Antonio express — organic goods',
    NOW() - INTERVAL '2 hours', NOW(), 'dispatcher'),

  -- ── COMPLETED (past) ──────────────────────────────────────────────────
  ('e0000000-0000-0000-0000-000000000009',
    'b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002',
    'COMPLETED',
    NOW() - INTERVAL '5 days' + TIME '08:00', NOW() - INTERVAL '5 days' + TIME '14:00',
    'NY → Philly furniture delivery — completed on time',
    NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000010',
    'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
    'COMPLETED',
    NOW() - INTERVAL '7 days' + TIME '06:00', NOW() - INTERVAL '7 days' + TIME '16:00',
    'NY → Washington DC structural steel — heavy load',
    NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000011',
    'b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005',
    'COMPLETED',
    NOW() - INTERVAL '3 days' + TIME '09:00', NOW() - INTERVAL '3 days' + TIME '13:00',
    'Boston → Hartford laptops delivery',
    NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000012',
    'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000007',
    'COMPLETED',
    NOW() - INTERVAL '10 days' + TIME '05:00', NOW() - INTERVAL '10 days' + TIME '11:00',
    'Houston → Dallas cleaning chemicals',
    NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days', 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000013',
    'b0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000010',
    'COMPLETED',
    NOW() - INTERVAL '6 days' + TIME '10:00', NOW() - INTERVAL '6 days' + TIME '14:00',
    'DC → Richmond sewing machines',
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', 'dispatcher'),

  ('e0000000-0000-0000-0000-000000000014',
    'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004',
    'COMPLETED',
    NOW() - INTERVAL '8 days' + TIME '04:00', NOW() - INTERVAL '8 days' + TIME '12:00',
    'Chicago → Detroit engine components — completed',
    NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', 'dispatcher');


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIP ↔ LORRY RECEIPT ASSOCIATIONS
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO trip_lrs (trip_id, lr_id) VALUES
  -- Trip 1 (NY→Boston planned): LR-0001 + LR-0007
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000007'),
  -- Trip 2 (NY→Philly planned): LR-0002
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002'),
  -- Trip 3 (Houston→Dallas planned): LR-0004
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000004'),
  -- Trip 5 (NY→DC planned): LR-0005
  ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005'),
  -- Trip 6 (Philly→Pittsburgh in-progress): LR-0006
  ('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000006'),
  -- Trip 7 (Chicago→Indianapolis in-progress): LR-0008
  ('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000008'),
  -- Trip 8 (Houston→San Antonio in-progress): LR-0009
  ('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000009'),
  -- Trip 9 (NY→Philly completed): LR-0010
  ('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000010'),
  -- Trip 10 (NY→DC completed): LR-0011
  ('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000011'),
  -- Trip 11 (Boston→Hartford completed): LR-0012
  ('e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000012'),
  -- Trip 12 (Houston→Dallas completed): LR-0013
  ('e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000013'),
  -- Trip 13 (DC→Richmond completed): LR-0014
  ('e0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000014'),
  -- Trip 14 (Chicago→Detroit completed): LR-0015
  ('e0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000015');


-- ═══════════════════════════════════════════════════════════════════════════
-- UPDATE VEHICLE STATUS  (mark vehicles assigned to planned/in-progress trips as BUSY)
-- ═══════════════════════════════════════════════════════════════════════════
UPDATE vehicles SET status = 'BUSY', updated_at = NOW() WHERE id IN (
  'b0000000-0000-0000-0000-000000000001',  -- TRK-001 (trip 1 planned)
  'b0000000-0000-0000-0000-000000000003',  -- TRK-003 (trip 7 in-progress)
  'b0000000-0000-0000-0000-000000000004',  -- TRK-004 (trip 2 planned)
  'b0000000-0000-0000-0000-000000000005',  -- TRK-005 (trip 3 planned)
  'b0000000-0000-0000-0000-000000000006',  -- VAN-001 (trip 6 in-progress)
  'b0000000-0000-0000-0000-000000000009',  -- BUS-001 (trip 4 planned)
  'b0000000-0000-0000-0000-000000000010'   -- BUS-002 (trip 8 in-progress)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- BOOKINGS  (12 CONFIRMED, 3 CANCELLED, 3 COMPLETED)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO bookings (customer_name, customer_phone, customer_email, trip_id, seat_count, status, notes, created_at, updated_at, created_by)
VALUES
  -- ── Trip 4: planned bus NY→Boston (cap 50) ────────────────────────────
  ('Jane Client',       '+1-646-555-0201', 'jane@example.com',          'e0000000-0000-0000-0000-000000000004', 2, 'CONFIRMED', 'Window seats preferred',                    NOW() - INTERVAL '12 hours', NOW(), 'dispatcher'),
  ('Ahmed Khan',        '+1-646-555-0202', 'ahmed@example.com',         'e0000000-0000-0000-0000-000000000004', 4, 'CONFIRMED', 'Family trip — 2 adults, 2 children',        NOW() - INTERVAL '10 hours', NOW(), 'dispatcher'),
  ('Lisa Wong',         '+1-646-555-0203', 'lisa@example.com',          'e0000000-0000-0000-0000-000000000004', 1, 'CONFIRMED', 'Business travel',                           NOW() - INTERVAL '8 hours',  NOW(), 'dispatcher'),
  ('David Brown',       '+1-646-555-0204', 'david@example.com',         'e0000000-0000-0000-0000-000000000004', 3, 'CANCELLED', 'Plans changed — cancelled by customer',      NOW() - INTERVAL '6 hours',  NOW(), 'dispatcher'),
  ('Maria Garcia',      '+1-646-555-0205', 'maria@example.com',         'e0000000-0000-0000-0000-000000000004', 2, 'CONFIRMED', NULL,                                        NOW() - INTERVAL '5 hours',  NOW(), 'dispatcher'),

  -- ── Trip 5: planned mini-bus NY→DC (cap 20) ──────────────────────────
  ('Robert Fernandez',  '+1-202-555-0301', 'robert.f@example.com',      'e0000000-0000-0000-0000-000000000005', 5, 'CONFIRMED', 'Group booking — colleagues',                NOW() - INTERVAL '2 days',   NOW(), 'dispatcher'),
  ('Grace Turner',      '+1-202-555-0302', 'grace.t@example.com',       'e0000000-0000-0000-0000-000000000005', 2, 'CONFIRMED', NULL,                                        NOW() - INTERVAL '1 day',    NOW(), 'dispatcher'),
  ('Tom Henderson',     '+1-202-555-0303', 'tom.h@example.com',         'e0000000-0000-0000-0000-000000000005', 1, 'CANCELLED', 'Rescheduled to next week',                   NOW() - INTERVAL '12 hours', NOW(), 'dispatcher'),

  -- ── Trip 1: planned freight NY→Boston ─────────────────────────────────
  ('ABC Industries',    '+1-800-555-0401', 'logistics@abcindustries.com','e0000000-0000-0000-0000-000000000001', 1, 'CONFIRMED', 'Freight booking — steel pipes consignment', NOW() - INTERVAL '1 day',    NOW(), 'dispatcher'),
  ('BuildRight Materials','+1-800-555-0402','dispatch@buildright.com',   'e0000000-0000-0000-0000-000000000001', 1, 'CONFIRMED', 'Freight booking — cement bags',             NOW() - INTERVAL '1 day',    NOW(), 'dispatcher'),

  -- ── Trip 9: completed NY→Philly ───────────────────────────────────────
  ('Pacific Imports',   '+1-800-555-0501', 'ops@pacificimports.com',    'e0000000-0000-0000-0000-000000000009', 1, 'COMPLETED', 'Furniture delivery completed successfully',  NOW() - INTERVAL '6 days',   NOW() - INTERVAL '5 days', 'dispatcher'),

  -- ── Trip 11: completed Boston→Hartford ────────────────────────────────
  ('Global Corp',       '+1-800-555-0601', 'shipping@globalcorp.com',   'e0000000-0000-0000-0000-000000000011', 1, 'COMPLETED', 'Laptops delivered — POD signed',             NOW() - INTERVAL '4 days',   NOW() - INTERVAL '3 days', 'dispatcher'),
  ('TechZone Retail',   '+1-800-555-0602', 'receiving@techzone.com',    'e0000000-0000-0000-0000-000000000011', 1, 'COMPLETED', 'Monitors received in good condition',        NOW() - INTERVAL '4 days',   NOW() - INTERVAL '3 days', 'dispatcher'),

  -- ── Trip 6: in-progress Philly→Pittsburgh ─────────────────────────────
  ('AutoParts Inc',     '+1-800-555-0701', 'orders@autoparts.com',      'e0000000-0000-0000-0000-000000000006', 1, 'CONFIRMED', 'Spare parts shipment — handle with care',    NOW() - INTERVAL '4 hours',  NOW(), 'dispatcher'),

  -- ── Trip 8: in-progress Houston→San Antonio ──────────────────────────
  ('Elena Martinez',    '+1-210-555-0801', 'elena.m@example.com',       'e0000000-0000-0000-0000-000000000008', 3, 'CONFIRMED', 'Traveling with elderly parents',             NOW() - INTERVAL '3 hours',  NOW(), 'dispatcher'),
  ('Kevin Wright',      '+1-210-555-0802', 'kevin.w@example.com',       'e0000000-0000-0000-0000-000000000008', 1, 'CONFIRMED', NULL,                                        NOW() - INTERVAL '2 hours',  NOW(), 'dispatcher'),
  ('Sophia Lee',        '+1-210-555-0803', 'sophia.l@example.com',      'e0000000-0000-0000-0000-000000000008', 2, 'CANCELLED', 'Flight booked instead',                      NOW() - INTERVAL '1 hour',   NOW(), 'dispatcher');


-- ═══════════════════════════════════════════════════════════════════════════
-- Done
-- ═══════════════════════════════════════════════════════════════════════════
RAISE NOTICE 'Demo data seeded successfully: 14 users, 12 vehicles, 10 drivers, 12 routes, 15 LRs, 14 trips, 18 bookings.';

END $$;

