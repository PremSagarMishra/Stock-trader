@echo off
echo ========================================================
echo   Launching AlphaTrader NSE (Backend + Web Terminal)
echo ========================================================

start "AlphaTrader Backend (FastAPI)" cmd /k "cd backend && python main.py"
start "AlphaTrader Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:5173
echo.
