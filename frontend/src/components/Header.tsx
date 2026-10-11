import React, { useState, useEffect } from 'react';
import type { MarketRegime } from '../types';
import { Calculator, Settings, TrendingUp, TrendingDown } from 'lucide-react';

interface HeaderProps {
  marketRegime?: MarketRegime;
  onOpenCalculator: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  marketRegime,
  onOpenCalculator,
  onOpenSettings,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setIstTime(istString);

      // NSE Trading Hours: Mon-Fri 09:15 to 15:30 IST
      const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const day = istDate.getDay();
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && currentMinutes >= (9 * 60 + 15) && currentMinutes <= (15 * 60 + 30);
      setIsMarketOpen(isOpen);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const regimeColor = marketRegime?.color || 'amber';
  const badgeBorderColor = 
    regimeColor === 'emerald' ? 'var(--border-emerald)' :
    regimeColor === 'rose' ? 'var(--border-rose)' : 'rgba(245, 158, 11, 0.3)';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 25, 0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '14px 24px',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}>
            <TrendingUp size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
                ALPHA TRADER
              </span>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                letterSpacing: '0.05em'
              }}>
                NSE INDIA
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Minervini SEPA • CAN SLIM • Stage 2 • AI Catalyst Gate
            </p>
          </div>
        </div>

        {/* Live Nifty & Market Health */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {marketRegime && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--bg-card)',
              border: `1px solid ${badgeBorderColor}`,
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  NIFTY 50 INDEX
                </span>
                <span className="mono" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  ₹{marketRegime.current_price?.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: marketRegime.change_percent >= 0 ? 'var(--emerald)' : 'var(--rose)',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}>
                {marketRegime.change_percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="mono">
                  {marketRegime.change_percent >= 0 ? '+' : ''}{marketRegime.change_percent}%
                </span>
              </div>

              <div style={{
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: 10,
                marginLeft: 2,
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: regimeColor === 'emerald' ? 'var(--emerald)' : regimeColor === 'rose' ? 'var(--rose)' : 'var(--amber)',
                }}>
                  {marketRegime.status_badge}
                </span>
              </div>
            </div>
          )}

          {/* Market Clock & Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-surface)',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isMarketOpen ? 'var(--emerald)' : 'var(--text-muted)',
              boxShadow: isMarketOpen ? '0 0 8px var(--emerald)' : 'none',
            }} className={isMarketOpen ? 'animate-pulse-dot' : ''} />
            <span style={{ color: isMarketOpen ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
              {isMarketOpen ? 'NSE Live' : 'Market Closed'}
            </span>
            <span className="mono" style={{ color: 'var(--text-secondary)', marginLeft: 4 }}>
              {istTime} IST
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onOpenCalculator}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
              }}
              title="Calculate Rupee Position Size & Risk"
            >
              <Calculator size={16} color="#60A5FA" />
              <span>₹ Risk Calculator</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
              }}
              title="Configure Gemini API Key & Preferences"
            >
              <Settings size={16} color="var(--text-secondary)" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
