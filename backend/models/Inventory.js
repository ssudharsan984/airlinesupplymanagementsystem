const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Fuel', 'Spare Parts', 'Catering', 'Safety Equipment', 'Tools', 'Other'], default: 'Other' },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, default: 'units' },
  minStockLevel: { type: Number, default: 10 },
  unitPrice: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  location: String,
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
}, { timestamps: true });

inventorySchema.pre('save', function (next) {
  if (this.quantity === 0) this.status = 'Out of Stock';
  else if (this.quantity <= this.minStockLevel) this.status = 'Low Stock';
  else this.status = 'In Stock';
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
