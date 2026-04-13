import React, { useEffect, useState } from 'react';
import { getAircraft, createAircraft, updateAircraft, deleteAircraft } from '../services/api';
import './Page.css';

const empty = {
  tailNumber: '', model: '', airline: '', capacity: '',
  status: 'Active', lastMaintenance: '', nextMaintenance: '', flightHours: 0
};

export default function Aircraft() {
  const [aircraft, setAircraft] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getAircraft().then(r => setAircraft(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateAircraft(editing, form);
    else await createAircraft(form);
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = (a) => {
    setForm({
      tailNumber: a.tailNumber,
      model: a.model,
      airline: a.airline || '',
      capacity: a.capacity || '',
      status: a.status,
      lastMaintenance: a.lastMaintenance ? a.lastMaintenance.slice(0, 10) : '',
      nextMaintenance: a.nextMaintenance ? a.nextMaintenance.slice(0, 10) : '',
      flightHours: a.flightHours || 0
    });
    setEditing(a._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete aircraft?')) { await deleteAircraft(id); load(); }
  };

  const statusColor = {
    Active: '#2e7d32', Maintenance: '#e65100', Grounded: '#c62828', Retired: '#757575'
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Aircraft</h1>
        <button className="btn-primary" onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>+ Add Aircraft</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? 'Edit Aircraft' : 'Add Aircraft'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <input placeholder="Tail Number *" value={form.tailNumber} onChange={e => setForm({ ...form, tailNumber: e.target.value })} required />
              <input placeholder="Model *" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
              <input placeholder="Airline" value={form.airline} onChange={e => setForm({ ...form, airline: e.target.value })} />
              <input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {['Active','Maintenance','Grounded','Retired'].map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Flight Hours" value={form.flightHours} onChange={e => setForm({ ...form, flightHours: e.target.value })} />
              <div>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>Last Maintenance</label>
                <input type="date" value={form.lastMaintenance} onChange={e => setForm({ ...form, lastMaintenance: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>Next Maintenance</label>
                <input type="date" value={form.nextMaintenance} onChange={e => setForm({ ...form, nextMaintenance: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Tail Number</th><th>Model</th><th>Airline</th><th>Capacity</th><th>Flight Hours</th><th>Last Maintenance</th><th>Next Maintenance</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {aircraft.map(a => (
              <tr key={a._id}>
                <td><strong>{a.tailNumber}</strong></td>
                <td>{a.model}</td>
                <td>{a.airline || '-'}</td>
                <td>{a.capacity || '-'}</td>
                <td>{a.flightHours} hrs</td>
                <td>{a.lastMaintenance ? new Date(a.lastMaintenance).toLocaleDateString() : '-'}</td>
                <td>{a.nextMaintenance ? new Date(a.nextMaintenance).toLocaleDateString() : '-'}</td>
                <td><span className="status-badge" style={{ background: statusColor[a.status] }}>{a.status}</span></td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {aircraft.length === 0 && <div className="empty">No aircraft found. Add one!</div>}
      </div>
    </div>
  );
}
