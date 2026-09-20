import React, { useEffect, useState, useCallback } from 'react';
import {
  FiTruck, FiUsers, FiNavigation, FiFileText,
  FiCheckCircle, FiActivity, FiPackage, FiBookOpen
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import dashboardService from '../services/dashboardService';
import StatCard from '../components/stats/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import '../styles/dashboard.css';

const REFRESH_INTERVAL = 30000;
const PIE_COLORS = ['#2196f3', '#ff9800', '#4caf50', '#f44336', '#9c27b0'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const [statsRes, trendsRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getTrends(),
      ]);
      setStats(statsRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadStats]);

  if (loading) return <div className="page-loader">Loading...</div>;
  if (!stats) return <div className="page-loader">Failed to load data</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  const tripsByStatusData = trends?.tripsByStatus
    ? Object.entries(trends.tripsByStatus).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
    : [];

  const vehiclesByStatusData = trends?.vehiclesByStatus
    ? Object.entries(trends.vehiclesByStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <span className="auto-refresh-label">Auto-refreshes every 30s</span>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FiNavigation />} label="Total Trips" value={stats.totalTrips} color="#673ab7" />
        <StatCard icon={<FiActivity />} label="Active Trips" value={stats.activeTrips} color="#ff9800" />
        <StatCard icon={<FiCheckCircle />} label="Completed Trips" value={stats.completedTrips} color="#4caf50" />
        <StatCard icon={<FiTruck />} label="Available Vehicles" value={stats.availableVehicles} color="#2196f3" />
        <StatCard icon={<FiTruck />} label="Total Vehicles" value={stats.totalVehicles} color="#1a237e" />
        <StatCard icon={<FiUsers />} label="Active Drivers" value={stats.activeDrivers} color="#4caf50" />
        <StatCard icon={<FiFileText />} label="Total LRs" value={stats.totalLrs} color="#ff5722" />
        <StatCard icon={<FiBookOpen />} label="Total Bookings" value={stats.totalBookings} color="#009688" />
      </div>

      {trends && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Trips (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends.tripTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#673ab7" strokeWidth={2} name="Trips" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Bookings (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trends.bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#009688" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Trips by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={tripsByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {tripsByStatusData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Vehicles by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={vehiclesByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {vehiclesByStatusData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="recent-section">
        <h3>Recent Trips</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Start Time</th>
                <th>LRs</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTrips?.length > 0 ? stats.recentTrips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.vehicleNumber}</td>
                  <td>{trip.driverName}</td>
                  <td>{trip.routeOrigin ? `${trip.routeOrigin} → ${trip.routeDestination}` : '—'}</td>
                  <td>{formatDate(trip.startTime)}</td>
                  <td>{trip.lorryReceipts?.length || 0}</td>
                  <td><StatusBadge status={trip.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="empty-row">No recent trips</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
