\set ON_ERROR_STOP on
\timing on

BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM trips WHERE notes LIKE 'LT-SEED-%' OR notes LIKE 'LT-EXPAND-202610-%')
       OR EXISTS (SELECT 1 FROM vehicles WHERE vehicle_number LIKE 'LT-V-%')
    THEN
        RAISE EXCEPTION 'Load-test dataset already exists. Restore a clean database before running this file.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
       OR NOT EXISTS (SELECT 1 FROM vehicles WHERE id = 'b0000000-0000-0000-0000-000000000005'::uuid)
       OR NOT EXISTS (SELECT 1 FROM vehicles WHERE id = 'b0000000-0000-0000-0000-000000000001'::uuid)
       OR NOT EXISTS (SELECT 1 FROM trips WHERE id = 'e0000000-0000-0000-0000-000000000010'::uuid
                                     AND vehicle_id = 'b0000000-0000-0000-0000-000000000001'::uuid)
       OR NOT EXISTS (SELECT 1 FROM lorry_receipts WHERE id = 'd0000000-0000-0000-0000-000000000001'::uuid)
    THEN
        RAISE EXCEPTION 'Flyway demo fixtures required by Insomnia are missing. Start with a freshly initialized TMS database.';
    END IF;
END $$;

-- 1. Synthetic reference data, used only for the high-volume records.
INSERT INTO vehicles (vehicle_number, type, capacity, status, make, model, manufacture_year)
SELECT 'LT-V-' || lpad(g::text, 4, '0'), 'TRUCK', 100, 'AVAILABLE', 'Demo', 'Truck', 2022
FROM generate_series(1, 50) AS gs(g);

INSERT INTO drivers (name, phone, license_number, status)
SELECT 'Load Test Driver ' || g,
       '555' || lpad(g::text, 7, '0'),
       'LT-D-' || lpad(g::text, 4, '0'), 'ACTIVE'
FROM generate_series(1, 50) AS gs(g);

INSERT INTO routes (origin, destination, distance, estimated_time_minutes, description, active)
SELECT 'Test City ' || g, 'Test City ' || (g + 1),
       100.0 + g, 120 + g, 'Load-test route', true
FROM generate_series(1, 20) AS gs(g);

-- 2. Trips: 30,000 initial + 500,000 additional, all dated within 2026.
WITH refs AS (
    SELECT ARRAY(SELECT id FROM vehicles WHERE vehicle_number LIKE 'LT-V-%' ORDER BY vehicle_number) AS vs,
           ARRAY(SELECT id FROM drivers WHERE license_number LIKE 'LT-D-%' ORDER BY license_number) AS ds,
           ARRAY(SELECT id FROM routes WHERE description = 'Load-test route' ORDER BY id) AS rs
)
INSERT INTO trips
    (id, vehicle_id, driver_id, route_id, status,
     start_time, end_time, notes, created_at, updated_at)
SELECT gen_random_uuid(),
       refs.vs[1 + (g - 1) % cardinality(refs.vs)],
       refs.ds[1 + (g - 1) % cardinality(refs.ds)],
       refs.rs[1 + (g - 1) % cardinality(refs.rs)],
       'COMPLETED',
       timestamp '2026-01-01 00:00:00' + g * interval '5 minutes',
       timestamp '2026-01-01 00:00:00' + g * interval '5 minutes' + interval '2 hours',
       'LT-SEED-' || g,
       timestamp '2026-01-01 00:00:00' + g * interval '5 minutes',
       timestamp '2026-01-01 00:00:00' + g * interval '5 minutes'
FROM generate_series(1, 30000) AS gs(g)
CROSS JOIN refs;

WITH refs AS (
    SELECT ARRAY(SELECT id FROM vehicles WHERE vehicle_number LIKE 'LT-V-%' ORDER BY vehicle_number) AS vs,
           ARRAY(SELECT id FROM drivers WHERE license_number LIKE 'LT-D-%' ORDER BY license_number) AS ds,
           ARRAY(SELECT id FROM routes WHERE description = 'Load-test route' ORDER BY id) AS rs
)
INSERT INTO trips
    (id, vehicle_id, driver_id, route_id, status,
     start_time, end_time, notes, created_at, updated_at)
SELECT gen_random_uuid(),
       refs.vs[1 + (g - 1) % cardinality(refs.vs)],
       refs.ds[1 + (g - 1) % cardinality(refs.ds)],
       refs.rs[1 + (g - 1) % cardinality(refs.rs)],
       'COMPLETED',
       timestamp '2026-04-15 00:00:00' + g * interval '20 seconds',
       timestamp '2026-04-15 00:00:00' + g * interval '20 seconds' + interval '2 hours',
       'LT-EXPAND-202610-' || g,
       timestamp '2026-04-15 00:00:00' + g * interval '20 seconds',
       timestamp '2026-04-15 00:00:00' + g * interval '20 seconds'
