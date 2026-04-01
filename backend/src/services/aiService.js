// src/services/aiService.js
const OpenAI = require('openai');

let openai;
function getClient() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

const FALLBACK_INSIGHTS = {
  revenue_drop: {
    what_happened: 'Your revenue dropped compared to last week.',
    why_it_happened: 'This could be due to fewer orders, lower order values, or reduced customer activity.',
    what_to_do: 'Review your top products for availability, check recent ad spend, and consider a promotion.',
    actions: ['Check product availability', 'Review ad performance', 'Send a re-engagement offer to past customers'],
  },
  orders_up_revenue_down: {
    what_happened: 'More orders came in but total revenue declined.',
    why_it_happened: 'Customers are buying lower-priced items, possibly due to a promotion or popular low-cost product.',
    what_to_do: 'Focus on increasing average order value with bundles or upsells.',
    actions: ['Create product bundles', 'Add upsells on checkout page', 'Introduce minimum order discount (e.g. 10% off ₹700+)'],
  },
  revenue_growth: {
    what_happened: 'Revenue grew this week — great momentum.',
    why_it_happened: 'More orders or higher order values are driving growth.',
    what_to_do: 'Double down on what\'s working — identify the top-performing channel or product.',
    actions: ['Identify top traffic source', 'Increase ad budget on best channel', 'Promote best-selling product more'],
  },
  stable: {
    what_happened: 'Revenue stayed relatively stable this week.',
    why_it_happened: 'No major changes in customer behaviour or order patterns.',
    what_to_do: 'Look for small improvements — a 5% boost in AOV compounds quickly.',
    actions: ['Test a new product bundle', 'Add a loyalty incentive', 'Review product page conversion rate'],
  },
};

async function generateInsightText(rule) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-REPLACE')) {
    return FALLBACK_INSIGHTS[rule.type] || FALLBACK_INSIGHTS.stable;
  }

  const { revenueChange, ordersChange, aovChange } = rule.context;
  const prompt = `You are a business advisor for a small D2C (direct-to-consumer) Indian online store owner.

Business data this week:
- Revenue change: ${revenueChange.toFixed(1)}%
- Orders change: ${ordersChange.toFixed(1)}%
- Average order value change: ${aovChange.toFixed(1)}%
- Key observation: ${rule.dataPoint}

Give a concise, actionable insight in this EXACT JSON format (no markdown):
{
  "what_happened": "One clear sentence about what the data shows",
  "why_it_happened": "One sentence explaining the likely reason (be specific, not generic)",
  "what_to_do": "One sentence summary of the recommended action",
  "actions": ["Action 1 (specific)", "Action 2 (specific)", "Action 3 (specific)"]
}

Rules:
- Write in simple English (founder may not speak formal English)
- Be specific — not "improve marketing", say "run retargeting ads on Instagram"
- Max 3 actions
- No jargon
- Focus on D2C context (Shopify, Instagram ads, product pages)`;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.4,
    });
    const text = response.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch {
    return FALLBACK_INSIGHTS[rule.type] || FALLBACK_INSIGHTS.stable;
  }
}

module.exports = { generateInsightText };
