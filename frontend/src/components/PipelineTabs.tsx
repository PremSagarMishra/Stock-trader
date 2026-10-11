import React from 'react';
import { Flame, Compass } from 'lucide-react';

interface PipelineTabsProps {
  activeTab: 'SHORT_TERM' | 'LONG_TERM';
  shortTermCount: number;
  longTermCount: number;
  onTabChange: (tab: 'SHORT_TERM' | 'LONG_TERM') => void;
}

export const PipelineTabs: React.FC<PipelineTabsProps> = ({
  activeTab,
  shortTermCount,
  longTermCount,
  onTabChange,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      marginBottom: 20,
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: 12,
    }}>
      {/* Short-Term Swing Tab */}
      <button
        onClick={() => onTabChange('SHORT_TERM')}
        style={{
          flex: 1,
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: activeTab === 'SHORT_TERM' ? 'var(--bg-card)' : 'transparent',
          border: activeTab === 'SHORT_TERM' ? '1px solid var(--border-emerald)' : '1px solid transparent',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'SHORT_TERM' ? '0 4px 15px rgba(16, 185, 129, 0.08)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={18} color={activeTab === 'SHORT_TERM' ? 'var(--emerald)' : 'var(--text-muted)'} />
            <span style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'SHORT_TERM' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}>
              Short-Term Swing Trading
            </span>
          </div>
          <span style={{
            background: activeTab === 'SHORT_TERM' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
            color: activeTab === 'SHORT_TERM' ? 'var(--emerald)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}>
            {shortTermCount} Setups
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Holding Period: 2–14 Days • Minervini VCP Pivots • Volume Surges • Strict 4-6% Stops
        </p>
      </button>

      {/* Long-Term Positional Tab */}
      <button
        onClick={() => onTabChange('LONG_TERM')}
        style={{
          flex: 1,
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: activeTab === 'LONG_TERM' ? 'var(--bg-card)' : 'transparent',
          border: activeTab === 'LONG_TERM' ? '1px solid var(--border-accent)' : '1px solid transparent',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s ease',
          boxShadow: activeTab === 'LONG_TERM' ? '0 4px 15px rgba(99, 102, 241, 0.08)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={18} color={activeTab === 'LONG_TERM' ? '#818CF8' : 'var(--text-muted)'} />
            <span style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'LONG_TERM' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}>
              Long-Term Positional Compounders
            </span>
          </div>
          <span style={{
            background: activeTab === 'LONG_TERM' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
            color: activeTab === 'LONG_TERM' ? '#818CF8' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}>
            {longTermCount} Setups
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Holding Period: 3–12 Months • Stan Weinstein Stage 2 • High Relative Strength (&gt;70)
        </p>
      </button>
    </div>
  );
};
