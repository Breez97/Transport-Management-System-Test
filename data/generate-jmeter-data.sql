\set ON_ERROR_STOP on

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE vehicle_number LIKE 'LT-V-%')
     OR NOT EXISTS (SELECT 1 FROM trips WHERE notes LIKE 'LT-SEED-%')
     OR NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number LIKE 'LT-INV-%')
     OR NOT EXISTS (SELECT 1 FROM lorry_receipts)
  THEN
    RAISE EXCEPTION 'Missing load-test data. Run the seed and check the database.';
  END IF;
END $$;

-- Dispatcher: 500 input rows. Each selected synthetic vehicle has seeded GPS
-- history during August 2026. Lorry receipt IDs are taken from existing rows.
COPY (
  WITH vehicle_refs AS (
    SELECT id, row_number() OVER (ORDER BY vehicle_number) AS rn
    FROM vehicles WHERE vehicle_number LIKE 'LT-V-%'
  ),
  lr_refs AS (
    SELECT id, row_number() OVER (ORDER BY id) AS rn
    FROM lorry_receipts
  )
  SELECT
    'dispatcher' AS username,
    'dispatch123' AS password,
    v.id AS "vehicleId",
    lr.id AS "lrId",
    ((g.n - 1) % 3) AS "vehiclesPage",
    ((g.n * 37) % 10000) AS "tripsPage",
    ((g.n * 13) % 1000) AS "bookingsPage",
    round((55.7000 + (g.n % 1000) * 0.00001)::numeric, 6) AS latitude,
    round((37.5000 + (g.n % 1000) * 0.00001)::numeric, 6) AS longitude,
    (20 + g.n % 70) AS speed,
    (g.n * 11 % 360) AS heading
  FROM generate_series(1, 500) AS g(n)
  JOIN vehicle_refs v ON v.rn = ((g.n - 1) % (SELECT count(*) FROM vehicle_refs)) + 1
  JOIN lr_refs lr ON lr.rn = ((g.n - 1) % (SELECT count(*) FROM lr_refs)) + 1
  ORDER BY g.n
) TO '/tmp/dispatcher.csv' WITH (FORMAT csv, HEADER true);

-- Analyst: each trip-vehicle pair comes from an actual Trip record,
-- which avoids mismatched foreign keys on POST /expenses.
-- PDF invoice IDs are selected from test invoices with 120 line items.
COPY (
  WITH trip_refs AS (
    SELECT id, vehicle_id, row_number() OVER (ORDER BY notes) AS rn
    FROM trips WHERE notes LIKE 'LT-SEED-%'
  ),
  invoice_refs AS (
    SELECT id, row_number() OVER (ORDER BY invoice_number) AS rn
    FROM invoices WHERE invoice_number LIKE 'LT-INV-%'
  )
  SELECT
    'admin' AS username,
    'admin123' AS password,
    t.vehicle_id AS "vehicleId",
    t.id AS "tripId",
    i.id AS "invoiceId",
    ((g.n * 71) % 50000) AS "expensesPage",
    (100 + (g.n % 300))::numeric(12,2) AS amount,
    (date '2026-08-01' + ((g.n - 1) % 28)) AS "expenseDate"
  FROM generate_series(1, 500) AS g(n)
  JOIN trip_refs t ON t.rn = g.n
  JOIN invoice_refs i ON i.rn = ((g.n - 1) % (SELECT count(*) FROM invoice_refs)) + 1
  ORDER BY g.n
) TO '/tmp/analyst.csv' WITH (FORMAT csv, HEADER true);

-- Validate each exported file has 501 lines (header + 500 data rows).
-- Server-side COPY reports COPY 500 for each export.
