const express = require('express');
const { body, validationResult } = require('express-validator');
const Credential = require('../models/Credential');

const router = express.Router();

// Create
router.post(
  '/',
  [
    body('username').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
    body('serverName').isString().trim().notEmpty(),
    body('serverIp').isIP(4),
    body('serverUrl').isURL({ require_protocol: true }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const created = await Credential.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Read all
router.get('/', async (_req, res) => {
  try {
    const list = await Credential.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put(
  '/:id',
  [
    body('username').optional().isString().trim().notEmpty(),
    body('password').optional().isString().notEmpty(),
    body('serverName').optional().isString().trim().notEmpty(),
    body('serverIp').optional().isIP(4),
    body('serverUrl').optional().isURL({ require_protocol: true }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updated = await Credential.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Credential.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


