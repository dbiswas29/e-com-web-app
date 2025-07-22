@echo off
:: E-Commerce Application Setup Script for Windows
echo 🚀 Setting up E-Commerce Application...

:: Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

:: Install root dependencies
echo 📦 Installing root dependencies...
call npm install

:: Setup Frontend
echo 🎨 Setting up Frontend (Next.js)...
cd frontend
call npm install
cd ..

:: Setup Backend
echo ⚡ Setting up Backend (NestJS)...
cd backend
call npm install

:: Generate Prisma client and setup database
echo 🗃️ Setting up database...
call npx prisma generate
call npx prisma db push

:: Seed the database
echo 🌱 Seeding database with sample data...
call npm run db:seed

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Copy .env.example to .env and update with your configuration
echo 2. Start the development servers:
echo    npm run dev
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001/api
echo    API Documentation: http://localhost:3001/api/docs
echo.
echo 📚 Commands:
echo    npm run dev          - Start both frontend and backend
echo    npm run build        - Build both applications
echo    npm run test         - Run tests
echo    npm run lint         - Run linting
echo.
echo Happy coding! 🎯
pause
