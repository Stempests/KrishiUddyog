# 🌾 KrishiUddyog AI
### *Empowering Indian Farmers with Artificial Intelligence*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-orange?logo=google)](https://ai.google.dev)

> A full-stack AI-powered platform for Indian farmers featuring crop recommendations, live mandi prices, disease detection, multilingual AI assistant, and a buyer marketplace.

---

## 🚀 Features

| Feature | Description | AI Model |
|---|---|---|
| 📊 **Farmer Dashboard** | Weather, crop status, market overview | — |
| 🌾 **AI Crop Recommendation** | Personalized crop suggestions | Gemini 1.5 Flash |
| 💰 **Live Mandi Prices** | 7,000+ markets, real-time prices | data.gov.in API |
| 🔬 **Disease Detection** | Photo-based diagnosis + treatment | Gemini Vision |
| 🤖 **Multilingual Assistant** | Chat in Hindi, Marathi, Punjabi, Tamil | Gemini 1.5 Flash |
| 🛒 **Buyer Marketplace** | Direct farmer-to-buyer connection | — |

---

## 🏗️ Project Structure

```
krishiuddyog-ai/
├── frontend/          # Next.js 14 App Router
├── backend/           # Node.js + Express API
└── .env.example       # Environment variables template
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([Get free key](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/krishiuddyog-ai.git
cd krishiuddyog-ai
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and fill environment variables
cp ../.env.example .env
# Edit .env with your actual values

npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy and fill environment variables
cp ../.env.example .env.local
# Edit .env.local with your actual values

npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Copy `.env.example` to:
- `backend/.env`
- `frontend/.env.local`

**Minimum required to run:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret
GEMINI_API_KEY=your_gemini_key
```

See [`.env.example`](.env.example) for all variables.

---

## 🌐 Tech Stack

### Frontend
- **Next.js 14** — App Router, SSR, Route Handlers
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Zustand** — Lightweight state management
- **React Hook Form + Zod** — Type-safe form validation
- **Recharts** — Price charts
- **Lucide React** — Icons

### Backend
- **Node.js + Express** — REST API server
- **MongoDB Atlas** — Cloud database
- **Mongoose** — ODM with typed schemas
- **JWT + bcrypt** — Authentication
- **Multer + Cloudinary** — Image uploads
- **Winston** — Structured logging
- **Zod** — Runtime validation

### AI & External APIs
- **Google Gemini 1.5 Flash** — Text, vision, multilingual
- **data.gov.in Agmarknet** — Mandi prices
- **OpenWeatherMap** — Weather data
- **Cloudinary** — Image storage
- **OpenStreetMap Nominatim** — Reverse geocoding (free)

---

## 📡 API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/profile

POST   /api/v1/crop/recommend          ← AI crop recommendation
GET    /api/v1/crop/history
GET    /api/v1/crop/calendar

GET    /api/v1/mandi/prices
GET    /api/v1/mandi/trending

POST   /api/v1/disease/detect          ← AI vision analysis
GET    /api/v1/disease/reports

POST   /api/v1/assistant/chat          ← Multilingual AI chat
GET    /api/v1/assistant/conversations

GET    /api/v1/marketplace/listings
POST   /api/v1/marketplace/listings
```

---

## 🚀 Deployment

| Service | Platform | Free Tier |
|---|---|---|
| Frontend | Vercel | ✅ |
| Backend | Railway / Render | ✅ 512MB |
| Database | MongoDB Atlas | ✅ 512MB |
| Images | Cloudinary | ✅ 25GB |
| AI | Google Gemini | ✅ Free quota |

### Deploy to Vercel (Frontend)
```bash
cd frontend
npx vercel --prod
```

### Deploy to Railway (Backend)
1. Create Railway project
2. Connect GitHub repo
3. Set root directory to `backend`
4. Add all `.env` variables in Railway dashboard

---

## 🗄️ Database Indexes

Important MongoDB indexes to create after setup:

```javascript
// Geospatial
db.users.createIndex({ "location.coordinates": "2dsphere" })
db.listings.createIndex({ "location.coordinates": "2dsphere" })

// TTL — auto-expire cached mandi prices after 6 hours
db.mandi_prices.createIndex({ fetchedAt: 1 }, { expireAfterSeconds: 21600 })

// Query performance
db.listings.createIndex({ cropName: 1, status: 1, "location.state": 1 })
db.mandi_prices.createIndex({ commodity: 1, state: 1, arrivalDate: -1 })
```

---

## 👨‍💻 Development Order

1. **Day 1-3:** Backend auth + database setup
2. **Day 4:** Frontend shell (dashboard layout, auth pages)
3. **Day 5:** Crop Recommendation (AI integration)
4. **Day 6:** Mandi Prices (external API + caching)
5. **Day 7:** Disease Detection (Gemini Vision)
6. **Day 8:** Multilingual Assistant (chat + history)
7. **Day 9:** Buyer Marketplace (CRUD + geo)
8. **Day 10-14:** Polish, animations, demo data, deployment

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License — Free for personal and commercial use.

---

<div align="center">
  <p>Built with ❤️ for India's 140 million farmers</p>
  <p>🌾 <strong>KrishiUddyog AI</strong> — जय किसान! 🌾</p>
</div>
