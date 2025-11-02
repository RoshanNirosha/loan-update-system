@echo off
echo Loan Update System Management Script
echo ----------------------------------
echo 1. Start application with PM2
echo 2. Stop application
echo 3. Restart application
echo 4. View application status
echo 5. View application logs
echo 6. Exit
echo.

choice /c 123456 /m "Select an option"

if errorlevel 6 goto exit
if errorlevel 5 goto logs
if errorlevel 4 goto status
if errorlevel 3 goto restart
if errorlevel 2 goto stop
if errorlevel 1 goto start

:start
pm2 start loan-update-system
goto end

:stop
pm2 stop loan-update-system
goto end

:restart
pm2 restart loan-update-system
goto end

:status
pm2 status
goto end

:logs
pm2 logs loan-update-system
goto end

:exit
echo Exiting...
goto end

:end
echo.
echo Press any key to continue...
pause >nul