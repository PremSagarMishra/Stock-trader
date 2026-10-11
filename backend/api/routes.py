"""
FastAPI Route Handlers for Stock Trader API
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import math
from datetime import datetime

from screener.pipeline import run_market_scan
from storage.scan_history import get_latest_scan, get_scan_history
from screener.market_regime import get_indian_market_regime

router = APIRouter()

class TriggerScanRequest(BaseModel):
    gemini_api_key: Optional[str] = None

class PositionSizeRequest(BaseModel):
    capital_inr: float = Field(..., gt=0, description="Total trading capital in INR")
    risk_percentage: float = Field(default=1.0, gt=0, le=5.0, description="Max risk percentage per trade (e.g. 1.0%)")
    entry_price: float = Field(..., gt=0, description="Entry price in INR")
    stop_loss: float = Field(..., gt=0, description="Stop loss price in INR")
    target_1: Optional[float] = None
    target_2: Optional[float] = None

@router.get("/health")
def health_check():
    regime = get_indian_market_regime()
    return {
        "status": "online",
        "market": "NSE / BSE (India)",
        "server_time_ist": datetime.now().isoformat(),
        "market_regime": regime["status_badge"],
        "nifty_price": regime["current_price"]
    }

@router.post("/scan/trigger")
def trigger_market_scan(req: TriggerScanRequest):
    """
    Triggers an on-demand real-time quantitative and AI market scan.
    """
    try:
        results = run_market_scan(api_key=req.gemini_api_key)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market scan error: {str(e)}")

@router.get("/scan/latest")
def get_most_recent_scan():
    """
    Fetches the most recent cached scan result. If none exists, runs an initial quick scan.
    """
    latest = get_latest_scan()
    if latest:
        return latest
        
    # If no scan in database yet, trigger one now
    try:
        new_scan = run_market_scan()
        return new_scan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load market data: {str(e)}")

@router.get("/scan/history")
def get_historical_scans():
    """
    Returns the last 10 scan records.
    """
    return get_scan_history(limit=10)

@router.post("/calculator/position-size")
def calculate_position_size(req: PositionSizeRequest):
    """
    Calculates exact share quantity and rupee risk for Indian capital protection.
    """
    if req.stop_loss >= req.entry_price:
        raise HTTPException(status_code=400, detail="Stop loss must be lower than entry price for a buy trade.")
        
    risk_per_share = req.entry_price - req.stop_loss
    max_risk_inr = req.capital_inr * (req.risk_percentage / 100.0)
    
    # Position quantity based on risk limit
    quantity = math.floor(max_risk_inr / risk_per_share)
    if quantity < 1:
        quantity = 1  # Minimum 1 share
        
    total_investment_required = round(quantity * req.entry_price, 2)
    actual_risk_inr = round(quantity * risk_per_share, 2)
    risk_on_capital_pct = round((actual_risk_inr / req.capital_inr) * 100, 2)
    portfolio_allocation_pct = round((total_investment_required / req.capital_inr) * 100, 2)
    
    resp = {
        "capital_inr": req.capital_inr,
        "entry_price": req.entry_price,
        "stop_loss": req.stop_loss,
        "risk_per_share": round(risk_per_share, 2),
        "shares_to_buy": quantity,
        "total_capital_required": total_investment_required,
        "portfolio_allocation_pct": portfolio_allocation_pct,
        "max_risk_inr": actual_risk_inr,
        "risk_on_capital_pct": risk_on_capital_pct
    }
    
    if req.target_1:
        gain_t1_per_share = req.target_1 - req.entry_price
        total_gain_t1 = round(quantity * gain_t1_per_share, 2)
        resp["potential_profit_target_1"] = total_gain_t1
        resp["risk_reward_t1"] = round(gain_t1_per_share / risk_per_share, 2)
        
    if req.target_2:
        gain_t2_per_share = req.target_2 - req.entry_price
        total_gain_t2 = round(quantity * gain_t2_per_share, 2)
        resp["potential_profit_target_2"] = total_gain_t2
        resp["risk_reward_t2"] = round(gain_t2_per_share / risk_per_share, 2)
        
    return resp
