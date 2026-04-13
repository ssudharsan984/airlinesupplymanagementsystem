const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  itemName: String,
  quantity: Number,
  unitPrice: Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  expectedDelivery: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
