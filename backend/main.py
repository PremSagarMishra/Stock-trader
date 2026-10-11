"""
Alpha Trader Indian Market Advisor - FastAPI Server
Trigger-based quantitative and AI stock selection engine for NSE/BSE.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

from api.routes import router as api_router

app = FastAPI(
    title="AlphaTrader NSE - Institutional Stock Selection API",
    description="Trigger-driven dual-pipeline stock trading engine for the Indian Market (NSE/BSE).",
    version="1.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev & production preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "app": "AlphaTrader Indian Market Advisory API",
        "market": "NSE / BSE India",
        "docs": "/docs",
        "endpoints": {
            "trigger_scan": "POST /api/scan/trigger",
            "latest_scan": "GET /api/scan/latest",
            "position_calculator": "POST /api/calculator/position-size",
            "health": "GET /api/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
