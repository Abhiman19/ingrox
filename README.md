# Growlytics — Full Stack MVP

Sales insights engine for D2C founders. Enter your weekly revenue + orders → get clear AI-powered insights.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Backend | Node.js, Express |
| Database | PostgreSQL (Supabase recommended) |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-3.5-turbo (with fallback) |
| Deployment | Frontend → Vercel, Backend → Railway, DB → Supabase |

---

## Project Structure

```
growlytics/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── auth/
│   │   │   │   ├── signup/page.tsx   # Sign up
│   │   │   │   └── login/page.tsx    # Login
│   │   │   ├── setup/page.tsx        # Business setup
│   │   │   ├── input/page.tsx        # Data input
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   └── insights/page.tsx # Insights
│   │   │   ├── privacy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx
│   │   │       └── Footer.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios instance
│   │   │   └── AuthContext.tsx       # Auth state
│   │   └── hooks/
│   │       └── useToast.tsx
│   └── package.json
│
└── backend/           # Express API
    ├── src/
    │   ├── index.js              # Server entry
    │   ├── db/
    │   │   ├── pool.js           # PostgreSQL pool
    │   │   └── migrate.js        # Schema migration
    │   ├── middleware/
    │   │   └── auth.js           # JWT middleware
    │   ├── routes/
    │   │   ├── auth.js           # /api/auth
    │   │   ├── business.js       # /api/business
    │   │   ├── data.js           # /api/data
    │   │   ├── insights.js       # /api/insights
    │   │   └── feedback.js       # /api/feedback
    │   ├── services/
    │   │   ├── ruleEngine.js     # Business rules
    │   │   └── aiService.js      # OpenAI integration
    │   └── utils/
    │       └── logger.js
    └── package.json
```

---

## Local Development Setup

### 1. Database (PostgreSQL)

Option A — Supabase (recommended, free):
1. Go to https://supabase.com → New project
2. Copy the connection string from Settings → Database
3. Run migrations: `node src/db/migrate.js`

Option B — Local Postgres:
```bash
createdb growlytics
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, FRONTEND_URL
npm install
node src/db/migrate.js    # Run once
npm run dev               # Starts on port 5000
```

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev               # Starts on port 3000
```

### 4. Test the app

1. Open http://localhost:3000
2. Sign up → Business setup → Enter data → View dashboard

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |

### Business
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/business/create | Yes | Create/update business |
| GET | /api/business/me | Yes | Get my business |

### Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/data/add | Yes | Submit week data + trigger analysis |
| GET | /api/data/latest | Yes | Get latest dashboard data |
| GET | /api/data/history | Yes | Get last 12 weeks |

### Insights
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/insights/latest | Yes | Get insights for latest data |
| GET | /api/insights/all | Yes | All insights (paginated) |

### Feedback
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/feedback | Yes | Submit helpful/not_helpful |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set env: NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend → Railway

1. Go to https://railway.app → New project → Deploy from GitHub
2. Add environment variables (copy from .env.example)
3. Railway auto-detects Node.js and runs `npm start`

### Database → Supabase

1. Create project at https://supabase.com
2. Copy DATABASE_URL from Settings → Database → Connection string
3. Set `DATABASE_URL` in Railway backend env vars
4. Run migrations once:
   ```bash
   DATABASE_URL=your_url node backend/src/db/migrate.js
   ```

---

## Security Checklist

### Implemented ✅
- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] Constant-time password comparison (prevents timing attacks)
- [x] JWT tokens with expiry (7 days)
- [x] HTTP security headers via Helmet (HSTS, CSP, X-Frame-Options, nosniff)
- [x] CORS restricted to frontend URL only
- [x] Global rate limiting (100 req/15 min)
- [x] Auth route rate limiting (10 req/15 min — brute force protection)
- [x] Input validation on all endpoints (express-validator)
- [x] Parameterised SQL queries (no SQL injection possible)
- [x] Request body size limited to 1MB
- [x] SSL enforced in production (DB + HTTPS)
- [x] No sensitive data in logs
- [x] Auth token stored in httpOnly-equivalent cookie (sameSite: strict)

### Before going live — do these:
- [ ] Set `NODE_ENV=production` on Railway
- [ ] Generate a strong JWT_SECRET (64+ random chars)
- [ ] Enable Supabase Row Level Security (RLS) policies
- [ ] Set up error monitoring (Sentry free tier)
- [ ] Enable Vercel Analytics
- [ ] Add a custom domain + verify HTTPS is active

---

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
FRONTEND_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## OpenAI Note

The app works **without** an OpenAI key — it falls back to pre-written, high-quality insight templates. Add your key when you're ready to upgrade to personalised AI insights.

---

## Weekly Flow (How it works)

1. User enters current week revenue + orders
2. Backend checks: first time? → uses provided previous data. Return? → uses last week's current automatically (rolling week system)
3. Rule engine runs 6 rules to detect problems/growth
4. OpenAI formats 3 insights with what/why/action
5. User sees dashboard + insight cards
6. User gives thumbs up/down feedback

---

## License

MIT — build freely, ship fast.
