"""
Curated universe of liquid Indian stocks (NSE) across Nifty 50, Next 50, and top momentum midcaps.
Each entry contains ticker (.NS for yfinance), clean symbol, name, and sector.
"""

from typing import List, Dict

NSE_UNIVERSE: List[Dict[str, str]] = [
    # Top Nifty 50 & Heavyweights
    {"symbol": "RELIANCE.NS", "code": "RELIANCE", "name": "Reliance Industries Ltd", "sector": "Energy & Conglomerate"},
    {"symbol": "TCS.NS", "code": "TCS", "name": "Tata Consultancy Services", "sector": "IT Services"},
    {"symbol": "HDFCBANK.NS", "code": "HDFCBANK", "name": "HDFC Bank Ltd", "sector": "Banking & Financials"},
    {"symbol": "ICICIBANK.NS", "code": "ICICIBANK", "name": "ICICI Bank Ltd", "sector": "Banking & Financials"},
    {"symbol": "INFY.NS", "code": "INFY", "name": "Infosys Ltd", "sector": "IT Services"},
    {"symbol": "BHARTIARTL.NS", "code": "BHARTIARTL", "name": "Bharti Airtel Ltd", "sector": "Telecom"},
    {"symbol": "LT.NS", "code": "LT", "name": "Larsen & Toubro Ltd", "sector": "Capital Goods & Infra"},
    {"symbol": "SBIN.NS", "code": "SBIN", "name": "State Bank of India", "sector": "PSU Banking"},
    {"symbol": "EICHERMOT.NS", "code": "EICHERMOT", "name": "Eicher Motors Ltd", "sector": "Automobile"},
    {"symbol": "M&M.NS", "code": "M&M", "name": "Mahindra & Mahindra Ltd", "sector": "Automobile"},
    {"symbol": "BAJFINANCE.NS", "code": "BAJFINANCE", "name": "Bajaj Finance Ltd", "sector": "NBFC"},
    {"symbol": "TITAN.NS", "code": "TITAN", "name": "Titan Company Ltd", "sector": "Consumer Goods"},
    {"symbol": "SUNPHARMA.NS", "code": "SUNPHARMA", "name": "Sun Pharmaceutical Industries", "sector": "Pharmaceuticals"},
    {"symbol": "NTPC.NS", "code": "NTPC", "name": "NTPC Ltd", "sector": "Power & Energy"},
    {"symbol": "POWERGRID.NS", "code": "POWERGRID", "name": "Power Grid Corp of India", "sector": "Power & Utilities"},
    {"symbol": "MARUTI.NS", "code": "MARUTI", "name": "Maruti Suzuki India", "sector": "Automobile"},
    {"symbol": "COALINDIA.NS", "code": "COALINDIA", "name": "Coal India Ltd", "sector": "Mining & Minerals"},

    # High Momentum & Sector Leaders (Next 50 / Midcap 150 High-Beta)
    {"symbol": "TRENT.NS", "code": "TRENT", "name": "Trent Ltd (Westside/Zudio)", "sector": "Retail / Consumption"},
    {"symbol": "DIXON.NS", "code": "DIXON", "name": "Dixon Technologies India", "sector": "Electronics Manufacturing / EMS"},
    {"symbol": "POLYCAB.NS", "code": "POLYCAB", "name": "Polycab India Ltd", "sector": "Cables & Electricals"},
    {"symbol": "BEL.NS", "code": "BEL", "name": "Bharat Electronics Ltd", "sector": "Defence & Aerospace"},
    {"symbol": "HAL.NS", "code": "HAL", "name": "Hindustan Aeronautics Ltd", "sector": "Defence & Aerospace"},
    {"symbol": "MAZDOCK.NS", "code": "MAZDOCK", "name": "Mazagon Dock Shipbuilders", "sector": "Defence & Shipyards"},
    {"symbol": "PERSISTENT.NS", "code": "PERSISTENT", "name": "Persistent Systems Ltd", "sector": "IT & Software"},
    {"symbol": "COFORGE.NS", "code": "COFORGE", "name": "Coforge Ltd", "sector": "IT & Software"},
    {"symbol": "KAYNES.NS", "code": "KAYNES", "name": "Kaynes Technology India", "sector": "Electronics & EMS"},
    {"symbol": "SOLARINDS.NS", "code": "SOLARINDS", "name": "Solar Industries India", "sector": "Defence & Explosives"},
    {"symbol": "TATAPOWER.NS", "code": "TATAPOWER", "name": "Tata Power Company Ltd", "sector": "Renewables & Power"},
    {"symbol": "SUZLON.NS", "code": "SUZLON", "name": "Suzlon Energy Ltd", "sector": "Renewable Wind Energy"},
    {"symbol": "BSE.NS", "code": "BSE", "name": "BSE Ltd", "sector": "Capital Markets"},
    {"symbol": "CDSL.NS", "code": "CDSL", "name": "Central Depository Services", "sector": "Capital Markets"},
    {"symbol": "ANGELONE.NS", "code": "ANGELONE", "name": "Angel One Ltd", "sector": "Capital Markets & Fintech"},
    {"symbol": "INDHOTEL.NS", "code": "INDHOTEL", "name": "The Indian Hotels Co Ltd (Taj)", "sector": "Hospitality & Tourism"},
    {"symbol": "TITAGARH.NS", "code": "TITAGARH", "name": "Titagarh Rail Systems Ltd", "sector": "Railways & Defence"},
    {"symbol": "CUMMINSIND.NS", "code": "CUMMINSIND", "name": "Cummins India Ltd", "sector": "Capital Goods & Machinery"},
    {"symbol": "ABB.NS", "code": "ABB", "name": "ABB India Ltd", "sector": "Capital Goods & Robotics"},
    {"symbol": "SIEMENS.NS", "code": "SIEMENS", "name": "Siemens Ltd", "sector": "Capital Goods & Automation"},
    {"symbol": "CHOLAFIN.NS", "code": "CHOLAFIN", "name": "Cholamandalam Investment", "sector": "NBFC & Vehicle Finance"},
    {"symbol": "VOLTAS.NS", "code": "VOLTAS", "name": "Voltas Ltd", "sector": "Consumer Durables"},
    {"symbol": "FEDERALBNK.NS", "code": "FEDERALBNK", "name": "The Federal Bank Ltd", "sector": "Banking & Financials"},
    {"symbol": "PRESTIGE.NS", "code": "PRESTIGE", "name": "Prestige Estates Projects", "sector": "Real Estate"},
    {"symbol": "OBEROIRLTY.NS", "code": "OBEROIRLTY", "name": "Oberoi Realty Ltd", "sector": "Real Estate"},
    {"symbol": "LICI.NS", "code": "LICI", "name": "Life Insurance Corp of India", "sector": "Insurance"},
]

def get_universe_symbols() -> List[str]:
    """Returns list of all yfinance ticker symbols in the universe."""
    return [item["symbol"] for item in NSE_UNIVERSE]

def get_stock_meta(symbol: str) -> Dict[str, str]:
    """Returns metadata for a given symbol, or fallback default."""
    for item in NSE_UNIVERSE:
        if item["symbol"] == symbol or item["code"] == symbol:
            return item
    clean_code = symbol.replace(".NS", "").replace(".BO", "")
    return {
        "symbol": symbol,
        "code": clean_code,
        "name": clean_code,
        "sector": "Indian Equities"
    }
