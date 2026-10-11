import React, { useState, useEffect } from 'react';
import type { StockRecommendation, PositionSizeResult } from '../types';
import { X, Calculator, ShieldCheck } from 'lucide-react';

interface RiskCalculatorModalProps {
  initialStock: StockRecommendation | null;
  onClose: () => void;
}

const PRESET_CAPITALS = [50000, 100000, 250000, 500000, 1000000];

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({
  initialStock,
  onClose,
}) => {
  const [capital, setCapital] = useState<number>(100000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<number>(initialStock?.technicals.entry_price || 1000);
  const [stopLoss, setStopLoss] = useState<number>(initialStock?.technicals.stop_loss || 950);
  const [target1, setTarget1] = useState<number>(initialStock?.technicals.target_1 || 1100);
  const [target2, setTarget2] = useState<number>(initialStock?.technicals.target_2 || 1160);
  
  const [calcResult, setCalcResult] = useState<PositionSizeResult | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialStock) {
      setEntryPrice(initialStock.technicals.entry_price);
      setStopLoss(initialStock.technicals.stop_loss);
      setTarget1(initialStock.technicals.target_1);
      setTarget2(initialStock.technicals.target_2);
    }
  }, [initialStock]);

  useEffect(() => {
    runCalculation();
  }, [capital, riskPct, entryPrice, stopLoss, target1, target2]);

  const runCalculation = async () => {
    if (stopLoss >= entryPrice) {
      setError('Stop loss must be lower than entry price');
      setCalcResult(null);
      return;
    }
    setError('');
    
    // Quick client-side calculation for zero lag, validated against formula
    const riskPerShare = entryPrice - stopLoss;
    const maxRiskInr = capital * (riskPct / 100.0);
    const sharesToBuy = Math.max(1, Math.floor(maxRiskInr / riskPerShare));
    const totalRequired = Math.round(sharesToBuy * entryPrice);
    const actualRiskInr = Math.round(sharesToBuy * riskPerShare);
    const profitT1 = target1 ? Math.round(sharesToBuy * (target1 - entryPrice)) : undefined;
    const profitT2 = target2 ? Math.round(sharesToBuy * (target2 - entryPrice)) : undefined;

    setCalcResult({
      capital_inr: capital,
      entry_price: entryPrice,
      stop_loss: stopLoss,
      risk_per_share: Math.round(riskPerShare * 100) / 100,
      shares_to_buy: sharesToBuy,
      total_capital_required: totalRequired,
      portfolio_allocation_pct: Math.round((totalRequired / capital) * 1000) / 10,
      max_risk_inr: actualRiskInr,
      risk_on_capital_pct: Math.round((actualRiskInr / capital) * 1000) / 10,
      potential_profit_target_1: profitT1,
      potential_profit_target_2: profitT2,
      risk_reward_t1: target1 ? Math.round(((target1 - entryPrice) / riskPerShare) * 10) / 10 : 2.0,
      risk_reward_t2: target2 ? Math.round(((target2 - entryPrice) / riskPerShare) * 10) / 10 : 3.2,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: 640,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'var(--bg-surface)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(96, 165, 250, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calculator size={20} color="#60A5FA" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Position Sizing & Risk Calculator (INR ₹)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {initialStock ? `Calculating for ${initialStock.stock_meta.code}` : 'Enforce strict 1-2% portfolio risk management'}
            </p>
          </div>
        </div>

        {/* Total Trading Capital Input */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Total Trading Capital (₹)
          </label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value) || 0)}
            className="mono"
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          />

          {/* Quick Capital Preset Buttons */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {PRESET_CAPITALS.map((amt) => (
              <button
                key={amt}
                onClick={() => setCapital(amt)}
                style={{
                  background: capital === amt ? '#4F46E5' : 'var(--bg-surface)',
                  color: capital === amt ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ₹{(amt / 100000).toFixed(amt >= 100000 ? 1 : 2)}L
              </button>
            ))}
          </div>
        </div>

        {/* Risk Percentage Slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Max Risk per Trade (% of Capital)
            </label>
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60A5FA' }}>
              {riskPct}% (₹{Math.round(capital * (riskPct / 100)).toLocaleString('en-IN')})
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.25"
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4F46E5' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>0.5% (Very Conservative)</span>
            <span>1.0% (Minervini Standard)</span>
            <span>2.0% (Aggressive)</span>
          </div>
        </div>

        {/* Price Inputs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Entry Price (₹)
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value) || 0)}
              className="mono"
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--rose)', display: 'block', marginBottom: 4 }}>
              Stop-Loss Price (₹)
            </label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value) || 0)}
              className="mono"
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-rose)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'var(--rose)',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid var(--border-rose)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--rose)',
            fontSize: '0.8rem',
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Calculated Results Banner */}
        {calcResult && (
          <div style={{
            background: 'rgba(11, 15, 25, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
              {/* Shares to Buy */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#A5B4FC', display: 'block' }}>
                  RECOMMENDED ORDER SIZE
                </span>
                <span className="mono" style={{ fontWeight: 800, fontSize: '1.6rem', color: '#FFFFFF', display: 'block' }}>
                  {calcResult.shares_to_buy} Shares
                </span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Total Capital: ₹{calcResult.total_capital_required.toLocaleString('en-IN')} ({calcResult.portfolio_allocation_pct}% of portfolio)
                </span>
              </div>

              {/* Exact Maximum Loss */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid var(--border-rose)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--rose)', display: 'block' }}>
                  MAXIMUM CAPITAL AT RISK (SL HIT)
                </span>
                <span className="mono" style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--rose)', display: 'block' }}>
                  ₹{calcResult.max_risk_inr.toLocaleString('en-IN')}
                </span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Exactly {calcResult.risk_on_capital_pct}% of your ₹{capital.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Target 1 and Target 2 Profit Forecast */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Target 1 Profit (+{Math.round(((target1 - entryPrice) / entryPrice) * 100)}%)
                </span>
                <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: 'var(--emerald)' }}>
                  +₹{calcResult.potential_profit_target_1?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Risk/Reward: 1:{calcResult.risk_reward_t1}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Target 2 Profit (+{Math.round(((target2 - entryPrice) / entryPrice) * 100)}%)
                </span>
                <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: 'var(--emerald)' }}>
                  +₹{calcResult.potential_profit_target_2?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Risk/Reward: 1:{calcResult.risk_reward_t2}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Protection Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}>
          <ShieldCheck size={16} color="var(--emerald)" />
          <span>
            Capital Protection Rule: Never risk more than 1.5% of your total account on any single trade setup.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
