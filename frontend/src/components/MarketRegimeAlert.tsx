import React from 'react';
import type { MarketRegime } from '../types';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface MarketRegimeAlertProps {
  regime?: MarketRegime;
}

export const MarketRegimeAlert: React.FC<MarketRegimeAlertProps> = ({ regime }) => {
  if (!regime) return null;

  const color = regime.color || 'amber';
  const borderColor = 
    color === 'emerald' ? 'var(--border-emerald)' :
    color === 'rose' ? 'var(--border-rose)' : 'rgba(245, 158, 11, 0.3)';
  const bgColor = 
    color === 'emerald' ? 'rgba(16, 185, 129, 0.08)' :
    color === 'rose' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(245, 158, 11, 0.08)';
  const textColor = 
    color === 'emerald' ? 'var(--emerald)' :
    color === 'rose' ? 'var(--rose)' : 'var(--amber)';

  const IconComponent = 
    color === 'emerald' ? CheckCircle :
    color === 'rose' ? ShieldAlert : AlertTriangle;

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '12px 18px',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <IconComponent size={20} color={textColor} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: textColor, letterSpacing: '0.02em' }}>
            MACRO MARKET DIRECTION (NIFTY 50): {regime.status_badge.toUpperCase()}
          </span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Level: ₹{regime.current_price?.toLocaleString('en-IN')} ({regime.change_percent >= 0 ? '+' : ''}{regime.change_percent}%)
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          {regime.advisory}
        </p>
      </div>
    </div>
  );
};
