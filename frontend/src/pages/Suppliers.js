import React, { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import './Page.css';

const empty = { name: '', contactEmail: '', phone: '', country: '', category: 'Other', status: 'Active', rating: 3 };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getSuppliers().then(r => setSuppliers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateSupplier(editing, form);
    else await createSupplier(form);
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = (s) => { setForm(s); setEditing(s._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('Delete supplier?')) { await deleteSupplier(id); load(); } };

  const statusColor = { Active: '#2e7d32', Inactive: '#c62828', Pending: '#e65100' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Suppliers</h1>
        <button className="btn-primary" onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>+ Add Supplier</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input placeholder="Email *" type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} required />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Fuel','Parts','Catering','Maintenance','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {['Active','Inactive','Pending'].map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Rating (1-5)" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
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
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Country</th><th>Category</th><th>Status</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s._id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.contactEmail}</td>
                <td>{s.phone}</td>
                <td>{s.country}</td>
                <td><span className="badge">{s.category}</span></td>
                <td><span className="status-badge" style={{ background: statusColor[s.status] }}>{s.status}</span></td>
                <td>{'⭐'.repeat(s.rating)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && <div className="empty">No suppliers found. Add one!</div>}
      </div>
    </div>
  );
}
