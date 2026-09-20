-- V8__geofencing_oauth_and_fuel_analytics.sql
-- Adds: geofences, geofence_events tables; OAuth fields to users

-- ─── Geofences ───
CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_meters DOUBLE PRECISION NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'CUSTOM',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    tenant_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_geofence_active ON geofences(active);
CREATE INDEX IF NOT EXISTS idx_geofence_tenant ON geofences(tenant_id);

-- ─── Geofence Events ───
CREATE TABLE IF NOT EXISTS geofence_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    geofence_id UUID NOT NULL REFERENCES geofences(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    trip_id UUID REFERENCES trips(id),
    event_type VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    event_time TIMESTAMP NOT NULL,
    tenant_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_gfe_geofence_time ON geofence_events(geofence_id, event_time);
CREATE INDEX IF NOT EXISTS idx_gfe_vehicle_time ON geofence_events(vehicle_id, event_time);

-- ─── OAuth2 SSO fields on users ───
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider_id VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_provider_id)
    WHERE oauth_provider IS NOT NULL;

-- ─── Seed sample geofences ───
INSERT INTO geofences (name, description, latitude, longitude, radius_meters, type, active)
VALUES
    ('NY Main Depot', 'Main depot in New York City', 40.7128, -74.0060, 500, 'DEPOT', true),
    ('Chicago Warehouse', 'Chicago distribution warehouse', 41.8781, -87.6298, 750, 'DEPOT', true),
    ('Houston Logistics Park', 'Houston logistics and loading area', 29.7604, -95.3698, 1000, 'DELIVERY_ZONE', true),
    ('Philadelphia Restricted', 'Restricted zone - no unauthorized entry', 39.9526, -75.1652, 300, 'RESTRICTED_ZONE', true);

