<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sprout.svg" alt="KrishiUddyog Logo" width="120" height="120">
  
  # 🌾 KrishiUddyog AI 🤖
  
  **Empowering Indian Farmers with Artificial Intelligence**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  <p align="center">
    <a href="#-project-overview">Overview</a> •
    <a href="#-core-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation--setup">Installation</a> •
    <a href="#-environment-variables">Env Vars</a> •
    <a href="#-future-scope">Future Scope</a>
  </p>
</div>

---

## 📖 Project Overview

**KrishiUddyog AI** is a state-of-the-art agricultural intelligence platform designed to bridge the gap between traditional Indian farming and modern AI technology. Built with a mobile-first, highly animated, premium UI, it acts as a digital companion for farmers, providing them with data-driven insights to maximize yield, minimize crop loss, and secure fair market prices.

Whether it's detecting a disease on a leaf, forecasting local Mandi prices, or just having a chat in Hindi with the KrishiMitra AI assistant—KrishiUddyog brings the power of Silicon Valley to the rural farmlands.

---

## ✨ Core Features

### 1. 🌾 AI Crop Recommendation Engine
- Analyzes soil composition (Nitrogen, Phosphorous, Potassium).
- Takes into account real-time temperature, humidity, rainfall, and pH levels.
- Recommends the absolute best crop to plant using a highly-trained AI classification model.

### 2. 🔬 Vision AI Disease Detection
- Farmers simply upload a photo of a sick plant.
- Our Vision AI instantly diagnoses the disease (e.g., Apple Scab, Tomato Blight).
- Provides immediately actionable, step-by-step treatment plans including organic remedies and chemical solutions.

### 3. 🤖 KrishiMitra (Multilingual Voice AI)
- A conversational AI assistant that acts as a 24/7 agronomist.
- **Multilingual Support**: Supports Hindi, English, Marathi, Punjabi, Bengali, Telugu, and Tamil.
- **Voice Enabled**: Includes Web Speech API integration. Farmers can speak their questions, and KrishiMitra will reply and read its answers out loud.

### 4. 📈 Live Mandi Prices & Analytics
- Visualizes real-time commodity prices across Indian APMCs.
- Uses animated `Recharts` to show price trends and volatility.

### 5. 🛒 Peer-to-Peer Marketplace
- Cuts out the middleman! Farmers can list their harvest directly to buyers.
- Secure JWT-based authentication system.

---

## 💻 Tech Stack

### Frontend Architecture
- **Framework**: Next.js (App Router, Server Components)
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion (Glassmorphism, Skeletons, Page Transitions)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

### Backend Architecture
- **Framework**: Node.js & Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt

---

## 📸 Screenshots
*(Add your stunning UI screenshots here!)*
- `Dashboard Layout`
- `AI Disease Scanner Pulse Animation`
- `KrishiMitra Chatbot`
- `Live Mandi Price Area Charts`

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account
- Google Gemini API Key

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/krishi-uddyog.git
cd krishi-uddyog
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend will run on `http://localhost:5000`*

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`*

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/krishiuddyog?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ☁️ Deployment Guide

1. **Database**: Your MongoDB is already hosted on MongoDB Atlas.
2. **Backend (Express)**: Deploy the `backend` folder to **Render**, **Railway**, or **Heroku**. Don't forget to add your Environment Variables in the hosting dashboard.
3. **Frontend (Next.js)**: Deploy the `frontend` folder directly to **Vercel**. Connect your GitHub repo, select the `frontend` root directory, and set `NEXT_PUBLIC_API_URL` to your live backend URL.

---

## 🔮 Future Scope

- [ ] **Hardware Integration**: Connect IoT soil moisture sensors directly to the dashboard.
- [ ] **Drone Integration**: Automate disease scanning over large acres using drone footage.
- [ ] **Blockchain Supply Chain**: Track crops from seed to supermarket ensuring fair trade for farmers.

---

## 🤝 Team & Vision

**KrishiUddyog** was born out of a desire to stop farmer exploitation and eliminate information asymmetry. By putting a world-class AI agronomist in the pocket of every farmer, we envision a future where agriculture is predictable, profitable, and sustainable.
