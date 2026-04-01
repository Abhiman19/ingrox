// src/services/ruleEngine.js
// Pure JavaScript rule engine — no AI needed for detection
// AI is only used for formatting/explanation

function runRules({ currentRevenue, previousRevenue, currentOrders, previousOrders }) {
  const revenueChange = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0;
  const ordersChange = previousOrders > 0
    ? ((currentOrders - previousOrders) / previousOrders) * 100
    : 0;
  const avgOrderValueCurrent = currentOrders > 0 ? currentRevenue / currentOrders : 0;
  const avgOrderValuePrevious = previousOrders > 0 ? previousRevenue / previousOrders : 0;
  const aovChange = avgOrderValuePrevious > 0
    ? ((avgOrderValueCurrent - avgOrderValuePrevious) / avgOrderValuePrevious) * 100
    : 0;

  const insights = [];

  // Rule 1: Revenue dropped significantly
  if (revenueChange <= -10) {
    insights.push({
      type: 'revenue_drop',
      priority: revenueChange <= -20 ? 'high' : 'medium',
      dataPoint: `Revenue dropped ${Math.abs(revenueChange).toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // Rule 2: Revenue rose
  if (revenueChange >= 10) {
    insights.push({
      type: 'revenue_growth',
      priority: 'low',
      dataPoint: `Revenue grew ${revenueChange.toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // Rule 3: Orders up but revenue down (AOV problem)
  if (ordersChange > 0 && revenueChange < 0) {
    insights.push({
      type: 'orders_up_revenue_down',
      priority: 'high',
      dataPoint: `Orders up ${ordersChange.toFixed(1)}% but revenue down ${Math.abs(revenueChange).toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // Rule 4: AOV dropped
  if (aovChange <= -15) {
    insights.push({
      type: 'aov_drop',
      priority: 'medium',
      dataPoint: `Average order value dropped ${Math.abs(aovChange).toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // Rule 5: Orders dropped
  if (ordersChange <= -15) {
    insights.push({
      type: 'orders_drop',
      priority: ordersChange <= -25 ? 'high' : 'medium',
      dataPoint: `Orders dropped ${Math.abs(ordersChange).toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // Rule 6: Strong week — both up
  if (revenueChange >= 15 && ordersChange >= 10) {
    insights.push({
      type: 'strong_week',
      priority: 'low',
      dataPoint: `Strong week — revenue +${revenueChange.toFixed(1)}%, orders +${ordersChange.toFixed(1)}%`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  // If no rules triggered, give a neutral summary
  if (insights.length === 0) {
    insights.push({
      type: 'stable',
      priority: 'low',
      dataPoint: `Revenue changed ${revenueChange.toFixed(1)}% — relatively stable week`,
      context: { revenueChange, ordersChange, aovChange },
    });
  }

  return { insights, metrics: { revenueChange, ordersChange, aovChange } };
}

module.exports = { runRules };
