import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';

const COLORS = ['#1a237e', '#1565c0', '#0288d1', '#00838f'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Suppliers', value: stats.suppliers, color: '#1a237e' },
    { label: 'Inventory Items', value: stats.totalInventory, color: '#1565c0' },
    { label: 'Low / Out of Stock', value: stats.lowStock, color: '#c62828' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: '#e65100' },
    { label: 'Total Aircraft', value: stats.aircraft, color: '#00695c' },
    { label: 'Total Order Value', value: `$${stats.totalOrderValue.toLocaleString()}`, color: '#4527a0' },
  ];

  const barData = [
    { name: 'Suppliers', value: stats.suppliers },
    { name: 'Inventory', value: stats.totalInventory },
    { name: 'Low Stock', value: stats.lowStock },
    { name: 'Pending Orders', value: stats.pendingOrders },
    { name: 'Aircraft', value: stats.aircraft },
  ];

  const pieData = [
    { name: 'In Stock', value: stats.totalInventory - stats.lowStock },
    { name: 'Low/Out', value: stats.lowStock },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="cards-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="charts-row">
        <div className="chart-box">
          <h3>Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1a237e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Inventory Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
