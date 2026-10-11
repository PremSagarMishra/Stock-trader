"""
Unit tests for Technical Screener, Pricing Math, and Position Size Calculator.
"""

import unittest
import pandas as pd
import numpy as np

from screener.technical_engine import (
    calculate_ema,
    calculate_sma,
    calculate_rsi,
    calculate_atr,
    check_minervini_trend_template
)

class TestTechnicalEngine(unittest.TestCase):
    
    def setUp(self):
        # Create a synthetic 100-day uptrend dataframe
        dates = pd.date_range(start="2025-01-01", periods=100)
        np.random.seed(42)
        base_price = 1000.0
        prices = [base_price]
        for _ in range(99):
            step = np.random.normal(loc=2.0, scale=5.0)  # General upward drift
            prices.append(prices[-1] + step)
            
        self.df = pd.DataFrame({
            "Open": [p - 1.0 for p in prices],
            "High": [p + 4.0 for p in prices],
            "Low": [p - 4.0 for p in prices],
            "Close": prices,
            "Volume": [100000 + int(np.random.uniform(0, 50000)) for _ in prices]
        }, index=dates)

    def test_ema_and_sma(self):
        close = self.df["Close"]
        ema20 = calculate_ema(close, 20)
        sma20 = calculate_sma(close, 20)
        self.assertEqual(len(ema20), 100)
        self.assertEqual(len(sma20), 100)
        self.assertFalse(pd.isna(ema20.iloc[-1]))
        self.assertFalse(pd.isna(sma20.iloc[-1]))

    def test_rsi_bounds(self):
        rsi = calculate_rsi(self.df["Close"], 14)
        self.assertGreaterEqual(rsi, 0.0)
        self.assertLessEqual(rsi, 100.0)

    def test_atr_positive(self):
        atr = calculate_atr(self.df["High"], self.df["Low"], self.df["Close"], 14)
        self.assertGreater(atr, 0.0)

    def test_minervini_trend_template(self):
        # Test a clearly passing scenario
        passed, score, checks = check_minervini_trend_template(
            current_price=1200.0,
            ema20=1150.0,
            sma50=1100.0,
            ema150=1000.0,
            ema200=950.0,
            ema200_20d_ago=920.0,
            high_52w=1250.0,
            low_52w=800.0,
            rs_score=85.0
        )
        self.assertTrue(passed)
        self.assertEqual(score, 8)
        self.assertEqual(len(checks), 8)

    def test_position_sizing_logic(self):
        capital = 100000.0   # ₹1 Lakh
        risk_pct = 1.0       # 1% risk = ₹1,000 max loss
        entry = 1000.0       # ₹1000 buy
        sl = 950.0           # ₹950 stop loss (-5%)
        
        risk_per_share = entry - sl  # ₹50
        max_loss_allowed = capital * (risk_pct / 100.0)  # ₹1000
        shares_to_buy = int(max_loss_allowed // risk_per_share)  # 20 shares
        
        self.assertEqual(shares_to_buy, 20)
        total_investment = shares_to_buy * entry  # ₹20,000
        actual_risk = shares_to_buy * risk_per_share  # ₹1,000
        self.assertEqual(total_investment, 20000.0)
        self.assertEqual(actual_risk, 1000.0)

if __name__ == "__main__":
    unittest.main()
