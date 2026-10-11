"""
Google Gemini AI Risk Officer & Catalyst Validator
Evaluates technical setups alongside scraped real-time news to detect dealbreakers,
score trade conviction (1-100), and write institutional-grade bull/bear rationale.
Includes 100% deterministic fallback if GEMINI_API_KEY is absent.
"""

import os
import json
import warnings
from typing import Dict, Any, List, Optional

warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai

def evaluate_stock_with_ai(
    stock_meta: Dict[str, str],
    technicals: Dict[str, Any],
    news_items: List[Dict[str, Any]],
    market_regime: Dict[str, Any],
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates candidate stock setup using Gemini.
    Returns conviction score, verdict, bull thesis, and invalidation risks.
    """
    gemini_key = api_key or os.getenv("GEMINI_API_KEY", "")
    
    # 1. Fallback if no Gemini API key configured
    if not gemini_key:
        return generate_deterministic_risk_assessment(stock_meta, technicals, news_items, market_regime)
        
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        headlines_summary = "\n".join([f"- [{n.get('source', 'News')}] {n.get('title', '')} ({n.get('sentiment', 'NEUTRAL')})" for n in news_items[:4]])
        
        prompt = f"""
You are an institutional Chief Risk Officer and Senior Portfolio Manager specializing in the Indian Stock Market (NSE/BSE).
Your job is to evaluate this candidate stock setup for REAL CAPITAL ALLOCATION and filter out false breakouts or risky traps.

STOCK DATA:
- Symbol: {stock_meta.get('code')} ({stock_meta.get('name')})
- Sector: {stock_meta.get('sector')}
- Current Price: ₹{technicals.get('current_price')}
- Proposed Entry: ₹{technicals.get('entry_price')} to ₹{technicals.get('entry_range_high')}
- Stop Loss: ₹{technicals.get('stop_loss')} (-{technicals.get('risk_pct')}%)
- Target 1: ₹{technicals.get('target_1')} (+{technicals.get('target_1_pct')}%, R:R {technicals.get('risk_reward_ratio')})
- Target 2: ₹{technicals.get('target_2')} (+{technicals.get('target_2_pct')}%)
- RSI: {technicals.get('rsi')} | Relative Strength vs Nifty 50: {technicals.get('rs_score')}/100
- Minervini Trend Template Score: {technicals.get('trend_template_score')}/8
- Volatility Contraction Pattern (VCP): {technicals.get('vcp_data', {}).get('has_vcp')}
- Nifty 50 Market Condition: {market_regime.get('status_badge')} ({market_regime.get('advisory')})

LATEST SCRAPED INDIAN NEWS & HEADLINES:
{headlines_summary}

TASK:
Analyze if this trade should be executed with real money. Look out for red flags (SEBI inquiries, promoter pledges, bad earnings) vs positive catalysts (order wins, capex, breakout volume).

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{{
  "conviction_score": 85,
  "verdict": "APPROVED",
  "bull_thesis": [
    "Primary technical reason for trade edge",
    "Fundamental or catalyst driver from news/sector"
  ],
  "invalidation_risk": [
    "Exact technical or fundamental threat that voids the setup"
  ],
  "suggested_action": "Concise 1-sentence actionable advice for the trader"
}}
verdict must be one of: "APPROVED", "CAUTION", "REJECTED".
conviction_score must be an integer between 1 and 100.
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean potential markdown wrappers
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        parsed = json.loads(text)
        return {
            "ai_powered": True,
            "conviction_score": int(parsed.get("conviction_score", 80)),
            "verdict": str(parsed.get("verdict", "APPROVED")),
            "bull_thesis": list(parsed.get("bull_thesis", ["High relative strength and Stage 2 uptrend"])),
            "invalidation_risk": list(parsed.get("invalidation_risk", ["Close below stop loss level"])),
            "suggested_action": str(parsed.get("suggested_action", f"Execute entry near ₹{technicals.get('entry_price')} with strict SL at ₹{technicals.get('stop_loss')}"))
        }
    except Exception as e:
        # Graceful fallback to deterministic assessment on any API error or timeout
        fallback = generate_deterministic_risk_assessment(stock_meta, technicals, news_items, market_regime)
        fallback["error_note"] = f"Gemini API fallback: {str(e)[:40]}"
        return fallback

def generate_deterministic_risk_assessment(
    stock_meta: Dict[str, str],
    technicals: Dict[str, Any],
    news_items: List[Dict[str, Any]],
    market_regime: Dict[str, Any]
) -> Dict[str, Any]:
    """
    High-fidelity deterministic quantitative scoring model when AI key is absent.
    Evaluates Minervini score, Relative Strength, Volume Surge, and news keywords.
    """
    base_score = 50
    trend_score = technicals.get("trend_template_score", 6)
    base_score += (trend_score * 4)  # +24 to +32
    
    rs_score = technicals.get("rs_score", 70.0)
    if rs_score >= 80:
        base_score += 10
    elif rs_score >= 70:
        base_score += 5
        
    vcp = technicals.get("vcp_data", {}).get("has_vcp", False)
    if vcp:
        base_score += 6
        
    vol_surge = technicals.get("volume_surge_ratio", 1.0)
    if vol_surge >= 1.5:
        base_score += 5
        
    # Check news sentiment penalties/bonuses
    has_neg_news = any(n.get("sentiment") == "NEGATIVE" for n in news_items)
    has_pos_news = any(n.get("sentiment") == "POSITIVE" for n in news_items)
    
    if has_neg_news:
        base_score -= 15
    if has_pos_news:
        base_score += 5
        
    # Market regime penalty
    if market_regime.get("regime") == "MARKET_CORRECTION":
        base_score -= 10
    elif market_regime.get("regime") == "BEAR_MARKET":
        base_score -= 20
        
    final_score = max(35, min(96, base_score))
    
    if final_score >= 78:
        verdict = "APPROVED"
    elif final_score >= 60:
        verdict = "CAUTION"
    else:
        verdict = "REJECTED"
        
    bull_thesis = [
        f"Meets Minervini Trend Template ({trend_score}/8) with RS Rating of {technicals.get('rs_score')} vs Nifty 50.",
        f"Consolidation base breakout structure with 1:{technicals.get('risk_reward_ratio')} Risk-to-Reward profile."
    ]
    if vcp:
        bull_thesis.append("Volatility Contraction Pattern (VCP) detected with drying volume before breakout.")
        
    invalidation_risk = [
        f"Daily closing breach below stop-loss level ₹{technicals.get('stop_loss')} invalidates the trade setup.",
        "Sudden market-wide distribution day or adverse sector index weakness."
    ]
    if has_neg_news:
        invalidation_risk.append("Recent headline cautions detected in Indian financial press.")
        
    suggested_action = f"Stagger entry between ₹{technicals.get('entry_price')} and ₹{technicals.get('entry_range_high')}. Strictly honour stop-loss at ₹{technicals.get('stop_loss')}."
    
    return {
        "ai_powered": False,
        "conviction_score": final_score,
        "verdict": verdict,
        "bull_thesis": bull_thesis,
        "invalidation_risk": invalidation_risk,
        "suggested_action": suggested_action
    }
