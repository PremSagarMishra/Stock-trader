import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketRegimeAlert } from './components/MarketRegimeAlert';
import { TriggerScanBar } from './components/TriggerScanBar';
import { PipelineTabs } from './components/PipelineTabs';
import { StockCard } from './components/StockCard';
import { StockDetailModal } from './components/StockDetailModal';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { SettingsModal } from './components/SettingsModal';
import { apiService } from './services/api';
import type { ScanResponse, StockRecommendation } from './types';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [scanData, setScanData] = useState<ScanResponse | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'SHORT_TERM' | 'LONG_TERM'>('SHORT_TERM');
  const [selectedStockForDetails, setSelectedStockForDetails] = useState<StockRecommendation | null>(null);
  const [selectedStockForCalculator, setSelectedStockForCalculator] = useState<StockRecommendation | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingInitial(true);
    setError(null);
    try {
      const data = await apiService.fetchLatestScan();
      setScanData(data);
    } catch (err: any) {
      console.warn('Initial load warning:', err);
      setError(
        'Backend server is connecting. Click "Trigger Market Scan" once the backend server is active at http://localhost:8000.'
      );
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleTriggerScan = async () => {
    setIsScanning(true);
    setError(null);

    // Multi-phase step progression for transparent UX
    setScanStep('Step 1/4: Fetching live ticks from NSE & Nifty 50 (^NSEI)...');
    const timer1 = setTimeout(() => {
      setScanStep('Step 2/4: Screening Minervini VCP, 20 EMA, & Stage 2 Breakouts...');
    }, 2200);

    const timer2 = setTimeout(() => {
      setScanStep('Step 3/4: Scraping real-time Indian news (Moneycontrol & Economic Times)...');
    }, 4500);

    const timer3 = setTimeout(() => {
      setScanStep('Step 4/4: Gemini AI Risk Officer synthesizing catalyst scores...');
    }, 6800);

    try {
      const data = await apiService.triggerMarketScan();
      setScanData(data);
      // Auto-switch to tab that has picks
      if (data.short_term_picks.length === 0 && data.long_term_picks.length > 0) {
        setActiveTab('LONG_TERM');
      } else {
        setActiveTab('SHORT_TERM');
      }
    } catch (err: any) {
      setError(`Scan failed: ${err.message || 'Check if Python FastAPI server is running on port 8000.'}`);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsScanning(false);
      setScanStep('');
    }
  };

  const currentPicks = activeTab === 'SHORT_TERM' 
    ? (scanData?.short_term_picks || [])
    : (scanData?.long_term_picks || []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        marketRegime={scanData?.market_regime}
        onOpenCalculator={() => {
          setSelectedStockForCalculator(null);
          setIsCalculatorOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '24px 20px', flex: 1 }}>
        {/* Nifty 50 Macro Direction Alert */}
        {scanData?.market_regime && (
          <MarketRegimeAlert regime={scanData.market_regime} />
        )}

        {/* Error Banner */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid var(--border-rose)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            color: 'var(--rose)',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={handleTriggerScan}
              className="btn-secondary"
              style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap',
              }}
            >
              Trigger Now
            </button>
          </div>
        )}

        {/* Trigger Scan Bar */}
        <TriggerScanBar
          isScanning={isScanning}
          scanStep={scanStep}
          lastScanTimestamp={scanData?.timestamp}
          summaryStats={scanData?.summary_stats}
          onTriggerScan={handleTriggerScan}
        />

        {/* Pipeline Tabs (Short-Term Swing vs Long-Term Positional) */}
        <PipelineTabs
          activeTab={activeTab}
          shortTermCount={scanData?.short_term_picks.length || 0}
          longTermCount={scanData?.long_term_picks.length || 0}
          onTabChange={setActiveTab}
        />

        {/* Stock Picks List */}
        {loadingInitial ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <RefreshCw size={28} className="animate-spin" color="#818CF8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
              Connecting to NSE Live Market Radar...
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Preparing Nifty 500 universe and mathematical models.
            </p>
          </div>
        ) : currentPicks.length > 0 ? (
          <div>
            {currentPicks.map((stock) => (
              <StockCard
                key={stock.stock_meta.symbol}
                stock={stock}
                onOpenDetails={(s) => setSelectedStockForDetails(s)}
                onOpenCalculator={(s) => {
                  setSelectedStockForCalculator(s);
                  setIsCalculatorOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '70px 20px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <Layers size={36} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
              No Trade Setups in this Category Currently
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 20px' }}>
              The quant screener strictly enforces Minervini Trend, VCP, and minimum 1:2 Risk-to-Reward parameters to protect capital. 
              Click <strong>"Trigger Market Scan"</strong> to execute a fresh live scan of the entire NSE universe.
            </p>
            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
              }}
            >
              Scan Market Now
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.9)',
        padding: '16px 24px',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <span>AlphaTrader NSE v1.0 • Institutional Quantitative & AI Stock Engine</span>
          </div>
          <div>
            <span>Capital Protection Rule: Never risk more than 1–2% of total trading capital per trade.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedStockForDetails && (
        <StockDetailModal
          stock={selectedStockForDetails}
          onClose={() => setSelectedStockForDetails(null)}
          onOpenCalculator={(s) => {
            setSelectedStockForCalculator(s);
            setIsCalculatorOpen(true);
          }}
        />
      )}

      {isCalculatorOpen && (
        <RiskCalculatorModal
          initialStock={selectedStockForCalculator}
          onClose={() => setIsCalculatorOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSaved={() => handleTriggerScan()}
        />
      )}
    </div>
  );
}
