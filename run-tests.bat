@echo off
echo 🧪 E-Commerce Web App Test Suite
echo =================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    exit /b 1
)

echo [INFO] Installing dependencies...

REM Install frontend dependencies
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)
echo [INFO] Frontend dependencies installed successfully

REM Install backend dependencies
cd ..\backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
echo [INFO] Backend dependencies installed successfully

cd ..

echo [INFO] Setting up database...

REM Setup database
cd backend
call npm run db:generate
call npm run db:push
call npm run db:seed

if %ERRORLEVEL% neq 0 (
    echo [WARNING] Database setup failed, but continuing with tests...
)
echo [INFO] Database setup completed

cd ..

REM Test counters
set /a total_tests=0
set /a passed_tests=0

echo [INFO] Starting test execution...

REM Backend Unit Tests
set /a total_tests+=1
echo [INFO] Running Backend Unit Tests...
cd backend
call npm run test
if %ERRORLEVEL% equ 0 (
    echo [INFO] Backend Unit Tests passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Backend Unit Tests failed ❌
)
cd ..

REM Backend E2E Tests
set /a total_tests+=1
echo [INFO] Running Backend E2E Tests...
cd backend
call npm run test:e2e
if %ERRORLEVEL% equ 0 (
    echo [INFO] Backend E2E Tests passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Backend E2E Tests failed ❌
)
cd ..

REM Backend Test Coverage
set /a total_tests+=1
echo [INFO] Running Backend Test Coverage...
cd backend
call npm run test:cov
if %ERRORLEVEL% equ 0 (
    echo [INFO] Backend Test Coverage passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Backend Test Coverage failed ❌
)
cd ..

REM Frontend Unit Tests
set /a total_tests+=1
echo [INFO] Running Frontend Unit Tests...
cd frontend
call npm run test -- --watchAll=false
if %ERRORLEVEL% equ 0 (
    echo [INFO] Frontend Unit Tests passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Frontend Unit Tests failed ❌
)
cd ..

REM Frontend Test Coverage
set /a total_tests+=1
echo [INFO] Running Frontend Test Coverage...
cd frontend
call npm run test:coverage -- --watchAll=false
if %ERRORLEVEL% equ 0 (
    echo [INFO] Frontend Test Coverage passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Frontend Test Coverage failed ❌
)
cd ..

REM Start servers for E2E tests
echo [INFO] Starting servers for E2E tests...

REM Start backend server
cd backend
start /b npm run start:dev > backend.log 2>&1
cd ..

REM Start frontend server
cd frontend
start /b npm run dev > frontend.log 2>&1
cd ..

REM Wait for servers to start
echo [INFO] Waiting for servers to start...
timeout /t 30 /nobreak > nul

REM Frontend E2E Tests
set /a total_tests+=1
echo [INFO] Running Frontend E2E Tests...
cd frontend
call npm run test:e2e
if %ERRORLEVEL% equ 0 (
    echo [INFO] Frontend E2E Tests passed ✅
    set /a passed_tests+=1
) else (
    echo [ERROR] Frontend E2E Tests failed ❌
)
cd ..

REM Cleanup: Kill servers
echo [INFO] Cleaning up servers...
taskkill /f /im node.exe > nul 2>&1

REM Test Results Summary
echo.
echo 🏁 Test Results Summary
echo =======================
echo Total test suites: %total_tests%
echo Passed: %passed_tests%
set /a failed_tests=%total_tests%-%passed_tests%
echo Failed: %failed_tests%

if %passed_tests% equ %total_tests% (
    echo [INFO] All tests passed! 🎉
    exit /b 0
) else (
    echo [ERROR] Some tests failed. Check the logs above for details.
    exit /b 1
)