FROM generate_series(1, 500000) AS gs(g)
CROSS JOIN refs;

-- 3. Expenses: 150,000 for initial trips + 1,000,000 for additional trips.
-- The original Insomnia POST /expenses references demo trip e000...0010,
-- which remains present and connected to demo vehicle b000...0001.
INSERT INTO expenses (id, trip_id, vehicle_id, category, amount, description, expense_date)
SELECT gen_random_uuid(), t.id, t.vehicle_id,
       CASE WHEN gs.n <= 3 THEN 'FUEL' ELSE 'TOLL' END,
       (25 + gs.n * 10)::numeric(12,2),
       'LT initial expense ' || gs.n,
       t.start_time::date
FROM trips AS t
CROSS JOIN generate_series(1, 5) AS gs(n)
WHERE t.notes LIKE 'LT-SEED-%';

INSERT INTO expenses (id, trip_id, vehicle_id, category, amount, description, expense_date)
SELECT gen_random_uuid(), t.id, t.vehicle_id,
       CASE WHEN gs.n = 1 THEN 'FUEL' ELSE 'TOLL' END,
       (25 + gs.n * 10)::numeric(12,2),
       'LT expansion expense ' || gs.n,
       t.start_time::date
FROM trips AS t
CROSS JOIN generate_series(1, 2) AS gs(n)
WHERE t.notes LIKE 'LT-EXPAND-202610-%';

-- 4. GPS: 1,000,000 initial rows and 1,680,000 additional rows for test fleet.
-- PLUS 20,000 rows for the precise demo vehicle used by Insomnia: b000...0005.
-- Total GPS rows added = 2,700,000.
WITH refs AS (
    SELECT ARRAY(SELECT id FROM vehicles WHERE vehicle_number LIKE 'LT-V-%' ORDER BY vehicle_number) AS vs
)
INSERT INTO vehicle_location_history
    (id, vehicle_id, latitude, longitude, speed, heading, recorded_at)
SELECT gen_random_uuid(),
       refs.vs[1 + (g - 1) % cardinality(refs.vs)],
       55.7 + (g % 2000) * 0.00001,
       37.5 + (g % 2000) * 0.00001,
       (20 + g % 70)::double precision,
       (g % 360)::double precision,
       timestamp '2026-01-01 00:00:00' + g * interval '15 seconds'
FROM generate_series(1, 1000000) AS gs(g)
CROSS JOIN refs;

WITH refs AS (
    SELECT ARRAY(SELECT id FROM vehicles WHERE vehicle_number LIKE 'LT-V-%' ORDER BY vehicle_number) AS vs
)
INSERT INTO vehicle_location_history
    (id, vehicle_id, latitude, longitude, speed, heading, recorded_at)
SELECT gen_random_uuid(),
       refs.vs[1 + (g - 1) % cardinality(refs.vs)],
       55.7 + (g % 2000) * 0.00001,
       37.5 + (g % 2000) * 0.00001,
       (20 + g % 70)::double precision,
       (g % 360)::double precision,
       timestamp '2026-06-25 00:00:00' + g * interval '5 seconds'
FROM generate_series(1, 1680000) AS gs(g)
CROSS JOIN refs;

INSERT INTO vehicle_location_history
    (id, vehicle_id, latitude, longitude, speed, heading, recorded_at)
SELECT gen_random_uuid(),
       'b0000000-0000-0000-0000-000000000005'::uuid,
       55.7512 + (g % 1000) * 0.000005,
       37.6184 + (g % 1000) * 0.000005,
       (25 + g % 55)::double precision,
       (g % 360)::double precision,
       timestamp '2026-01-02 00:00:00' + g * interval '10 minutes'
FROM generate_series(1, 20000) AS gs(g);

-- 5. Additional bookings make GET /bookings meaningful under paging.
INSERT INTO bookings
    (customer_name, customer_phone, customer_email, trip_id, seat_count, status, notes,
     created_at, updated_at, created_by)
SELECT 'LT Customer ' || g,
       '555' || lpad((g % 10000000)::text, 7, '0'),
       'lt-customer-' || g || '@example.test',
       t.id,
       1,
       'COMPLETED',
       'LT booking ' || g,
       t.start_time, t.end_time,
       'load-test'
FROM generate_series(1, 20000) AS gs(g)
JOIN trips AS t ON t.notes = 'LT-SEED-' || g;

-- 6. Twenty big synthetic invoices with 120 invoice items each.
CREATE TEMP TABLE lt_invoice_ids ON COMMIT DROP AS
SELECT g AS n, gen_random_uuid() AS id
FROM generate_series(1, 20) AS gs(g);

