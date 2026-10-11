import React from 'react';
import type { StockRecommendation } from '../types';
import { Sparkles, ExternalLink, Calculator, ChevronRight } from 'lucide-react';

interface StockCardProps {
  stock: StockRecommendation;
  onOpenDetails: (stock: StockRecommendation) => void;
  onOpenCalculator: (stock: StockRecommendation) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onOpenDetails,
  onOpenCalculator,
}) => {
  const { stock_meta, technicals, setup_name, news, ai_evaluation } = stock;
  const isPositiveDay = technicals.day_change_pct >= 0;

  const convictionColor = 
    ai_evaluation.conviction_score >= 80 ? 'var(--emerald)' :
    ai_evaluation.conviction_score >= 65 ? 'var(--amber)' : 'var(--rose)';

  const verdictBg = 
    ai_evaluation.verdict === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' :
    ai_evaluation.verdict === 'CAUTION' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  const verdictColor = 
    ai_evaluation.verdict === 'APPROVED' ? 'var(--emerald)' :
    ai_evaluation.verdict === 'CAUTION' ? 'var(--amber)' : 'var(--rose)';

  // Calculate visual Risk-Reward bar ratio
  const riskWeight = technicals.risk_pct;
  const rewardWeight = technicals.target_1_pct;
  const totalWeight = riskWeight + rewardWeight;
  const riskBarPct = Math.round((riskWeight / totalWeight) * 100);
  const rewardBarPct = 100 - riskBarPct;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: 16,
      transition: 'all 0.25s ease',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Top Bar: Symbol, Name, Sector, Setup & Conviction */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '1.3rem',
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}>
              {stock_meta.code}
            </span>
            <span style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
            }}>
              NSE
            </span>
            <span style={{
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#A5B4FC',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}>
              {stock_meta.sector}
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--emerald)',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}>
              {setup_name}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {stock_meta.name}
          </p>
        </div>

        {/* AI Conviction Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--bg-surface)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
              {ai_evaluation.ai_powered ? 'AI Conviction' : 'Quant Score'}
            </span>
            <span className="mono" style={{ fontWeight: 800, fontSize: '1rem', color: convictionColor }}>
              {ai_evaluation.conviction_score}/100
            </span>
          </div>
          <span style={{
            background: verdictBg,
            color: verdictColor,
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
          }}>
            {ai_evaluation.verdict}
          </span>
        </div>
      </div>

      {/* Main Pricing Matrix (Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 12,
        background: 'rgba(11, 15, 25, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        marginBottom: 16,
      }}>
        {/* CMP */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            CURRENT PRICE (CMP)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
            <span className="mono" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
              ₹{technicals.current_price.toLocaleString('en-IN')}
            </span>
            <span className="mono" style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: isPositiveDay ? 'var(--emerald)' : 'var(--rose)',
            }}>
              {isPositiveDay ? '+' : ''}{technicals.day_change_pct}%
            </span>
          </div>
        </div>

        {/* Recommended Entry Range */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            RECOMMENDED ENTRY
          </span>
          <span className="mono" style={{ fontWeight: 700, fontSize: '0.98rem', color: '#60A5FA', display: 'block', marginTop: 2 }}>
            ₹{technicals.entry_price} - ₹{technicals.entry_range_high}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pivot Breakout Zone</span>
        </div>

        {/* Stop-Loss */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            STOP-LOSS (STRICT)
          </span>
          <span className="mono" style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--rose)', display: 'block', marginTop: 2 }}>
            ₹{technicals.stop_loss}
          </span>
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--rose)' }}>
            -{technicals.risk_pct}% Risk
          </span>
        </div>

        {/* Target 1 */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            TARGET 1 (1:2 R:R)
          </span>
          <span className="mono" style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--emerald)', display: 'block', marginTop: 2 }}>
            ₹{technicals.target_1}
          </span>
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--emerald)' }}>
            +{technicals.target_1_pct}% (50% profit book)
          </span>
        </div>

        {/* Target 2 */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            TARGET 2 (1:3+ R:R)
          </span>
          <span className="mono" style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--emerald)', display: 'block', marginTop: 2 }}>
            ₹{technicals.target_2}
          </span>
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--emerald)' }}>
            +{technicals.target_2_pct}% (Trail SL)
          </span>
        </div>
      </div>

      {/* Visual Risk-to-Reward Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--rose)' }}>
            Downside Risk: ₹{technicals.risk_rupees} ({technicals.risk_pct}%)
          </span>
          <span className="mono" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            Risk-to-Reward Ratio: 1:{technicals.risk_reward_ratio}
          </span>
          <span style={{ color: 'var(--emerald)' }}>
            Target 1 Reward: +{technicals.target_1_pct}%
          </span>
        </div>
        <div style={{
          height: 6,
          width: '100%',
          background: 'var(--bg-surface)',
          borderRadius: 3,
          display: 'flex',
          overflow: 'hidden',
        }}>
          <div style={{ width: `${riskBarPct}%`, background: 'var(--rose)' }} title="Risk" />
          <div style={{ width: `${rewardBarPct}%`, background: 'var(--emerald)' }} title="Reward" />
        </div>
      </div>

      {/* AI Risk Officer Catalyst Note */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        borderLeft: `3px solid ${verdictColor}`,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Sparkles size={14} color="#818CF8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC' }}>
            {ai_evaluation.ai_powered ? 'AI Risk Officer Thesis' : 'Quantitative Momentum Thesis'}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {ai_evaluation.bull_thesis[0] || 'Strong relative strength vs Nifty 50 with healthy volume expansion.'}
        </p>
      </div>

      {/* Real-time Scraped News Snippet */}
      {news && news.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          marginBottom: 16,
          fontSize: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <span style={{
              background: 'var(--bg-card)',
              color: 'var(--text-muted)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.68rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {news[0].source}
            </span>
            <span style={{
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 480,
            }}>
              {news[0].title}
            </span>
          </div>

          {news[0].link && (
            <a
              href={news[0].link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#818CF8', display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', marginLeft: 8 }}
            >
              <span>Read</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>RS Score: <strong className="mono" style={{ color: 'var(--text-primary)' }}>{technicals.rs_score}</strong></span>
          <span>•</span>
          <span>RSI: <strong className="mono" style={{ color: 'var(--text-primary)' }}>{technicals.rsi}</strong></span>
          <span>•</span>
          <span>Avg Turnover: <strong className="mono" style={{ color: 'var(--text-primary)' }}>₹{technicals.avg_turnover_cr} Cr</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => onOpenCalculator(stock)}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
            }}
          >
            <Calculator size={14} color="#60A5FA" />
            <span>₹ Size Shares</span>
          </button>

          <button
            onClick={() => onOpenDetails(stock)}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
            }}
          >
            <span>Full Thesis</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
