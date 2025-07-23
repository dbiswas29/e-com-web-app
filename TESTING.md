# Testing Documentation

This document provides comprehensive information about the testing setup for the E-Commerce Web Application.

## Overview

The testing strategy includes:
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and service interactions  
- **E2E Tests**: Test complete user workflows
- **Code Coverage**: Ensure adequate test coverage across the codebase

## Test Structure

```
├── backend/
│   ├── src/
│   │   └── **/*.spec.ts        # Unit tests
│   └── test/
│       └── **/*.e2e-spec.ts    # E2E tests
├── frontend/
│   ├── src/
│   │   └── **/__tests__/       # Unit tests
│   │   └── **/*.test.ts(x)     # Unit tests
│   └── e2e/
│       └── **/*.spec.ts        # E2E tests
└── run-tests.{sh|bat}          # Test execution scripts
```

## Backend Testing

### Technology Stack
- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **@nestjs/testing**: NestJS testing utilities

### Unit Tests
Located in `backend/src/**/*.spec.ts`

#### Products Service Tests
- Tests all product filtering logic
- Tests pagination and search functionality
- Mocks Prisma service interactions

#### Auth Service Tests  
- Tests user registration and login
- Tests password hashing and JWT generation
- Tests error handling for invalid inputs

#### Cart Service Tests
- Tests cart operations (add, remove, update)
- Tests cart calculations (totals, pricing)
- Tests user-specific cart isolation

### Integration/E2E Tests
Located in `backend/test/app.e2e-spec.ts`

#### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Product Endpoints
- `GET /products` - List products with filters
- `GET /products/:id` - Get single product
- `GET /products/category/:category` - Products by category

#### Cart Endpoints
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update/:itemId` - Update cart item
- `DELETE /cart/remove/:itemId` - Remove cart item

### Running Backend Tests

```bash
# Unit tests
cd backend
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov

# Watch mode
npm run test:watch
```

## Frontend Testing

### Technology Stack
- **Jest**: Testing framework
- **@testing-library/react**: React component testing
- **@testing-library/user-event**: User interaction simulation
- **Playwright**: E2E testing framework

### Unit Tests
Located in `frontend/src/**/__tests__/` and `frontend/src/**/*.test.ts(x)`

#### Store Tests
- **Cart Store**: Tests Zustand cart state management
- **Auth Store**: Tests authentication state management

#### Component Tests
- **ProductCard**: Tests product display and cart interactions
- **ProductFilters**: Tests filtering UI components
- **Cart Components**: Tests cart UI and functionality

### E2E Tests
Located in `frontend/e2e/*.spec.ts`

#### User Journeys
- **Homepage Navigation**: Test hero buttons and navigation
- **Product Browsing**: Test product listing and filtering
- **Authentication Flow**: Test login/register workflows
- **Cart Operations**: Test add to cart and cart management
- **Responsive Design**: Test mobile and tablet viewports

### Running Frontend Tests

```bash
# Unit tests
cd frontend
npm run test

# Coverage report
npm run test:coverage

# E2E tests (requires servers running)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## Test Coverage Goals

### Backend Coverage Targets
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 80%+
- **Statements**: 80%+

### Frontend Coverage Targets
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 80%+
- **Statements**: 80%+

## Running All Tests

### Automated Test Suite

Use the provided scripts to run all tests:

**Windows:**
```cmd
run-tests.bat
```

**Linux/Mac:**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Manual Test Execution

1. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend  
   cd ../backend && npm install
   ```

2. **Setup Database**
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Run Tests**
   ```bash
   # Backend tests
   cd backend
   npm run test
   npm run test:e2e
   npm run test:cov
   
   # Frontend tests
   cd ../frontend
   npm run test -- --watchAll=false
   npm run test:coverage -- --watchAll=false
   ```

4. **E2E Tests with Servers**
   ```bash
   # Terminal 1: Start backend
   cd backend && npm run start:dev
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   
   # Terminal 3: Run E2E tests
   cd frontend && npm run test:e2e
   ```

## Test Configuration

### Jest Configuration (Backend)
Located in `backend/package.json`:
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Jest Configuration (Frontend)
Located in `frontend/jest.config.js`:
- Uses Next.js Jest configuration
- Includes setup for mocking Next.js components
- Configures path aliases and coverage thresholds

### Playwright Configuration (Frontend)
Located in `frontend/playwright.config.ts`:
- Configures multiple browsers (Chrome, Firefox, Safari)
- Sets up mobile and tablet viewports
- Configures test reporters and screenshots

## Mock Strategy

### Backend Mocks
- **PrismaService**: Mocked for unit tests
- **JwtService**: Mocked for authentication tests
- **External APIs**: Mocked using Jest

### Frontend Mocks
- **API Client**: Mocked using Jest
- **Next.js Router**: Mocked in test setup
- **Zustand Stores**: Mocked for component tests
- **Toast Notifications**: Mocked to prevent side effects

## CI/CD Integration

### GitHub Actions (Example)
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: chmod +x run-tests.sh
      - run: ./run-tests.sh
```

## Test Data Management

### Backend Test Data
- Uses in-memory SQLite for testing
- Seeds test data before E2E tests
- Cleans database between test suites

### Frontend Test Data
- Uses mock data objects
- Maintains consistent test fixtures
- Avoids external dependencies

## Debugging Tests

### Backend
```bash
# Debug specific test
npm run test:debug -- --testNamePattern="ProductsService"

# Debug E2E tests
npm run test:e2e -- --detectOpenHandles
```

### Frontend
```bash
# Debug with verbose output
npm run test -- --verbose

# Debug specific component
npm run test -- ProductCard.test.tsx
```

### E2E Debugging
```bash
# Run with headed browser
npm run test:e2e -- --headed

# Debug mode
npm run test:e2e -- --debug
```

## Common Issues and Solutions

### Issue: Tests timeout
**Solution**: Increase timeout in test configuration or optimize test performance

### Issue: Database connection errors
**Solution**: Ensure test database is properly configured and accessible

### Issue: E2E tests fail to start servers
**Solution**: Check port availability and server startup logs

### Issue: Mock imports fail
**Solution**: Verify mock paths and Jest configuration

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests independent** and isolated
3. **Use descriptive test names** that explain the scenario
4. **Mock external dependencies** to avoid flaky tests
5. **Test edge cases** and error conditions
6. **Maintain high coverage** but focus on meaningful tests
7. **Clean up** test data and resources after tests
8. **Use page objects** for E2E tests to reduce duplication

## Reporting

Test results are automatically generated in multiple formats:
- **Console output**: Real-time test results
- **Coverage reports**: HTML and JSON formats
- **E2E reports**: Screenshots and videos for failures
- **JUnit XML**: For CI/CD integration

Coverage reports are available at:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

E2E test reports are available at:
- `frontend/test-results/`
- `frontend/playwright-report/`
