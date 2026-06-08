@echo off
REM Start backend and frontend servers

echo Starting PDF Page Counter Application...
echo.

REM Start backend
cd backend
echo Installing backend dependencies...
call npm install
echo.
echo Starting backend server on port 5000...
start cmd /k npm start
cd ..

REM Start frontend
timeout /t 3 /nobreak
cd frontend
echo Installing frontend dependencies...
call npm install
echo.
echo Starting frontend on port 3000...
start cmd /k npm start
cd ..

echo.
echo Both servers should be running now!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause
