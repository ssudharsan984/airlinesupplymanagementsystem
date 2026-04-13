import React, { useEffect, useState } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder, getSuppliers } from '../services/api';
import './Page.css';

const emptyForm = {
  orderNumber: '', supplier: '', status: 'Pending',
  expectedDelivery: '', notes: '',
  items: [{ itemName: '', quantity: 1, unitPrice: 0 }]
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    getOrders().then(r => setOrders(r.data));
    getSuppliers().then(r => setSuppliers(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { itemName: '', quantity: 1, unitPrice: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateOrder(editing, form);
    else await createOrder(form);
    setForm(emptyForm); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = (o) => {
    setForm({
      orderNumber: o.orderNumber,
      supplier: o.supplier?._id || '',
      status: o.status,
      expectedDelivery: o.expectedDelivery ? o.expectedDelivery.slice(0, 10) : '',
      notes: o.notes || '',
      items: o.items.length ? o.items : [{ itemName: '', quantity: 1, unitPrice: 0 }]
    });
    setEditing(o._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete order?')) { await deleteOrder(id); load(); }
  };

  const statusColor = {
    Pending: '#e65100', Approved: '#1565c0', Shipped: '#6a1b9a',
    Delivered: '#2e7d32', Cancelled: '#c62828'
  };

  const total = form.items.reduce((s, i) => s + (Number(i.quantity) * Number(i.unitPrice)), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }}>+ New Order</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ width: 620 }}>
            <h2>{editing ? 'Edit Order' : 'New Order'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <input placeholder="Order Number *" value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })} required />
              <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} required>
                <option value="">-- Select Supplier *</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {['Pending','Approved','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="date" value={form.expectedDelivery} onChange={e => setForm({ ...form, expectedDelivery: e.target.value })} />
              <textarea className="full-width" placeholder="Notes" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

              <div className="full-width">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: '0.9rem' }}>Order Items</strong>
                  <button type="button" className="btn-edit" onClick={addItem}>+ Add Item</button>
                </div>
                {form.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Item Name" value={item.itemName} onChange={e => handleItemChange(i, 'itemName', e.target.value)} />
                    <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', e.target.value)} />
                    <input type="number" placeholder="Unit Price" min="0" value={item.unitPrice} onChange={e => handleItemChange(i, 'unitPrice', e.target.value)} />
                    <button type="button" className="btn-delete" onClick={() => removeItem(i)} disabled={form.items.length === 1}>✕</button>
                  </div>
                ))}
                <div style={{ textAlign: 'right', fontWeight: 700, color: '#1a237e', marginTop: 4 }}>
                  Total: ${total.toLocaleString()}
                </div>
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
            <tr><th>Order #</th><th>Supplier</th><th>Items</th><th>Total</th><th>Status</th><th>Expected Delivery</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td><strong>{o.orderNumber}</strong></td>
                <td>{o.supplier?.name || '-'}</td>
                <td>{o.items.length} item(s)</td>
                <td><strong>${o.totalAmount.toLocaleString()}</strong></td>
                <td><span className="status-badge" style={{ background: statusColor[o.status] }}>{o.status}</span></td>
                <td>{o.expectedDelivery ? new Date(o.expectedDelivery).toLocaleDateString() : '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(o)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(o._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="empty">No orders found. Create one!</div>}
      </div>
    </div>
  );
}
