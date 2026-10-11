import React from 'react';
import type { StockRecommendation } from '../types';
import { X, CheckCircle2, AlertCircle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface StockDetailModalProps {
  stock: StockRecommendation | null;
  onClose: () => void;
  onOpenCalculator: (stock: StockRecommendation) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  onOpenCalculator,
}) => {
  if (!stock) return null;

  const { stock_meta, technicals, setup_name, news, ai_evaluation, timeframe } = stock;

  const verdictColor = 
    ai_evaluation.verdict === 'APPROVED' ? 'var(--emerald)' :
    ai_evaluation.verdict === 'CAUTION' ? 'var(--amber)' : 'var(--rose)';

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
        maxWidth: 780,
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
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {stock_meta.code}
            </h2>
            <span style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
            }}>
              NSE INDIA
            </span>
            <span style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#A5B4FC',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              {stock_meta.sector}
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--emerald)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              {setup_name} ({timeframe})
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
            {stock_meta.name}
          </p>
        </div>

        {/* Pricing Matrix Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          background: 'rgba(11, 15, 25, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: 20,
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CMP</span>
            <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '1.05rem' }}>
              ₹{technicals.current_price.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ENTRY ZONE</span>
            <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: '#60A5FA' }}>
              ₹{technicals.entry_price} - ₹{technicals.entry_range_high}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STOP LOSS</span>
            <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--rose)' }}>
              ₹{technicals.stop_loss} (-{technicals.risk_pct}%)
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TARGET 1</span>
            <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald)' }}>
              ₹{technicals.target_1} (+{technicals.target_1_pct}%)
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TARGET 2</span>
            <span className="mono" style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald)' }}>
              ₹{technicals.target_2} (+{technicals.target_2_pct}%)
            </span>
          </div>
        </div>

        {/* AI Risk Officer Assessment */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          borderLeft: `4px solid ${verdictColor}`,
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#818CF8" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {ai_evaluation.ai_powered ? 'Gemini AI Risk Officer Synthesis' : 'Quantitative Momentum Evaluation'}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: verdictColor }}>
                Score: {ai_evaluation.conviction_score}/100
              </span>
              <span style={{
                background: verdictColor,
                color: '#0B0F19',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
              }}>
                {ai_evaluation.verdict}
              </span>
            </div>
          </div>

          {/* Action Callout */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 12,
            fontSize: '0.82rem',
            color: 'var(--text-primary)',
          }}>
            <strong>Recommended Action:</strong> {ai_evaluation.suggested_action}
          </div>

          {/* Bull Thesis */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)', display: 'block', marginBottom: 4 }}>
              WHY BUY NOW (BULL THESIS)
            </span>
            <ul style={{ paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {ai_evaluation.bull_thesis.map((point, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Invalidation Risks */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose)', display: 'block', marginBottom: 4 }}>
              TRADE INVALIDATION RISKS (EXIT CRITERIA)
            </span>
            <ul style={{ paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {ai_evaluation.invalidation_risk.map((risk, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Minervini Trend Template Checklist */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: 20,
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} color="var(--emerald)" />
            <span>Minervini 8-Point Trend Template ({technicals.trend_template_score}/8 Criteria Met)</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
            {technicals.trend_checks.map((c, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
                color: c.passed ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {c.passed ? (
                  <CheckCircle2 size={16} color="var(--emerald)" />
                ) : (
                  <AlertCircle size={16} color="var(--text-muted)" />
                )}
                <span>{c.rule}</span>
              </div>
            ))}
          </div>

          {technicals.vcp_data && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: 600, color: '#A5B4FC' }}>VCP Status: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{technicals.vcp_data.description}</span>
            </div>
          )}
        </div>

        {/* Live Scraped Indian News */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: 20,
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>
            Live Scraped Indian Financial News & Announcements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {news && news.length > 0 ? (
              news.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                }}>
                  <div>
                    <span style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      marginRight: 8,
                    }}>
                      {item.source}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#818CF8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginLeft: 12, whiteSpace: 'nowrap' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent news articles detected.</p>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenCalculator(stock);
            }}
            className="btn-primary"
            style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>Size Trade in ₹</span>
          </button>
        </div>
      </div>
    </div>
  );
};
