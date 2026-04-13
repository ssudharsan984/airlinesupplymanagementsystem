import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

export const getDashboard = () => API.get('/dashboard');

export const getSuppliers = () => API.get('/suppliers');
export const createSupplier = (data) => API.post('/suppliers', data);
export const updateSupplier = (id, data) => API.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);

export const getInventory = () => API.get('/inventory');
export const createInventory = (data) => API.post('/inventory', data);
export const updateInventory = (id, data) => API.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => API.delete(`/inventory/${id}`);

export const getOrders = () => API.get('/orders');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

export const getAircraft = () => API.get('/aircraft');
export const createAircraft = (data) => API.post('/aircraft', data);
export const updateAircraft = (id, data) => API.put(`/aircraft/${id}`, data);
export const deleteAircraft = (id) => API.delete(`/aircraft/${id}`);
