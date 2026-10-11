import type { ScanResponse, PositionSizeResult } from '../types';

export const getApiBaseUrl = (): string => {
  return localStorage.getItem('ALPHA_TRADER_API_URL') || 'http://localhost:8000';
};

export const getSavedGeminiKey = (): string => {
  return localStorage.getItem('ALPHA_TRADER_GEMINI_KEY') || '';
};

export const apiService = {
  async fetchLatestScan(): Promise<ScanResponse> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/scan/latest`);
    if (!res.ok) {
      throw new Error(`Failed to load scan data: ${res.statusText}`);
    }
    return res.json();
  },

  async triggerMarketScan(customApiKey?: string): Promise<ScanResponse> {
    const baseUrl = getApiBaseUrl();
    const apiKey = customApiKey !== undefined ? customApiKey : getSavedGeminiKey();
    
    const res = await fetch(`${baseUrl}/api/scan/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gemini_api_key: apiKey || null,
      }),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Scan trigger failed');
    }
    return res.json();
  },

  async calculatePositionSize(payload: {
    capital_inr: number;
    risk_percentage: number;
    entry_price: number;
    stop_loss: number;
    target_1?: number;
    target_2?: number;
  }): Promise<PositionSizeResult> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/calculator/position-size`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Position calculation failed');
    }
    return res.json();
  },

  async checkHealth(): Promise<any> {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/health`);
    if (!res.ok) throw new Error('Backend offline');
    return res.json();
  }
};
