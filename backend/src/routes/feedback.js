// src/routes/feedback.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback
router.post('/', auth, [
  body('insightId').isUUID().withMessage('Valid insight ID required'),
  body('type').isIn(['helpful', 'not_helpful']).withMessage('Type must be helpful or not_helpful'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });

  const { insightId, type } = req.body;
  try {
    await pool.query(
      `INSERT INTO feedback (user_id, insight_id, type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, insight_id)
       DO UPDATE SET type = EXCLUDED.type`,
      [req.userId, insightId, type]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

module.exports = router;
