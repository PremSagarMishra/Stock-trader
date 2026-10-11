"""
Quantitative Technical Screener Engine
Implements:
- Mark Minervini's SEPA (Trend Template & VCP)
- Stan Weinstein Stage 2 Uptrend Analysis
- Wilder's RSI (14), True ATR (14), 20/50/150/200 EMAs
- Relative Strength (RS) vs Nifty 50
- Strict Mathematical Pricing: Entry Range, ATR Stop-Loss, 1:2 and 1:3.2 Targets in INR (₹)
- Strict native Python types for clean FastAPI JSON serialization
"""

from typing import Dict, Any, Optional, Tuple
import pandas as pd
import numpy as np

def calculate_ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()

def calculate_sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window).mean()

def calculate_rsi(series: pd.Series, period: int = 14) -> float:
    """Calculates Wilder's Relative Strength Index (RSI)."""
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -1 * delta.clip(upper=0)
    
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()
    
    # Exponential smoothing
    for i in range(period, len(series)):
        avg_gain.iloc[i] = (avg_gain.iloc[i - 1] * (period - 1) + gain.iloc[i]) / period
        avg_loss.iloc[i] = (avg_loss.iloc[i - 1] * (period - 1) + loss.iloc[i]) / period
        
    rs = avg_gain / (avg_loss + 1e-9)
    rsi_series = 100 - (100 / (1 + rs))
    val = rsi_series.iloc[-1]
    return float(val) if not pd.isna(val) else 50.0

