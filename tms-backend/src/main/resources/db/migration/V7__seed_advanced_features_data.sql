-- ============================================================================
-- V7__seed_advanced_features_data.sql
-- Backfills route_id on demo trips, and seeds data for tables added after V2:
--   • tenants
--   • expenses
--   • webhook_registrations
--   • invoices  +  invoice_items
--   • notifications
--
-- All IDs are deterministic UUIDs matching the naming pattern used in V2.
-- ============================================================================

DO $$
BEGIN
    -- ═══════════════════════════════════════════════════════════════════════
    -- BACKFILL route_id ON EXISTING TRIPS
    -- Routes are BIGSERIAL; V2 inserts them in order → IDs 1..12.
    --   1  NY → Boston            2  NY → Philadelphia
    --   3  NY → Washington DC     4  Chicago → Detroit
    --   5  Chicago → Indianapolis 6  Houston → Dallas
    --   7  Houston → San Antonio  8  Philadelphia → Pittsburgh
    --   9  Boston → Hartford     10  Washington DC → Richmond
    --  11  NY → Chicago          12  Dallas → Houston
    -- ═══════════════════════════════════════════════════════════════════════
    UPDATE trips SET route_id = 1  WHERE id = 'e0000000-0000-0000-0000-000000000001';  -- NY → Boston freight
    UPDATE trips SET route_id = 2  WHERE id = 'e0000000-0000-0000-0000-000000000002';  -- NY → Philadelphia
    UPDATE trips SET route_id = 6  WHERE id = 'e0000000-0000-0000-0000-000000000003';  -- Houston → Dallas
    UPDATE trips SET route_id = 1  WHERE id = 'e0000000-0000-0000-0000-000000000004';  -- NY → Boston bus
    UPDATE trips SET route_id = 3  WHERE id = 'e0000000-0000-0000-0000-000000000005';  -- NY → Washington DC
    UPDATE trips SET route_id = 8  WHERE id = 'e0000000-0000-0000-0000-000000000006';  -- Philly → Pittsburgh
    UPDATE trips SET route_id = 5  WHERE id = 'e0000000-0000-0000-0000-000000000007';  -- Chicago → Indianapolis
    UPDATE trips SET route_id = 7  WHERE id = 'e0000000-0000-0000-0000-000000000008';  -- Houston → San Antonio
    UPDATE trips SET route_id = 2  WHERE id = 'e0000000-0000-0000-0000-000000000009';  -- NY → Philly (completed)
    UPDATE trips SET route_id = 3  WHERE id = 'e0000000-0000-0000-0000-000000000010';  -- NY → DC (completed)
    UPDATE trips SET route_id = 9  WHERE id = 'e0000000-0000-0000-0000-000000000011';  -- Boston → Hartford (completed)
    UPDATE trips SET route_id = 6  WHERE id = 'e0000000-0000-0000-0000-000000000012';  -- Houston → Dallas (completed)
    UPDATE trips SET route_id = 10 WHERE id = 'e0000000-0000-0000-0000-000000000013';  -- DC → Richmond (completed)
    UPDATE trips SET route_id = 4  WHERE id = 'e0000000-0000-0000-0000-000000000014';  -- Chicago → Detroit (completed)


    -- ═══════════════════════════════════════════════════════════════════════
    -- TENANTS  (2 tenants — one active, one for demo)
    -- ═══════════════════════════════════════════════════════════════════════
    IF (SELECT count(*) FROM tenants) = 0 THEN
        INSERT INTO tenants (id, name, subdomain, active, created_at, updated_at, created_by)
        VALUES
          ('f0000000-0000-0000-0000-000000000001', 'Acme Transport Co.',     'acme',     true,  NOW() - INTERVAL '90 days', NOW(), 'admin'),
          ('f0000000-0000-0000-0000-000000000002', 'Delta Logistics Pvt Ltd','delta',    true,  NOW() - INTERVAL '60 days', NOW(), 'admin'),
          ('f0000000-0000-0000-0000-000000000003', 'Omega Freight Inc.',     'omega',    false, NOW() - INTERVAL '30 days', NOW(), 'admin');
    END IF;


    -- ═══════════════════════════════════════════════════════════════════════
    -- EXPENSES  (12 expenses across various trips, vehicles, and categories)
    -- ═══════════════════════════════════════════════════════════════════════
    IF (SELECT count(*) FROM expenses) = 0 THEN
        INSERT INTO expenses (id, trip_id, vehicle_id, category, amount, description, expense_date, created_at, updated_at, created_by)
        VALUES
          -- Completed trip 10 (NY→DC) expenses
          ('70000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001',
           'FUEL',              450.00, 'Diesel fill-up — departure NY',                NOW()::date - 8,  NOW() - INTERVAL '8 days', NOW(), 'dispatcher'),
          ('70000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001',
           'TOLL',               85.00, 'NJ Turnpike + Delaware Memorial Bridge tolls', NOW()::date - 8,  NOW() - INTERVAL '8 days', NOW(), 'dispatcher'),
          ('70000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001',
           'DRIVER_ALLOWANCE',  200.00, 'Driver overnight allowance — Mike Driver',     NOW()::date - 7,  NOW() - INTERVAL '7 days', NOW(), 'dispatcher'),

          -- Completed trip 12 (Houston→Dallas) expenses
          ('70000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000005',
           'FUEL',              380.00, 'Diesel — Houston depot fill',                  NOW()::date - 11, NOW() - INTERVAL '11 days', NOW(), 'dispatcher'),
          ('70000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000005',
           'TOLL',               45.00, 'Sam Houston Tollway',                          NOW()::date - 10, NOW() - INTERVAL '10 days', NOW(), 'dispatcher'),

          -- Completed trip 14 (Chicago→Detroit) expenses
          ('70000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000003',
           'FUEL',              320.00, 'Diesel — Chicago warehouse fill',              NOW()::date - 9,  NOW() - INTERVAL '9 days', NOW(), 'dispatcher'),
          ('70000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000003',
           'MAINTENANCE',       150.00, 'Tire pressure check + wiper fluid top-up',     NOW()::date - 9,  NOW() - INTERVAL '9 days', NOW(), 'dispatcher'),

          -- In-progress trip 6 (Philly→Pittsburgh) expenses
          ('70000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006',
           'FUEL',              120.00, 'Fuel top-up before departure',                  NOW()::date,      NOW() - INTERVAL '4 hours', NOW(), 'dispatcher'),
          ('70000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006',
           'TOLL',               55.00, 'PA Turnpike toll',                              NOW()::date,      NOW() - INTERVAL '2 hours', NOW(), 'dispatcher'),

          -- Vehicle maintenance (no trip)
          ('70000000-0000-0000-0000-000000000010', NULL, 'b0000000-0000-0000-0000-000000000002',
           'MAINTENANCE',      1250.00, 'Scheduled service — TRK-002 engine oil + filters', NOW()::date - 5, NOW() - INTERVAL '5 days', NOW(), 'admin'),
          ('70000000-0000-0000-0000-000000000011', NULL, 'b0000000-0000-0000-0000-000000000008',
           'MAINTENANCE',       800.00, 'Brake pad replacement — VAN-003',                   NOW()::date - 3, NOW() - INTERVAL '3 days', NOW(), 'admin'),

          -- Miscellaneous
          ('70000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000007',
           'OTHER',             65.00,  'Parking fee — Philadelphia warehouse',              NOW()::date - 5, NOW() - INTERVAL '5 days', NOW(), 'dispatcher');
    END IF;


    -- ═══════════════════════════════════════════════════════════════════════
    -- WEBHOOK REGISTRATIONS  (3 registrations)
    -- ═══════════════════════════════════════════════════════════════════════
    IF (SELECT count(*) FROM webhook_registrations) = 0 THEN
        INSERT INTO webhook_registrations (id, url, event_types, secret, active, description, created_at, updated_at, created_by)
        VALUES
          ('80000000-0000-0000-0000-000000000001',
           'https://hooks.example.com/tms/trips',
           'TRIP_CREATED,TRIP_STATUS_CHANGED,TRIP_COMPLETED',
           'whsec_abc123def456',
           true,
           'External dispatch system — trip events',
           NOW() - INTERVAL '30 days', NOW(), 'admin'),

          ('80000000-0000-0000-0000-000000000002',
           'https://hooks.example.com/tms/bookings',
           'BOOKING_CREATED,BOOKING_CANCELLED',
           'whsec_ghi789jkl012',
           true,
           'Customer notification service — booking events',
           NOW() - INTERVAL '25 days', NOW(), 'admin'),

          ('80000000-0000-0000-0000-000000000003',
           'https://old-system.example.com/webhooks',
           'LR_CREATED,LR_STATUS_CHANGED',
           'whsec_mno345pqr678',
           false,
           'Legacy LR integration — disabled',
           NOW() - INTERVAL '60 days', NOW(), 'admin');
    END IF;


    -- ═══════════════════════════════════════════════════════════════════════
    -- INVOICES + INVOICE ITEMS  (4 invoices tied to completed trips)
    -- ═══════════════════════════════════════════════════════════════════════
    IF (SELECT count(*) FROM invoices) = 0 THEN
        -- Invoice 1 — Trip 10 (NY → DC, structural steel)
        INSERT INTO invoices (id, invoice_number, trip_id, client_name, client_email,
                              subtotal, tax_rate, tax_amount, total_amount,
                              status, notes, issued_date, due_date,
                              created_at, updated_at, created_by)
        VALUES
          ('90000000-0000-0000-0000-000000000001', 'INV-2026-0001',
           'e0000000-0000-0000-0000-000000000010',
           'ABC Industries', 'billing@abcindustries.com',
           15000.00, 18.00, 2700.00, 17700.00,
           'PAID', 'Structural steel transport NY→DC — paid in full',
           NOW()::date - 6, NOW()::date + 24,
           NOW() - INTERVAL '6 days', NOW() - INTERVAL '2 days', 'dispatcher');

        INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, amount, expense_id, created_at, updated_at, created_by)
        VALUES
          ('91000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001',
           'Freight charge — NY to Washington DC (365 km)', NULL, 1, 14265.00, 14265.00, NULL,
           NOW() - INTERVAL '6 days', NOW(), 'dispatcher'),
          ('91000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001',
           'Fuel surcharge', 'FUEL', 1, 450.00, 450.00, '70000000-0000-0000-0000-000000000001',
           NOW() - INTERVAL '6 days', NOW(), 'dispatcher'),
          ('91000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001',
           'Toll charges', 'TOLL', 1, 85.00, 85.00, '70000000-0000-0000-0000-000000000002',
           NOW() - INTERVAL '6 days', NOW(), 'dispatcher'),
          ('91000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000001',
           'Driver allowance', 'DRIVER_ALLOWANCE', 1, 200.00, 200.00, '70000000-0000-0000-0000-000000000003',
           NOW() - INTERVAL '6 days', NOW(), 'dispatcher');


        -- Invoice 2 — Trip 12 (Houston → Dallas, cleaning chemicals)
        INSERT INTO invoices (id, invoice_number, trip_id, client_name, client_email,
                              subtotal, tax_rate, tax_amount, total_amount,
                              status, notes, issued_date, due_date,
                              created_at, updated_at, created_by)
        VALUES
          ('90000000-0000-0000-0000-000000000002', 'INV-2026-0002',
           'e0000000-0000-0000-0000-000000000012',
           'Metro Chemicals', 'accounts@metrochemicals.com',
           8500.00, 18.00, 1530.00, 10030.00,
           'SENT', 'Cleaning chemicals Houston→Dallas — invoice sent',
           NOW()::date - 9, NOW()::date + 21,
           NOW() - INTERVAL '9 days', NOW(), 'dispatcher');

        INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, amount, expense_id, created_at, updated_at, created_by)
        VALUES
          ('91000000-0000-0000-0000-000000000005', '90000000-0000-0000-0000-000000000002',
           'Freight charge — Houston to Dallas (362 km)', NULL, 1, 8075.00, 8075.00, NULL,
           NOW() - INTERVAL '9 days', NOW(), 'dispatcher'),
          ('91000000-0000-0000-0000-000000000006', '90000000-0000-0000-0000-000000000002',
           'Fuel surcharge', 'FUEL', 1, 380.00, 380.00, '70000000-0000-0000-0000-000000000004',
           NOW() - INTERVAL '9 days', NOW(), 'dispatcher'),
          ('91000000-0000-0000-0000-000000000007', '90000000-0000-0000-0000-000000000002',
           'Toll charges', 'TOLL', 1, 45.00, 45.00, '70000000-0000-0000-0000-000000000005',
           NOW() - INTERVAL '9 days', NOW(), 'dispatcher');


        -- Invoice 3 — Trip 11 (Boston → Hartford, laptops)
        INSERT INTO invoices (id, invoice_number, trip_id, client_name, client_email,
                              subtotal, tax_rate, tax_amount, total_amount,
                              status, notes, issued_date, due_date,
                              created_at, updated_at, created_by)
        VALUES
          ('90000000-0000-0000-0000-000000000003', 'INV-2026-0003',
           'e0000000-0000-0000-0000-000000000011',
           'Global Corp', 'finance@globalcorp.com',
           5200.00, 18.00, 936.00, 6136.00,
           'DRAFT', 'Laptops & monitors Boston→Hartford — draft',
           NULL, NULL,
           NOW() - INTERVAL '2 days', NOW(), 'dispatcher');

        INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, amount, expense_id, created_at, updated_at, created_by)
        VALUES
          ('91000000-0000-0000-0000-000000000008', '90000000-0000-0000-0000-000000000003',
           'Freight charge — Boston to Hartford (160 km)', NULL, 1, 5200.00, 5200.00, NULL,
           NOW() - INTERVAL '2 days', NOW(), 'dispatcher');


        -- Invoice 4 — Trip 13 (DC → Richmond, sewing machines)
        INSERT INTO invoices (id, invoice_number, trip_id, client_name, client_email,
                              subtotal, tax_rate, tax_amount, total_amount,
                              status, notes, issued_date, due_date,
                              created_at, updated_at, created_by)
        VALUES
          ('90000000-0000-0000-0000-000000000004', 'INV-2026-0004',
           'e0000000-0000-0000-0000-000000000013',
           'Textile Hub', 'billing@textilehub.com',
           4800.00, 18.00, 864.00, 5664.00,
           'CANCELLED', 'Sewing machines DC→Richmond — cancelled by client',
           NOW()::date - 5, NOW()::date + 25,
           NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', 'dispatcher');

        INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, amount, expense_id, created_at, updated_at, created_by)
        VALUES
          ('91000000-0000-0000-0000-000000000009', '90000000-0000-0000-0000-000000000004',
           'Freight charge — Washington DC to Richmond (171 km)', NULL, 1, 4800.00, 4800.00, NULL,
           NOW() - INTERVAL '5 days', NOW(), 'dispatcher');
    END IF;


    -- ═══════════════════════════════════════════════════════════════════════
    -- NOTIFICATIONS  (sample notifications for various users)
    -- ═══════════════════════════════════════════════════════════════════════
    IF (SELECT count(*) FROM notifications) = 0 THEN
        INSERT INTO notifications (id, user_id, title, message, type, read, link, created_at, updated_at, created_by)
        VALUES
          -- Admin notifications
          ('a1000000-0000-0000-0000-000000000001',
           'a0000000-0000-0000-0000-000000000001',
           'New trip completed', 'Trip NY→DC (TMS-TRK-001) completed successfully.',
           'TRIP_UPDATE', true, '/trips', NOW() - INTERVAL '7 days', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000002',
           'a0000000-0000-0000-0000-000000000001',
           'Vehicle maintenance alert', 'TMS-TRK-002 scheduled for maintenance.',
           'ALERT', true, '/vehicles', NOW() - INTERVAL '5 days', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000003',
           'a0000000-0000-0000-0000-000000000001',
           'Invoice paid', 'Invoice INV-2026-0001 marked as paid by ABC Industries.',
           'INVOICE_UPDATE', false, '/invoices', NOW() - INTERVAL '2 days', NOW(), 'system'),

          -- Dispatcher notifications
          ('a1000000-0000-0000-0000-000000000004',
           'a0000000-0000-0000-0000-000000000003',
           'New booking received', 'Jane Client booked 2 seats on NY→Boston bus.',
           'BOOKING_UPDATE', true, '/bookings', NOW() - INTERVAL '12 hours', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000005',
           'a0000000-0000-0000-0000-000000000003',
           'Booking cancelled', 'David Brown cancelled booking on NY→Boston bus.',
           'BOOKING_UPDATE', false, '/bookings', NOW() - INTERVAL '6 hours', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000006',
           'a0000000-0000-0000-0000-000000000003',
           'Trip in progress', 'Trip Philly→Pittsburgh (VAN-001) has started.',
           'TRIP_UPDATE', true, '/trips', NOW() - INTERVAL '4 hours', NOW(), 'system'),

          -- Driver notifications
          ('a1000000-0000-0000-0000-000000000007',
           'a0000000-0000-0000-0000-000000000006',
           'Trip assigned', 'You have been assigned to NY→Boston freight trip tomorrow.',
           'TRIP_UPDATE', true, '/trips', NOW() - INTERVAL '1 day', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000008',
           'a0000000-0000-0000-0000-000000000007',
           'Trip completed', 'Your trip Philly→Pittsburgh has been marked complete.',
           'TRIP_UPDATE', false, '/trips', NOW() - INTERVAL '5 days', NOW(), 'system'),

          -- Client notifications
          ('a1000000-0000-0000-0000-000000000009',
           'a0000000-0000-0000-0000-000000000010',
           'Booking confirmed', 'Your booking for NY→Boston (2 seats) is confirmed.',
           'BOOKING_UPDATE', true, '/bookings', NOW() - INTERVAL '11 hours', NOW(), 'system'),

          ('a1000000-0000-0000-0000-000000000010',
           'a0000000-0000-0000-0000-000000000010',
           'System maintenance notice', 'TMS will undergo maintenance on Sunday 2AM–4AM EST.',
           'SYSTEM', false, NULL, NOW() - INTERVAL '2 days', NOW(), 'system');
    END IF;


    -- ═══════════════════════════════════════════════════════════════════════
    -- Done
    -- ═══════════════════════════════════════════════════════════════════════
    RAISE NOTICE 'V7 seed complete: route_id backfilled on 14 trips, tenants / expenses / webhooks / invoices / notifications seeded.';

END $$;


