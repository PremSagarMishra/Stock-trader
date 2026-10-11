"""
Storage module for scan history and caching.
Uses SQLite to store triggered scans and recommendations so user can review historical trades.
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "scans.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_records (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            market_regime TEXT NOT NULL,
            summary_stats TEXT NOT NULL,
            payload TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

def save_scan_result(scan_id: str, market_regime: Dict[str, Any], summary_stats: Dict[str, Any], full_payload: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO scan_records (id, timestamp, market_regime, summary_stats, payload)
        VALUES (?, ?, ?, ?, ?)
    """, (
        scan_id,
        datetime.now().isoformat(),
        json.dumps(market_regime),
        json.dumps(summary_stats),
        json.dumps(full_payload)
    ))
    conn.commit()
    conn.close()

def get_latest_scan() -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT payload FROM scan_records ORDER BY timestamp DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row[0])
    return None

def get_scan_history(limit: int = 10) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, market_regime, summary_stats FROM scan_records ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "timestamp": r[1],
            "market_regime": json.loads(r[2]),
            "summary_stats": json.loads(r[3])
        })
    return results
