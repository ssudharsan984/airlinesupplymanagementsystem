const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Aircraft = require('../models/Aircraft');

router.get('/', async (req, res) => {
  try {
    const [suppliers, inventory, orders, aircraft] = await Promise.all([
      Supplier.countDocuments(),
      Inventory.find(),
      Order.find(),
      Aircraft.countDocuments(),
    ]);
    const lowStock = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalOrderValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ suppliers, totalInventory: inventory.length, lowStock, pendingOrders, totalOrderValue, aircraft });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
