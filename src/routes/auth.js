const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/signup',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already in use' });
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ email, passwordHash });
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  '/signin',
  [body('email').isEmail(), body('password').isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 86400000 });
      res.json({ message: 'Signed in' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post('/signout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signed out' });
});

module.exports = router;


