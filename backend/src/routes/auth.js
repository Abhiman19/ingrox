// src/routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ── Validation rules ──────────────────────────────────────────────────────────
const signupRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', signupRules, async (req, res) => {
  if (!validate(req, res)) return;
  const { email, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', loginRules, async (req, res) => {
  if (!validate(req, res)) return;
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    // Use constant-time comparison to prevent timing attacks
    const DUMMY_HASH = '$2a$10$dummyhashfornonexistentusers000000000000000000';
    const hashToCompare = user ? user.password_hash : DUMMY_HASH;
    const match = await bcrypt.compare(password, hashToCompare);
    if (!user || !match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    // Fetch business if exists
    const bizResult = await pool.query(
      'SELECT id, name, type, currency FROM businesses WHERE user_id = $1 LIMIT 1',
      [user.id]
    );
    res.json({
      token,
      user: { id: user.id, email: user.email },
      business: bizResult.rows[0] || null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userRes = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (!userRes.rows[0]) return res.status(404).json({ error: 'User not found' });
    const bizRes = await pool.query(
      'SELECT id, name, type, currency FROM businesses WHERE user_id = $1 LIMIT 1',
      [req.userId]
    );
    res.json({ user: userRes.rows[0], business: bizRes.rows[0] || null });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
