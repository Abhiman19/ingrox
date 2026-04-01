// src/routes/insights.js
const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/insights/latest
router.get('/latest', auth, async (req, res) => {
  try {
    const bizResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    if (!bizResult.rows[0]) return res.status(404).json({ error: 'No business found' });

    const latestData = await pool.query(
      'SELECT id FROM business_data WHERE business_id = $1 ORDER BY created_at DESC LIMIT 1',
      [bizResult.rows[0].id]
    );
    if (!latestData.rows[0]) return res.status(404).json({ error: 'No data yet' });

    const result = await pool.query(
      `SELECT i.*, f.type as feedback_type
       FROM insights i
       LEFT JOIN feedback f ON f.insight_id = i.id AND f.user_id = $1
       WHERE i.business_data_id = $2
       ORDER BY
         CASE i.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`,
      [req.userId, latestData.rows[0].id]
    );
    res.json({ insights: result.rows });
  } catch {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// GET /api/insights/all
router.get('/all', auth, async (req, res) => {
  try {
    const bizResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    if (!bizResult.rows[0]) return res.status(404).json({ error: 'No business found' });

    const result = await pool.query(
      `SELECT i.*, f.type as feedback_type, bd.week_label
       FROM insights i
       JOIN business_data bd ON bd.id = i.business_data_id
       LEFT JOIN feedback f ON f.insight_id = i.id AND f.user_id = $1
       WHERE i.business_id = $2
       ORDER BY i.created_at DESC LIMIT 50`,
      [req.userId, bizResult.rows[0].id]
    );
    res.json({ insights: result.rows });
  } catch {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

module.exports = router;
