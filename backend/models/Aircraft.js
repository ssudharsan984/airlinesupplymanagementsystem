const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema({
  tailNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  airline: String,
  capacity: Number,
  status: { type: String, enum: ['Active', 'Maintenance', 'Grounded', 'Retired'], default: 'Active' },
  lastMaintenance: Date,
  nextMaintenance: Date,
  flightHours: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Aircraft', aircraftSchema);
