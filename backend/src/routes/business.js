// src/routes/business.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

// ── POST /api/business/create ─────────────────────────────────────────────────
router.post('/create', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Business name required'),
  body('type').trim().notEmpty().withMessage('Business type required'),
  body('currency').optional().isIn(['INR', 'USD', 'EUR']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });

  const { name, type, currency = 'INR' } = req.body;
  try {
    // Upsert — one business per user for Phase 1
    const existing = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    let business;
    if (existing.rows.length > 0) {
      const result = await pool.query(
        'UPDATE businesses SET name=$1, type=$2, currency=$3, updated_at=NOW() WHERE user_id=$4 RETURNING *',
        [name, type, currency, req.userId]
      );
      business = result.rows[0];
    } else {
      const result = await pool.query(
        'INSERT INTO businesses (user_id, name, type, currency) VALUES ($1,$2,$3,$4) RETURNING *',
        [req.userId, name, type, currency]
      );
      business = result.rows[0];
    }
    res.status(201).json({ business });
  } catch {
    res.status(500).json({ error: 'Failed to save business' });
  }
});

// ── GET /api/business/me ──────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM businesses WHERE user_id = $1 LIMIT 1',
      [req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Business not found' });
    res.json({ business: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

module.exports = router;
