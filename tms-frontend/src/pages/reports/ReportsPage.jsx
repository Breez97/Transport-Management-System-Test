import React, { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'react-toastify';
import reportService from '../../services/reportService';
import '../../styles/dashboard.css';

const COLORS = ['#1a237e', '#4caf50', '#ff9800', '#f44336', '#2196f3'];

function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });
  const [tripReport, setTripReport] = useState(null);
  const [vehicleReport, setVehicleReport] = useState(null);
  const [driverReport, setDriverReport] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [trips, vehicles, drivers] = await Promise.all([
          reportService.getTripReport(dateRange.from, dateRange.to),
          reportService.getVehicleReport(),
          reportService.getDriverReport(),
        ]);
        setTripReport(trips.data);
        setVehicleReport(vehicles.data);
        setDriverReport(drivers.data);
      } catch { toast.error('Failed to load reports'); }
    };
    load();
  }, [dateRange]);

  const downloadCsv = async () => {
    try {
      const res = await reportService.getTripReportCsv(dateRange.from, dateRange.to);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'trip-report.csv';
      link.click();
    } catch { toast.error('Export failed'); }
  };

  const vehicleChartData = vehicleReport ? [
    { name: 'Available', value: vehicleReport.availableVehicles || 0 },
    { name: 'Busy', value: vehicleReport.busyVehicles || 0 },
    { name: 'Maintenance', value: vehicleReport.maintenanceVehicles || 0 },
  ] : [];

  const tripStatusData = tripReport?.byStatus ? Object.entries(tripReport.byStatus).map(([key, val]) => ({ name: key.replace(/_/g, ' '), value: val })) : [];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><FiBarChart2 /> Reports & Analytics</h2>
        <button className="btn btn-primary" onClick={downloadCsv}><FiDownload /> Export CSV</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="form-input" type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} />
        <input className="form-input" type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} />
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-info"><span className="stat-value">{tripReport?.totalTrips || 0}</span><span className="stat-label">Total Trips</span></div></div>
        <div className="stat-card"><div className="stat-info"><span className="stat-value">{tripReport?.totalBookings || 0}</span><span className="stat-label">Total Bookings</span></div></div>
        <div className="stat-card"><div className="stat-info"><span className="stat-value">${Number(tripReport?.totalExpenses || 0).toLocaleString()}</span><span className="stat-label">Total Expenses</span></div></div>
        <div className="stat-card"><div className="stat-info"><span className="stat-value">{driverReport?.activeDrivers || 0}/{driverReport?.totalDrivers || 0}</span><span className="stat-label">Active Drivers</span></div></div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Trip Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tripStatusData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1a237e" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Vehicle Utilization</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={vehicleChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {vehicleChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend /><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;

