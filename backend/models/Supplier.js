const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phone: String,
  country: String,
  category: { type: String, enum: ['Fuel', 'Parts', 'Catering', 'Maintenance', 'Other'], default: 'Other' },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
  rating: { type: Number, min: 1, max: 5, default: 3 },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
