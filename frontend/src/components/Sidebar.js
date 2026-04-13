import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdPeople, MdShoppingCart, MdFlight } from 'react-icons/md';
import './Sidebar.css';

const links = [
  { to: '/', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/suppliers', icon: <MdPeople />, label: 'Suppliers' },
  { to: '/inventory', icon: <MdInventory />, label: 'Inventory' },
  { to: '/orders', icon: <MdShoppingCart />, label: 'Orders' },
  { to: '/aircraft', icon: <MdFlight />, label: 'Aircraft' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <MdFlight className="logo-icon" />
        <span>AirSupply</span>
      </div>
      <nav>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {l.icon} <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
