@echo off
echo Loan Update System Setup
echo =======================

echo Installing Node.js dependencies...
npm install

echo.
echo Setting up database...
node setup_database.js

echo.
echo Setup complete!
echo.
echo To start the server, run:
echo   npm start
echo.
<<<<<<< HEAD
echo Then open your browser to http://localhost:3001
=======
echo Then open your browser to http://localhost:3000
>>>>>>> 88ae652691d05537b708b91080f0b8b552195c48
echo.
echo Default login credentials:
echo   Username: gampaha_bank_01
echo   Password: password123
echo.
echo   Username: negombo_bank_01
echo   Password: password123
echo.
echo After login, you will be directed to the dashboard where you can view loan data
echo and enter new loan applications.
echo.
pause