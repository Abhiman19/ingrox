// src/routes/data.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const { runRules } = require('../services/ruleEngine');
const { generateInsightText } = require('../services/aiService');

const router = express.Router();

// ── POST /api/data/add ────────────────────────────────────────────────────────
router.post('/add', auth, [
  body('currentRevenue').isFloat({ min: 0 }).withMessage('Current revenue must be a positive number'),
  body('currentOrders').isInt({ min: 0 }).withMessage('Current orders must be a positive integer'),
  body('previousRevenue').optional().isFloat({ min: 0 }),
  body('previousOrders').optional().isInt({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });

  const { currentRevenue, currentOrders, previousRevenue, previousOrders } = req.body;

  try {
    // Get business
    const bizResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    if (!bizResult.rows[0]) {
      return res.status(400).json({ error: 'Complete business setup first' });
    }
    const businessId = bizResult.rows[0].id;

    // Rolling week logic: check if previous data exists
    const lastDataResult = await pool.query(
      'SELECT current_revenue, current_orders FROM business_data WHERE business_id = $1 ORDER BY created_at DESC LIMIT 1',
      [businessId]
    );

    let prevRevenue, prevOrders;
    const isFirstTime = lastDataResult.rows.length === 0;

    if (isFirstTime) {
      // First time — user must provide previous data
      if (previousRevenue == null || previousOrders == null) {
        return res.status(400).json({ error: 'Please provide last week data for your first entry' });
      }
      prevRevenue = parseFloat(previousRevenue);
      prevOrders = parseInt(previousOrders);
    } else {
      // Rolling: use last week's current as this week's previous
      prevRevenue = parseFloat(lastDataResult.rows[0].current_revenue);
      prevOrders = parseInt(lastDataResult.rows[0].current_orders);
    }

    const curr = parseFloat(currentRevenue);
    const currOrders = parseInt(currentOrders);
    const revenueChange = prevRevenue > 0 ? ((curr - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersChange = prevOrders > 0 ? ((currOrders - prevOrders) / prevOrders) * 100 : 0;

    // Store data snapshot
    const dataResult = await pool.query(
      `INSERT INTO business_data
        (business_id, current_revenue, current_orders, previous_revenue, previous_orders, revenue_change, orders_change, week_label)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [businessId, curr, currOrders, prevRevenue, prevOrders,
       revenueChange, ordersChange, new Date().toISOString().split('T')[0]]
    );
    const dataRow = dataResult.rows[0];

    // Run rule engine
    const { insights: rules, metrics } = runRules({
      currentRevenue: curr,
      previousRevenue: prevRevenue,
      currentOrders: currOrders,
      previousOrders: prevOrders,
    });

    // Generate AI insights (limit to 3)
    const insightRows = [];
    for (const rule of rules.slice(0, 3)) {
      const aiText = await generateInsightText(rule);
      const insightResult = await pool.query(
        `INSERT INTO insights
          (business_data_id, business_id, type, priority, what_happened, why_it_happened, what_to_do, actions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [dataRow.id, businessId, rule.type, rule.priority,
         aiText.what_happened, aiText.why_it_happened, aiText.what_to_do,
         JSON.stringify(aiText.actions || [])]
      );
      insightRows.push(insightResult.rows[0]);
    }

    res.status(201).json({
      dashboard: {
        currentRevenue: curr,
        previousRevenue: prevRevenue,
        currentOrders: currOrders,
        previousOrders: prevOrders,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        avgOrderValue: currOrders > 0 ? parseFloat((curr / currOrders).toFixed(2)) : 0,
        metrics,
      },
      insights: insightRows,
      dataId: dataRow.id,
      isFirstTime,
    });
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// ── GET /api/data/latest ──────────────────────────────────────────────────────
router.get('/latest', auth, async (req, res) => {
  try {
    const bizResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    if (!bizResult.rows[0]) return res.status(404).json({ error: 'No business found' });

    const result = await pool.query(
      'SELECT * FROM business_data WHERE business_id = $1 ORDER BY created_at DESC LIMIT 1',
      [bizResult.rows[0].id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'No data yet' });

    const d = result.rows[0];
    res.json({
      dashboard: {
        currentRevenue: parseFloat(d.current_revenue),
        previousRevenue: parseFloat(d.previous_revenue),
        currentOrders: d.current_orders,
        previousOrders: d.previous_orders,
        revenueChange: parseFloat(d.revenue_change),
        ordersChange: parseFloat(d.orders_change),
        avgOrderValue: d.current_orders > 0 ? parseFloat((d.current_revenue / d.current_orders).toFixed(2)) : 0,
        weekLabel: d.week_label,
      },
      dataId: d.id,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// ── GET /api/data/history ─────────────────────────────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const bizResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [req.userId]
    );
    if (!bizResult.rows[0]) return res.status(404).json({ error: 'No business found' });

    const result = await pool.query(
      'SELECT * FROM business_data WHERE business_id = $1 ORDER BY created_at DESC LIMIT 12',
      [bizResult.rows[0].id]
    );
    res.json({ history: result.rows });
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
