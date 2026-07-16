# LocalAI Growth — SaaS Suite for Small Businesses

🔗 **[Live Prototype Preview](https://merry-praline-0f7cbb.netlify.app/)** &nbsp;&nbsp;|&nbsp;&nbsp; [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/vipin11111/localai-growth)

A fully functional, polished, and production-ready MVP designed to help local small businesses build and manage their entire online footprint from one beautiful dashboard. Built using Google's **Material Design 3 (MD3)** aesthetics and powered by the cutting-edge **Gemini API** and **Firebase**.



## Key Modules & Features

### 1. Robust Authentication & Sandbox Bypass
- **Firebase Auth**: Supports secure email/password register, standard login, and Google sign-ins with persistent user tracking.
- **Demo Mode**: Includes an instantaneous sandbox bypass button, allowing users to preview the fully populated, functional cockpit without registering a real record.

### 2. Business Profile Onboarding (Firestore)
- Collects and persists metadata including **Business Name**, **Category/Segment**, **Address**, **Phone**, **Email**, **WhatsApp**, and **Opening Hours**.
- Supports showcase picture galleries and custom brand assets. This metadata feeds straight into all AI engines.

### 3. AI-Powered Website Generator
- Prompts **Gemini** to synthesize homepage titles, CTA actions, core features, story, service tiers with pricing, contact listings, and FAQ sections.
- Houses a **Live Sandbox Preview** styled like a desktop browser, with interactive page tabs and direct **live inline-content editing**.

### 4. AI-Powered Copywriter & Media Suite
- Synthesizes custom post copy, catchy headlines, and hashtag bundles optimized for **Instagram**, **Facebook**, **WhatsApp**, **Blog Articles**, and **Product Descriptions**.
- Features quick "Copy to Clipboard" actions and saves generated text records directly into your Firestore `contents` collection.

### 5. Client Leads & CRM Database
- Real-time Firestore customer tracking: add, edit, search, and delete client records.
- Color-coded pipeline statuses: `New`, `Contacted`, `Qualified`, `Closed Won`, and `Closed Lost`.

### 6. AI SEO & Marketing Strategies
- Synthesizes Google Search Headlines (max 30 characters), Descriptions (max 90 characters), and high-intent local SEO keyword bundles.
- Generates a step-by-step local acquisition strategy with full copy utilities.

### 7. Google Business & Review Center
- High-fidelity mockup integration showing geolocated maps pins, ratings metrics, and review responses.

### 8. Analytics & Rich Charts (Recharts)
- Includes dynamic charts charting monthly web traffic vs CRM conversions (Area Charts), weekly sales revenue vs Google Ads investments (Bar Charts), and referral source distributions (Pie Charts).

### 9. AI Business Advisor Chat
- Interactive, responsive consultation terminal powered by Gemini for strategic queries on local competitors, pricing models, or client acquisitions.

---

## Technical Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Recharts.
- **Backend Service**: Express v4 full-stack engine handling Vite asset serving, CORS proxies, and Google GenAI client routing.
- **Database**: Firebase Authentication & Cloud Firestore (secure custom multi-database instances).
- **Style Archetype**: Material Design 3 (dynamic custom primary hues, generous corner radiuses `rounded-3xl`, clean typography using *Plus Jakarta Sans* and *JetBrains Mono*).

---

## Installation & Deployment Guide

### Local Development
1. Ensure a valid `GEMINI_API_KEY` is configured in your Secrets panel or local `.env` environment.
2. Run `npm install` to load all package dependencies.
3. Boot the development workspace via `npm run dev` (starts the full-stack server on port 3000).
4. Build static bundle targets via `npm run build`.
5. Run the production artifact bundle via `npm run start`.

### Cloud Deployment (Render)
You can deploy a working prototype of this project online in 2 minutes:
1. Click the **Deploy to Render** button at the top of this README.
2. When prompted, paste your `GEMINI_API_KEY` from Google AI Studio.
3. Render will build and deploy the app automatically!