INSERT INTO invoices
    (id, invoice_number, client_name, subtotal, tax_rate, tax_amount, total_amount,
     status, issued_date, due_date)
SELECT id, 'LT-INV-' || lpad(n::text, 4, '0'),
       'Load Test Client ' || n,
       1500.00, 8.25, 123.75, 1623.75,
       'DRAFT', date '2026-07-01', date '2026-07-31'
FROM lt_invoice_ids;

INSERT INTO invoice_items
    (id, invoice_id, description, category, quantity, unit_price, amount)
SELECT gen_random_uuid(), i.id,
       'Load-test invoice line ' || gs.line_num,
       'FUEL', 1, 12.50, 12.50
FROM lt_invoice_ids AS i
CROSS JOIN generate_series(1, 120) AS gs(line_num);

-- 7. Make sure Insomnia's *specific* PDF invoice exists and is heavy enough.
-- Preserve a preexisting invoice with this ID (if supplied by another migration).
INSERT INTO invoices
    (id, invoice_number, client_name, subtotal, tax_rate, tax_amount, total_amount,
     status, issued_date, due_date)
VALUES
    ('90000000-0000-0000-0000-000000000001'::uuid,
     'LT-INSOMNIA-9001', 'Load Test Invoice Client',
     1500.00, 8.25, 123.75, 1623.75, 'DRAFT',
     date '2026-07-01', date '2026-07-31')
ON CONFLICT (id) DO NOTHING;

-- Add only missing lines up to at least 120 in the target invoice.
WITH existing AS (
    SELECT count(*)::integer AS n
    FROM invoice_items
    WHERE invoice_id = '90000000-0000-0000-0000-000000000001'::uuid
)
INSERT INTO invoice_items
    (id, invoice_id, description, category, quantity, unit_price, amount)
SELECT gen_random_uuid(),
       '90000000-0000-0000-0000-000000000001'::uuid,
       'Load-test PDF invoice line ' || (existing.n + gs.n),
       'FUEL', 1, 12.50, 12.50
FROM existing
CROSS JOIN LATERAL generate_series(1, greatest(0, 120 - existing.n)) AS gs(n);

-- Recalculate the test invoice totals from its actual line items.
UPDATE invoices AS i
SET subtotal = s.subtotal,
    tax_rate = 8.25,
    tax_amount = round(s.subtotal * 0.0825, 2),
    total_amount = s.subtotal + round(s.subtotal * 0.0825, 2)
FROM (
    SELECT invoice_id, sum(amount)::numeric(12,2) AS subtotal
    FROM invoice_items
    WHERE invoice_id = '90000000-0000-0000-0000-000000000001'::uuid
    GROUP BY invoice_id
) AS s
WHERE i.id = s.invoice_id;

COMMIT;

-- Record statistics for reliable plans of reports and aggregate queries.
ANALYZE trips;
ANALYZE expenses;
ANALYZE vehicle_location_history;
ANALYZE bookings;
ANALYZE invoice_items;

-- 8. Results and validation, including ALL hard-coded Insomnia IDs.
SELECT pg_size_pretty(pg_database_size(current_database())) AS database_size;

SELECT 'vehicles' AS table_name, count(*) AS row_count FROM vehicles
UNION ALL SELECT 'drivers', count(*) FROM drivers
UNION ALL SELECT 'routes', count(*) FROM routes
UNION ALL SELECT 'trips', count(*) FROM trips
UNION ALL SELECT 'expenses', count(*) FROM expenses
UNION ALL SELECT 'vehicle_location_history', count(*) FROM vehicle_location_history
UNION ALL SELECT 'bookings', count(*) FROM bookings
UNION ALL SELECT 'lorry_receipts', count(*) FROM lorry_receipts
UNION ALL SELECT 'invoices', count(*) FROM invoices
UNION ALL SELECT 'invoice_items', count(*) FROM invoice_items
ORDER BY table_name;

SELECT 'gps_target_vehicle' AS check_name, count(*)::bigint AS records
FROM vehicle_location_history
WHERE vehicle_id = 'b0000000-0000-0000-0000-000000000005'::uuid
UNION ALL
SELECT 'pdf_target_invoice_items', count(*)
FROM invoice_items
WHERE invoice_id = '90000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'expense_target_trip', count(*)
FROM trips
WHERE id = 'e0000000-0000-0000-0000-000000000010'::uuid
UNION ALL
SELECT 'lr_target', count(*)
FROM lorry_receipts
WHERE id = 'd0000000-0000-0000-0000-000000000001'::uuid;

SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_stat_user_tables
WHERE relname IN ('vehicle_location_history','expenses','trips','bookings','invoice_items')
ORDER BY pg_total_relation_size(relid) DESC;
