import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIntl } from 'react-intl';
import {
  FiGrid, FiTruck, FiUsers, FiMap, FiNavigation, FiBookOpen, FiFileText, FiShield,
  FiDollarSign, FiBarChart2, FiActivity, FiLink, FiCreditCard, FiTarget, FiDroplet
} from 'react-icons/fi';
import '../../styles/layout.css';

const navItems = [
  { path: '/dashboard', labelId: 'nav.dashboard', icon: <FiGrid />, roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'CLIENT'] },
  { path: '/vehicles', labelId: 'nav.vehicles', icon: <FiTruck />, roles: ['ADMIN', 'DISPATCHER', 'DRIVER'] },
  { path: '/drivers', labelId: 'nav.drivers', icon: <FiUsers />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/routes', labelId: 'nav.routes', icon: <FiMap />, roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'CLIENT'] },
  { path: '/trips', labelId: 'nav.trips', icon: <FiNavigation />, roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'CLIENT'] },
  { path: '/bookings', labelId: 'nav.bookings', icon: <FiBookOpen />, roles: ['ADMIN', 'DISPATCHER', 'CLIENT'] },
  { path: '/lrs', labelId: 'nav.lrs', icon: <FiFileText />, roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'CLIENT'] },
  { path: '/expenses', labelId: 'nav.expenses', icon: <FiDollarSign />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/invoices', labelId: 'nav.invoices', icon: <FiCreditCard />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/reports', labelId: 'nav.reports', icon: <FiBarChart2 />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/fuel-analytics', labelId: 'nav.fuelAnalytics', icon: <FiDroplet />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/geofences', labelId: 'nav.geofences', icon: <FiTarget />, roles: ['ADMIN', 'DISPATCHER'] },
  { path: '/users', labelId: 'nav.users', icon: <FiShield />, roles: ['ADMIN'] },
  { path: '/audit-logs', labelId: 'nav.auditLogs', icon: <FiActivity />, roles: ['ADMIN'] },
  { path: '/webhooks', labelId: 'nav.webhooks', icon: <FiLink />, roles: ['ADMIN'] },
];

function Sidebar() {
  const { user } = useAuth();
  const intl = useIntl();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FiTruck className="sidebar-logo-icon" />
        <h2>{intl.formatMessage({ id: 'app.short' })}</h2>
      </div>
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{intl.formatMessage({ id: item.labelId })}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="role-badge">{user?.role}</span>
      </div>
    </aside>
  );
}

export default Sidebar;
