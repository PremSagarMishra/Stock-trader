export interface StockMeta {
  symbol: string;
  code: string;
  name: string;
  sector: string;
}

export interface TrendCheck {
  rule: string;
  passed: boolean;
}

export interface VcpData {
  has_vcp: boolean;
  span1_pct?: number;
  span2_pct?: number;
  span3_pct?: number;
  vol_dried_up?: boolean;
  description: string;
}

export interface Technicals {
  current_price: number;
  day_change_pct: number;
  ema20: number;
  sma50: number;
  ema150: number;
  ema200: number;
  high_52w: number;
  low_52w: number;
  rsi: number;
  atr: number;
  volume_surge_ratio: number;
  avg_turnover_cr: number;
  rs_score: number;
  trend_template_passed: boolean;
  trend_template_score: number;
  trend_checks: TrendCheck[];
  vcp_data: VcpData;
  is_stage_2: boolean;
  
  // Exact Pricing Levels in INR (₹)
  entry_price: number;
  entry_range_high: number;
  stop_loss: number;
  risk_rupees: number;
  risk_pct: number;
  target_1: number;
  target_1_pct: number;
  target_2: number;
  target_2_pct: number;
  risk_reward_ratio: number;
}

export interface NewsItem {
  title: string;
  source: string;
  link: string;
  published_at: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface AiEvaluation {
  ai_powered: boolean;
  conviction_score: number;
  verdict: 'APPROVED' | 'CAUTION' | 'REJECTED';
  bull_thesis: string[];
  invalidation_risk: string[];
  suggested_action: string;
  error_note?: string;
}

export interface StockRecommendation {
  stock_meta: StockMeta;
  technicals: Technicals;
  pipeline_type: 'SHORT_TERM_SWING' | 'LONG_TERM_POSITIONAL';
  timeframe: string;
  setup_name: string;
  news: NewsItem[];
  ai_evaluation: AiEvaluation;
}

export interface MarketRegime {
  index_name: string;
  current_price: number;
  change_percent: number;
  ema20?: number;
  sma50?: number;
  ema200?: number;
  regime: string;
  status_badge: string;
  risk_multiplier: number;
  advisory: string;
  color: 'emerald' | 'amber' | 'rose';
}

export interface SummaryStats {
  total_universe_scanned: number;
  short_term_candidates_found: number;
  long_term_candidates_found: number;
  short_term_picks_presented: number;
  long_term_picks_presented: number;
  scan_duration_seconds: number;
}

export interface ScanResponse {
  scan_id: string;
  timestamp: string;
  market_regime: MarketRegime;
  short_term_picks: StockRecommendation[];
  long_term_picks: StockRecommendation[];
  summary_stats: SummaryStats;
}

export interface PositionSizeResult {
  capital_inr: number;
  entry_price: number;
  stop_loss: number;
  risk_per_share: number;
  shares_to_buy: number;
  total_capital_required: number;
  portfolio_allocation_pct: number;
  max_risk_inr: number;
  risk_on_capital_pct: number;
  potential_profit_target_1?: number;
  risk_reward_t1?: number;
  potential_profit_target_2?: number;
  risk_reward_t2?: number;
}
