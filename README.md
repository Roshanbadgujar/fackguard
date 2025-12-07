🌐 FactGuard – AI-Powered Fake News Detection System

A polished mini-project built with Next.js, MongoDB & Gemini 2.5 Flash AI

<div align="center">
🔥 Full-Stack · 🧠 AI-Driven · 🎨 Animated UI · ⚡ Production Ready
</div>
📌 Overview

FactGuard is an intelligent fake-news detection system designed to classify any news text or URL as:

FAKE

SUSPECT

LIKELY REAL

It uses a hybrid detection engine that combines:

🧠 Gemini 2.5 Flash AI (primary classifier)

⚙️ Heuristic rule-based analysis (offline fallback)

🗃️ MongoDB history tracking

🎨 Modern, animated UI with Tailwind + Framer Motion

Though created as a mini project, it is engineered with full-stack, industry-grade structure.

✨ Features
🔍 1. Dual-Engine Fake News Detection
AI Engine (Gemini 2.5 Flash)

Generates classification: FAKE / SUSPECT / LIKELY REAL

Produces a fake score (0–100)

Provides short, meaningful bullet-point reasons

Heuristic Engine

Works offline & checks:

Clickbait keywords

Excessive ALL-CAPS usage

URL credibility

Exclamation / sensational patterns

Unsupported numeric claims

Both engines combine to create a stronger, more accurate score.

⚡ 2. Modern UI with Animations

Glassmorphism design

Smooth transitions with Framer Motion

Live analysis with animated loaders

AI toggle switch (ON/OFF)

Result cards with status badges

🗂️ 3. Analysis History

Every analysis is stored in MongoDB and shown as:

Result label

Fake score

Snippet of text

Timestamp

🌐 4. Works Offline + Online

AI disabled → heuristic only

AI enabled → Gemini-powered analysis

Safe fallbacks prevent crashes

🔐 5. Secure & Production Ready

Environment-based API keys

No public key exposure

Sanitized database writes

Stable Next.js API routes

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 16 (App Router)
UI Styling	Tailwind CSS
Animations	Framer Motion
Backend	Next.js API Routes
Database	MongoDB + Mongoose
AI Engine	Google Gemini 2.5 Flash
Deployment	Vercel / Render
🖼️ Screenshots

(Add your own images here)

![Homepage](./screens/home.png)
![Result](./screens/result.png)
![History](./screens/history.png)

📦 Installation Guide
1️⃣ Clone the repo
git clone https://github.com/Roshanbadgujar/fackguard.git 
cd factguard

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create a file named .env.local:

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/factguard?retryWrites=false&w=majority
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

4️⃣ Start local development
npm run dev


App runs at → http://localhost:3000

🧠 How Detection Works
If user submits TEXT

Heuristic system analyzes tone & patterns

Gemini AI generates its classification

Both results merge into a final score

Saved to database

Displayed with animations

If user submits URL

URL credibility scoring

AI disabled (text-only for now)

📡 API Endpoints
🔹 POST /api/check

Request

{
  "mode": "text",
  "text": "Your news content...",
  "useAi": true
}


Response

{
  "label": "FAKE",
  "score": 87,
  "reasons": ["Clickbait words detected", "AI predicts high probability"],
  "ai": {...},
  "heuristic": {...}
}

🔹 GET /api/history

Returns latest 10 analyses.

🚀 Deployment (Vercel)

Push your code to GitHub

Import repo into Vercel

Add environment variables

Deploy — done! 🎉

🔮 Future Enhancements

AI confidence meter

Fact-source verification

PDF report generator

Admin dashboard

Multi-language detection

❤️ Credits

Developer: Your Name
Mini Project · Full-Stack + AI · 2025

📄 License

MIT License © 2025 — Free to use & modify.