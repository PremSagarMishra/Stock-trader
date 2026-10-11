# AlphaTrader NSE — Institutional Quantitative & AI Stock Selection Engine

A trigger-driven stock selection and trading decision system engineered specifically for the **Indian Stock Market (NSE / BSE)**. It models the battle-tested strategies of legendary market wizards (**Mark Minervini SEPA/VCP**, **Stan Weinstein Stage 2 Breakouts**, and **William O'Neil CAN SLIM India**), combined with real-time Indian financial news scraping and a Google Gemini AI Risk Officer.

---

## 🇮🇳 Why It Works for the Indian Market

1. **Nifty 50 (`^NSEI`) Market Regime Filter**:
   - 75%+ of Indian stocks correlate with Nifty 50. The engine classifies macro direction (`Confirmed Uptrend`, `Pullback Under Pressure`, `Market Correction`, `Bear Regime`) to adjust position sizing dynamically and prevent buying false breakouts during market distributions.
2. **NSE Circuit Limit & Liquidity Safeguards**:
   - Enforces a minimum **₹3–5 Crore average daily turnover** to eliminate operator manipulation and illiquidity traps.
   - Circuit-band aware (5%, 10%, 20%).
3. **Relative Strength (RS) Outperformance**:
   - Filters only equities in the top 25th percentile (RS > 70) relative to `^NSEI`.
4. **Dual-Pipeline Strategy**:
   - **Short-Term Swing Picks (2–14 Days)**: Minervini Volatility Contraction Pattern (VCP) breakouts, 20 EMA pullbacks, momentum velocity.
   - **Long-Term Positional Picks (3–12 Months)**: Stage 2 accumulation compounders, multi-month bases.
5. **Deterministic Trade Execution Pricing (₹ INR)**:
   - **Entry Range**: `[Pivot Price, Pivot Price + 1.2%]`.
   - **Stop-Loss**: `1.5 * ATR` below pivot or swing low (max 4–6% risk).
   - **Target 1**: 1:2 Risk-to-Reward ratio (+7% to +10%).
   - **Target 2**: 1:3.2+ Risk-to-Reward ratio (+14% to +18%+).
6. **Real-Time Indian News & AI Risk Officer**:
   - Live scraping of Indian financial news (Moneycontrol, Economic Times, Google News RSS) for corporate actions, order wins, and earnings.
   - Google Gemini 2.5 Flash acts as an institutional Risk Officer to evaluate catalyst clarity, detect red flags (SEBI inquiries, promoter pledges), score conviction (1–100), and write actionable bull/bear notes.
   - Graceful fallback: 100% functional in pure quantitative mode without an API key!
7. **INR (₹) Position Sizing Calculator**:
   - Calculates the exact number of shares to purchase based on your total account capital and strict 1% portfolio risk limits.

---

## 🚀 Quick Start Guide

### 1. Start the Python FastAPI Backend
Open a terminal in `stock-trader/backend`:
```powershell
cd backend
python -m pip install -r requirements.txt
python main.py
```
*Backend runs at `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`.*

### 2. Start the React + Vite Web Terminal
Open a terminal in `stock-trader/frontend`:
```powershell
cd frontend
npm install
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 🏗️ Architecture & Deployment

- **Backend Stack**: Python 3.12, FastAPI, `yfinance` (NSE `.NS` feeds), `pandas`, `beautifulsoup4`, `httpx`, `google-generativeai`, SQLite audit database.
- **Frontend Stack**: React 19, TypeScript, Vite, Lucide Icons, Pure CSS Design System (Slate dark mode, JetBrains Mono numbers, glassmorphism).
- **Deployment**:
  - Backend: Free tier on Render, Railway, Fly.io, or VPS (`uvicorn main:app --host 0.0.0.0 --port 8000`).
  - Frontend: Vercel, Netlify, or Cloudflare Pages (`npm run build`). Update the backend API URL in the Settings modal.
