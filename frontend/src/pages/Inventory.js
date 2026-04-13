import React, { useEffect, useState } from 'react';
import { getInventory, createInventory, updateInventory, deleteInventory, getSuppliers } from '../services/api';
import './Page.css';

const empty = { itemName: '', sku: '', category: 'Other', quantity: 0, unit: 'units', minStockLevel: 10, unitPrice: 0, supplier: '', location: '' };

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    getInventory().then(r => setItems(r.data));
    getSuppliers().then(r => setSuppliers(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateInventory(editing, form);
    else await createInventory(form);
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = (item) => { setForm({ ...item, supplier: item.supplier?._id || '' }); setEditing(item._id); setShowForm(true); };
  const handleDelete = async (id) => { if (window.confirm('Delete item?')) { await deleteInventory(id); load(); } };

  const statusColor = { 'In Stock': '#2e7d32', 'Low Stock': '#e65100', 'Out of Stock': '#c62828' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Inventory</h1>
        <button className="btn-primary" onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}>+ Add Item</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? 'Edit Item' : 'Add Inventory Item'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <input placeholder="Item Name *" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} required />
              <input placeholder="SKU *" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Fuel','Spare Parts','Catering','Safety Equipment','Tools','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
              <input placeholder="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
              <input type="number" placeholder="Min Stock Level" value={form.minStockLevel} onChange={e => setForm({ ...form, minStockLevel: e.target.value })} />
              <input type="number" placeholder="Unit Price *" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} required />
              <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
                <option value="">-- Select Supplier --</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
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
            <tr><th>Item Name</th><th>SKU</th><th>Category</th><th>Quantity</th><th>Unit Price</th><th>Supplier</th><th>Location</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td><strong>{item.itemName}</strong></td>
                <td>{item.sku}</td>
                <td><span className="badge">{item.category}</span></td>
                <td>{item.quantity} {item.unit}</td>
                <td>${item.unitPrice}</td>
                <td>{item.supplier?.name || '-'}</td>
                <td>{item.location || '-'}</td>
                <td><span className="status-badge" style={{ background: statusColor[item.status] }}>{item.status}</span></td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty">No inventory items found. Add one!</div>}
      </div>
    </div>
  );
}