def calculate_atr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> float:
    """Calculates Average True Range (ATR)."""
    tr1 = high - low
    tr2 = (high - close.shift()).abs()
    tr3 = (low - close.shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr_series = tr.rolling(window=period).mean()
    val = atr_series.iloc[-1]
    return float(val) if not pd.isna(val) else float(high.iloc[-1] * 0.02)

def check_minervini_trend_template(
    current_price: float,
    ema20: float,
    sma50: float,
    ema150: float,
    ema200: float,
    ema200_20d_ago: float,
    high_52w: float,
    low_52w: float,
    rs_score: float
) -> Tuple[bool, int, list]:
    """
    Minervini 8-point Trend Template Verification with explicit native Python types.
    """
    checks = []
    
    # 1. Price above 150 EMA and 200 EMA
    c1 = bool(current_price > ema150 and current_price > ema200)
    checks.append({"rule": "Price > 150 EMA and 200 EMA", "passed": c1})
    
    # 2. 150 EMA above 200 EMA
    c2 = bool(ema150 > ema200)
    checks.append({"rule": "150 EMA > 200 EMA", "passed": c2})
    
    # 3. 200 EMA trending upward for at least 1 month
    c3 = bool(ema200 >= ema200_20d_ago)
    checks.append({"rule": "200 EMA Trending Upwards (>= 1 Month)", "passed": c3})
    
    # 4. 50 SMA above 150 EMA and 200 EMA
    c4 = bool(sma50 > ema150 and sma50 > ema200)
    checks.append({"rule": "50 SMA > 150 EMA & 200 EMA", "passed": c4})
    
    # 5. Price above 50 SMA
    c5 = bool(current_price >= sma50)
    checks.append({"rule": "Price >= 50 SMA (Institutional Support)", "passed": c5})
    
    # 6. Price at least 25% above 52-week low
    pct_from_low = float(((current_price - low_52w) / (low_52w + 1e-9)) * 100)
    c6 = bool(pct_from_low >= 25.0)
    checks.append({"rule": f"Price >= 25% above 52W Low (Actual: +{round(pct_from_low, 1)}%)", "passed": c6})
    
    # 7. Price within 25% of 52-week high
    pct_from_high = float(((high_52w - current_price) / (high_52w + 1e-9)) * 100)
    c7 = bool(pct_from_high <= 25.0)
    checks.append({"rule": f"Price within 25% of 52W High (Actual: -{round(pct_from_high, 1)}%)", "passed": c7})
    
    # 8. Relative Strength vs Benchmark >= 65
    c8 = bool(rs_score >= 65.0)
    checks.append({"rule": f"Relative Strength vs Nifty 50 >= 65 (Actual: {round(rs_score, 1)})", "passed": c8})
    
    score = int(sum(1 for c in checks if c["passed"]))
    is_passed = bool(score >= 6)
    return is_passed, score, checks

def detect_volatility_contraction(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Detects Volatility Contraction Pattern (VCP).
    """
    if len(df) < 30:
        return {"has_vcp": False, "description": "Insufficient history for VCP analysis"}
    
    w1 = df.iloc[-30:-20]
    w2 = df.iloc[-20:-10]
    w3 = df.iloc[-10:]
    
    span1 = float(((w1['High'].max() - w1['Low'].min()) / (w1['Low'].min() + 1e-9)) * 100)
    span2 = float(((w2['High'].max() - w2['Low'].min()) / (w2['Low'].min() + 1e-9)) * 100)
    span3 = float(((w3['High'].max() - w3['Low'].min()) / (w3['Low'].min() + 1e-9)) * 100)
    
    is_contracting = bool((span3 < span2) or (span3 <= 5.5))
    
    avg_vol_base = float(df['Volume'].iloc[-30:-10].mean())
    recent_vol = float(df['Volume'].iloc[-5:].mean())
    vol_dried_up = bool(recent_vol <= (avg_vol_base * 1.1))
    
    has_vcp = bool(is_contracting and vol_dried_up)
    
    return {
        "has_vcp": has_vcp,
        "span1_pct": round(span1, 1),
        "span2_pct": round(span2, 1),
        "span3_pct": round(span3, 1),
        "vol_dried_up": vol_dried_up,
        "description": f"Contraction spans: {round(span1, 1)}% -> {round(span2, 1)}% -> {round(span3, 1)}%. Vol dry-up: {vol_dried_up}"
    }

def analyze_stock_technicals(df: pd.DataFrame, nifty_df: Optional[pd.DataFrame] = None) -> Optional[Dict[str, Any]]:
    """
    Analyzes stock OHLCV history and extracts complete technical metrics with strict native Python types.
    """
    if df is None or df.empty or len(df) < 40:
        return None
        
    close = df['Close']
    high = df['High']
    low = df['Low']
    volume = df['Volume']
    
    current_price = float(close.iloc[-1])
    prev_close = float(close.iloc[-2]) if len(close) > 1 else current_price
    day_change_pct = float(round(((current_price - prev_close) / prev_close) * 100, 2))
    
    ema20 = float(calculate_ema(close, 20).iloc[-1])
    sma50 = float(calculate_sma(close, 50).iloc[-1])
    ema150 = float(calculate_ema(close, 150).iloc[-1]) if len(close) >= 150 else sma50
    ema200_series = calculate_ema(close, 200) if len(close) >= 200 else calculate_sma(close, len(close))
    ema200 = float(ema200_series.iloc[-1])
    ema200_20d_ago = float(ema200_series.iloc[-20]) if len(ema200_series) >= 20 else ema200
    
    high_52w = float(high.iloc[-250:].max()) if len(high) >= 250 else float(high.max())
    low_52w = float(low.iloc[-250:].min()) if len(low) >= 250 else float(low.min())
    
    rsi = float(calculate_rsi(close, 14))
    atr = float(calculate_atr(high, low, close, 14))
    
    # Volume Surge
    vol_20d_avg = float(volume.iloc[-20:].mean()) if len(volume) >= 20 else float(volume.mean())
    current_volume = float(volume.iloc[-1])
    volume_surge_ratio = float(round(current_volume / (vol_20d_avg + 1e-9), 2))
    
    # Relative Strength calculation vs Nifty 50
    rs_score = 70.0
    if nifty_df is not None and not nifty_df.empty and len(nifty_df) >= 30 and len(close) >= 30:
        stock_perf = float((current_price / float(close.iloc[-30])) - 1)
        nifty_perf = float((float(nifty_df['Close'].iloc[-1]) / float(nifty_df['Close'].iloc[-30])) - 1)
        rs_relative = (stock_perf - nifty_perf) * 100
        rs_score = float(max(10.0, min(99.0, 50.0 + (rs_relative * 2.0))))
    
    # Minervini Trend Template
    trend_passed, trend_score, trend_checks = check_minervini_trend_template(
        current_price, ema20, sma50, ema150, ema200, ema200_20d_ago, high_52w, low_52w, rs_score
    )
    
    # Volatility Contraction
    vcp_data = detect_volatility_contraction(df)
    
    # Stage Analysis
    is_stage_2 = bool(current_price > sma50 and sma50 > ema200 and ema200 >= ema200_20d_ago)
    
    # Mathematical Trade Pricing (₹)
    entry_price = float(round(current_price, 2))
    entry_range_high = float(round(current_price * 1.012, 2))
    
    raw_risk = max(atr * 1.5, current_price * 0.035)
    max_allowed_risk = current_price * 0.06
    final_risk = min(raw_risk, max_allowed_risk)
    
    stop_loss = float(round(current_price - final_risk, 2))
    risk_rupees = float(round(current_price - stop_loss, 2))
    risk_pct = float(round((risk_rupees / current_price) * 100, 2))
    
    target_1 = float(round(current_price + (2.0 * risk_rupees), 2))
    target_1_pct = float(round(((target_1 - current_price) / current_price) * 100, 2))
    
    target_2 = float(round(current_price + (3.2 * risk_rupees), 2))
    target_2_pct = float(round(((target_2 - current_price) / current_price) * 100, 2))
    
    risk_reward_ratio = float(round((target_1 - current_price) / (risk_rupees + 1e-9), 2))
    avg_turnover_cr = float(round((current_price * vol_20d_avg) / 10_000_000, 2))
    
    return {
        "current_price": entry_price,
        "day_change_pct": day_change_pct,
        "ema20": float(round(ema20, 2)),
        "sma50": float(round(sma50, 2)),
        "ema150": float(round(ema150, 2)),
        "ema200": float(round(ema200, 2)),
        "high_52w": float(round(high_52w, 2)),
        "low_52w": float(round(low_52w, 2)),
        "rsi": float(round(rsi, 1)),
        "atr": float(round(atr, 2)),
        "volume_surge_ratio": volume_surge_ratio,
        "avg_turnover_cr": avg_turnover_cr,
        "rs_score": float(round(rs_score, 1)),
        "trend_template_passed": trend_passed,
        "trend_template_score": trend_score,
        "trend_checks": trend_checks,
        "vcp_data": vcp_data,
        "is_stage_2": is_stage_2,
        
        "entry_price": entry_price,
        "entry_range_high": entry_range_high,
        "stop_loss": stop_loss,
        "risk_rupees": risk_rupees,
        "risk_pct": risk_pct,
        "target_1": target_1,
        "target_1_pct": target_1_pct,
        "target_2": target_2,
        "target_2_pct": target_2_pct,
        "risk_reward_ratio": risk_reward_ratio
    }
