#!/bin/bash

echo "🧪 E-Commerce Web App Test Suite"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Installing dependencies..."

# Install frontend dependencies
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
cd ../backend
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

print_status "Setting up database..."

# Setup database
cd backend
npm run db:generate
npm run db:push
npm run db:seed

if [ $? -eq 0 ]; then
    print_status "Database setup completed"
else
    print_warning "Database setup failed, but continuing with tests..."
fi

cd ..

# Function to run tests with timeout
run_test_with_timeout() {
    local cmd="$1"
    local timeout="$2"
    local description="$3"
    
    print_status "Running $description..."
    
    timeout $timeout bash -c "$cmd"
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        print_status "$description passed ✅"
        return 0
    elif [ $exit_code -eq 124 ]; then
        print_warning "$description timed out after ${timeout}s ⏰"
        return 1
    else
        print_error "$description failed ❌"
        return 1
    fi
}

# Test counters
total_tests=0
passed_tests=0

print_status "Starting test execution..."

# Backend Unit Tests
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd backend && npm run test" "120s" "Backend Unit Tests"; then
    passed_tests=$((passed_tests + 1))
fi

# Backend E2E Tests
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd backend && npm run test:e2e" "180s" "Backend E2E Tests"; then
    passed_tests=$((passed_tests + 1))
fi

# Backend Test Coverage
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd backend && npm run test:cov" "150s" "Backend Test Coverage"; then
    passed_tests=$((passed_tests + 1))
fi

# Frontend Unit Tests
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd frontend && npm run test -- --watchAll=false" "120s" "Frontend Unit Tests"; then
    passed_tests=$((passed_tests + 1))
fi

# Frontend Test Coverage
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd frontend && npm run test:coverage -- --watchAll=false" "150s" "Frontend Test Coverage"; then
    passed_tests=$((passed_tests + 1))
fi

# Start servers for E2E tests
print_status "Starting servers for E2E tests..."

# Start backend server
cd backend
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend server
cd frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for servers to start
print_status "Waiting for servers to start..."
sleep 30

# Check if servers are running
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_status "Backend server is running on port 3001"
else
    print_warning "Backend server may not be running properly"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "Frontend server is running on port 3000"
else
    print_warning "Frontend server may not be running properly"
fi

# Frontend E2E Tests
total_tests=$((total_tests + 1))
if run_test_with_timeout "cd frontend && npm run test:e2e" "300s" "Frontend E2E Tests"; then
    passed_tests=$((passed_tests + 1))
fi

# Cleanup: Kill servers
print_status "Cleaning up servers..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

# Wait a bit for graceful shutdown
sleep 5

# Force kill if still running
kill -9 $BACKEND_PID 2>/dev/null
kill -9 $FRONTEND_PID 2>/dev/null

# Test Results Summary
echo
echo "🏁 Test Results Summary"
echo "======================="
echo "Total test suites: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    print_status "All tests passed! 🎉"
    exit 0
else
    print_error "Some tests failed. Check the logs above for details."
    exit 1
fi
