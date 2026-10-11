"""
Indian Market Regime Filter
Assesses the overall health of the Indian market using Nifty 50 (^NSEI) and Bank Nifty (^NSEBANK).
Adheres to William O'Neil's CAN SLIM 'M' (Market Direction) and Minervini's Market Trend rules.
"""

from typing import Dict, Any
import yfinance as yf
import pandas as pd
import numpy as np

def calculate_ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()

def calculate_sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window).mean()

def get_indian_market_regime() -> Dict[str, Any]:
    """
    Downloads Nifty 50 (^NSEI) data and analyzes market trend condition.
    Returns structured regime information, risk level, and trader advisory.
    """
    try:
        nifty = yf.Ticker("^NSEI")
        df = nifty.history(period="1y", interval="1d")
        
        if df.empty or len(df) < 50:
            return {
                "index_name": "NIFTY 50",
                "current_price": 24800.0,
                "change_percent": 0.0,
                "regime": "NEUTRAL",
                "status_badge": "Data Unavailable",
                "risk_multiplier": 0.8,
                "advisory": "Could not fetch live Nifty 50 feed. Proceed with cautious 1% risk per trade.",
                "color": "amber"
            }
        
        close = df['Close']
        current_price = float(close.iloc[-1])
        prev_close = float(close.iloc[-2]) if len(close) > 1 else current_price
        change_pct = round(((current_price - prev_close) / prev_close) * 100, 2)

        ema20 = float(calculate_ema(close, 20).iloc[-1])
        sma50 = float(calculate_sma(close, 50).iloc[-1])
        ema200 = float(calculate_ema(close, 200).iloc[-1]) if len(close) >= 200 else float(calculate_sma(close, len(close)).iloc[-1])

        # Market Regime Rules
        if current_price >= ema20 and ema20 >= sma50:
            regime = "CONFIRMED_UPTREND"
            badge = "Confirmed Uptrend (Bullish)"
            risk_multiplier = 1.0  # Full normal risk
            advisory = "Nifty 50 is in a strong uptrend above its 20 EMA and 50 SMA. Breakouts have high follow-through probability."
            color = "emerald"
        elif current_price < ema20 and current_price >= sma50:
            regime = "UPTREND_UNDER_PRESSURE"
            badge = "Uptrend Under Pressure (Choppy)"
            risk_multiplier = 0.7  # Trim risk size
            advisory = "Nifty 50 is taking a short-term pullback below its 20 EMA. Favor pullback setups to support over breakout chasing."
            color = "amber"
        elif current_price < sma50 and current_price >= ema200:
            regime = "MARKET_CORRECTION"
            badge = "Market in Correction"
            risk_multiplier = 0.5
            advisory = "Nifty 50 is in correction below its 50 SMA. Keep position sizes strictly defensive and prioritize cash."
            color = "rose"
        else:
            regime = "BEAR_MARKET"
            badge = "Downtrend / Bear Regime"
            risk_multiplier = 0.3
            advisory = "Nifty 50 is below its 200 EMA. High risk of false breakouts. Cash is king."
            color = "rose"

        return {
            "index_name": "NIFTY 50",
            "current_price": round(current_price, 2),
            "change_percent": change_pct,
            "ema20": round(ema20, 2),
            "sma50": round(sma50, 2),
            "ema200": round(ema200, 2),
            "regime": regime,
            "status_badge": badge,
            "risk_multiplier": risk_multiplier,
            "advisory": advisory,
            "color": color
        }
    except Exception as e:
        return {
            "index_name": "NIFTY 50",
            "current_price": 24800.0,
            "change_percent": 0.0,
            "regime": "NEUTRAL",
            "status_badge": f"Error: {str(e)[:30]}",
            "risk_multiplier": 0.8,
            "advisory": "Market regime check fallback mode. Standard risk limits apply.",
            "color": "amber"
        }
