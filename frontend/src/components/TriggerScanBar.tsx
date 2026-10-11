import React from 'react';
import { Play, RefreshCw, Zap, ShieldCheck, Database } from 'lucide-react';
import type { SummaryStats } from '../types';

interface TriggerScanBarProps {
  isScanning: boolean;
  scanStep: string;
  lastScanTimestamp?: string;
  summaryStats?: SummaryStats;
  onTriggerScan: () => void;
}

export const TriggerScanBar: React.FC<TriggerScanBarProps> = ({
  isScanning,
  scanStep,
  lastScanTimestamp,
  summaryStats,
  onTriggerScan,
}) => {
  const formattedTime = lastScanTimestamp
    ? new Date(lastScanTimestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      marginBottom: 24,
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient gradient glow */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Left: Headline & Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Zap size={18} color="#818CF8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Real-Time Market Alpha Screener
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Scans liquid NSE equities for Minervini VCP setups, Stage 2 volume breakouts, and scrapes live Indian news before AI validation.
          </p>
        </div>

        {/* Right: Trigger Button & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {formattedTime && (
            <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Last Triggered</span>
              <span className="mono" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {formattedTime} IST ({summaryStats?.scan_duration_seconds}s)
              </span>
            </div>
          )}

          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
            }}
          >
            {isScanning ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Scanning NSE Market...</span>
              </>
            ) : (
              <>
                <Play size={18} fill="#FFFFFF" />
                <span>Trigger Market Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scanning Progress Banner */}
      {isScanning && (
        <div style={{
          marginTop: 18,
          padding: '14px 16px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#A5B4FC',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>{scanStep || 'Executing dual-pipeline analysis...'}</span>
            </div>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live NSE Stream
            </span>
          </div>

          <div style={{
            height: 4,
            width: '100%',
            background: 'var(--bg-surface)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div className="shimmer-bar" style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      )}

      {/* Universe Coverage Pills */}
      {!isScanning && summaryStats && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Database size={14} color="var(--cyan)" />
            <span>Universe Scanned: <strong className="mono" style={{ color: 'var(--text-primary)' }}>{summaryStats.total_universe_scanned} stocks</strong></span>
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} color="var(--emerald)" />
            <span>Short-Term Qualified: <strong className="mono" style={{ color: 'var(--emerald)' }}>{summaryStats.short_term_candidates_found} setups</strong></span>
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#818CF8" />
            <span>Long-Term Stage 2: <strong className="mono" style={{ color: '#818CF8' }}>{summaryStats.long_term_candidates_found} compounders</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
