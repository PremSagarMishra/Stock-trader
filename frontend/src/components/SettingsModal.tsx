import React, { useState } from 'react';
import { X, Key, Server, Check, Info } from 'lucide-react';
import { getApiBaseUrl, getSavedGeminiKey } from '../services/api';

interface SettingsModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState<string>(getSavedGeminiKey());
  const [apiUrl, setApiUrl] = useState<string>(getApiBaseUrl());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    localStorage.setItem('ALPHA_TRADER_GEMINI_KEY', apiKey.trim());
    localStorage.setItem('ALPHA_TRADER_API_URL', apiUrl.trim() || 'http://localhost:8000');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 600);
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
        maxWidth: 520,
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

        {/* Modal Title */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>
          Terminal Settings
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          Manage your AI model keys and local or cloud API endpoints.
        </p>

        {/* Gemini API Key */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Key size={16} color="#818CF8" />
            <span>Google Gemini API Key (Optional)</span>
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
            marginTop: 6,
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              If left blank, the screener functions in 100% full quantitative mode using Minervini Trend, VCP, and ATR. If configured, Gemini 2.5 Flash analyzes live scraped Indian news to validate catalysts.
            </span>
          </div>
        </div>

        {/* Backend API URL */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Server size={16} color="#60A5FA" />
            <span>Backend Server API URL</span>
          </label>
          <input
            type="text"
            placeholder="http://localhost:8000"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
            }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
            Default: http://localhost:8000 (Change when deployed to cloud e.g. Render / Railway).
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{
              padding: '8px 22px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
