const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
