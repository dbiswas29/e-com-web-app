#!/bin/bash

# E-Commerce Application Setup Script
echo "🚀 Setting up E-Commerce Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup Frontend
echo "🎨 Setting up Frontend (Next.js)..."
cd frontend
npm install
cd ..

# Setup Backend
echo "⚡ Setting up Backend (NestJS)..."
cd backend
npm install

# Generate Prisma client and setup database
echo "🗃️ Setting up database..."
npx prisma generate
npx prisma db push

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and update with your configuration"
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Documentation: http://localhost:3001/api/docs"
echo ""
echo "📚 Commands:"
echo "   npm run dev          - Start both frontend and backend"
echo "   npm run build        - Build both applications"
echo "   npm run test         - Run tests"
echo "   npm run lint         - Run linting"
echo ""
echo "Happy coding! 🎯"
