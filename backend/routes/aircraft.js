const express = require('express');
const router = express.Router();
const Aircraft = require('../models/Aircraft');

router.get('/', async (req, res) => {
  try {
    const aircraft = await Aircraft.find().sort({ createdAt: -1 });
    res.json(aircraft);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const aircraft = new Aircraft(req.body);
    const saved = await aircraft.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Aircraft.findByIdAndDelete(req.params.id);
    res.json({ message: 'Aircraft deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
