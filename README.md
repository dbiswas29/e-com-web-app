# E-Commerce Web Application

A modern, full-stack e-commerce web application built with Next.js (frontend) and NestJS (backend), following industry best practices for performance, accessibility, SEO, and security.

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: v22.17.0 (Required)
- **npm**: v10.9.2 (Required)
- **MongoDB Community Server**: v8.0.12 (Required)
- **MongoDB Compass**: For database GUI management (Recommended)
- **MongoDB Shell**: For command-line database operations (Required)

### MongoDB Setup
1. Install MongoDB Community Server 8.0.12
2. Install MongoDB Compass for visual database management
3. Install MongoDB Shell (mongosh)
4. Start MongoDB service:
   ```bash
   # On Windows (Command Prompt)
   mongosh
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

## 🎯 Project Overview

This is a comprehensive e-commerce platform that demonstrates modern web development practices with a clean architecture, comprehensive testing, and production-ready features.

## 🚀 Features

### Frontend (Next.js 14 with App Router)
- **🏠 Homepage**: Hero section with call-to-action, featured products showcase, category grid, and newsletter subscription
- **📱 Product Listing Page (PLP)**: 
  - Advanced filtering (category, price range, rating)
  - Sorting options (price, rating, newest)
  - Search functionality with real-time results
  - Responsive product grid with lazy loading
  - Pagination for large product sets
- **🔍 Product Detail Page (PDP)**: 
  - High-quality image gallery with zoom functionality
  - Detailed product information and specifications
  - Customer reviews and ratings
  - Related products suggestions
  - Add to cart with quantity selector
- **🛒 Shopping Cart**: 
  - Real-time cart updates
  - Quantity management with stock validation
  - Remove items functionality
  - Cart persistence across sessions
  - Total calculation with tax
- **👤 User Authentication**: 
  - Secure registration and login
  - Profile management
  - Order history
  - JWT-based authentication with refresh tokens
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **⚡ Performance**: Image optimization, lazy loading, code splitting
- **🔍 SEO Optimized**: Meta tags, structured data, sitemap generation
- **♿ Accessible**: WCAG 2.1 AA compliant with keyboard navigation

### Backend (NestJS)
- **🔐 Authentication & Authorization**:
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based access control
  - Refresh token mechanism
- **📦 Product Management**:
  - CRUD operations for products
  - Category-based filtering
  - Search with text indexing
  - Image upload and management
  - Stock management
- **🛒 Cart & Order Management**:
  - User-specific cart operations
  - Order creation and tracking
  - Inventory management
  - Order history
- **👥 User Management**:
  - User registration and profile
  - Role-based permissions
  - User preferences
- **🗄️ Database**: MongoDB with Mongoose ODM
- **✅ Validation**: Comprehensive input validation and sanitization
- **🔒 Security**: CORS, rate limiting, helmet, SQL injection protection
- **📚 Documentation**: Swagger/OpenAPI documentation
- **🧪 Testing**: Comprehensive unit and integration tests

## 🛠️ Tech Stack

### Frontend Technologies
- **⚛️ Framework**: Next.js 14 (App Router) - React framework with server-side rendering
- **📝 Language**: TypeScript - Type-safe JavaScript
- **🎨 Styling**: Tailwind CSS - Utility-first CSS framework
- **🔧 State Management**: Zustand - Lightweight state management
- **🖥️ UI Components**: 
  - Headless UI - Unstyled, accessible UI components
  - Heroicons - Beautiful hand-crafted SVG icons
- **📋 Forms**: 
  - React Hook Form - Performant forms with easy validation
  - Zod - TypeScript-first schema validation
- **🌐 HTTP Client**: Axios - Promise-based HTTP client
- **🧪 Testing**: 
  - Jest - JavaScript testing framework
  - React Testing Library - Simple and complete testing utilities
  - Playwright - End-to-end testing
- **📦 Build Tools**: 
  - ESLint - Code linting
  - Prettier - Code formatting

### Backend Technologies
- **🏗️ Framework**: NestJS - Progressive Node.js framework
- **📝 Language**: TypeScript - Type-safe JavaScript
- **🗄️ Database**: 
  - MongoDB - NoSQL document database
  - Mongoose - MongoDB object modeling for Node.js
- **🔐 Authentication**: 
  - JWT - JSON Web Tokens
  - Passport - Authentication middleware
  - bcrypt - Password hashing
- **✅ Validation**: 
  - Class Validator - Decorator-based validation
  - Class Transformer - Object transformation
- **📚 Documentation**: 
  - Swagger - API documentation
  - OpenAPI - API specification
- **🧪 Testing**: 
  - Jest - JavaScript testing framework
  - Supertest - HTTP assertions
- **⚙️ Development**: 
  - Nodemon - Auto-restart on file changes
  - ESLint - Code linting
  - Prettier - Code formatting

### DevOps & Tools
- **📦 Package Manager**: npm v10.9.2
- **🔄 Process Management**: Concurrently - Run multiple commands
- **🐳 Containerization**: Docker (ready for deployment)
- **🔧 Environment**: Node.js v22.17.0
- **📊 Database GUI**: MongoDB Compass
- **🖥️ Database CLI**: MongoDB Shell (mongosh)

## 📦 Installation & Setup

### Quick Start (Automated)
```bash
# Clone the repository
git clone https://github.com/dbiswas29/e-com-web-app.git
cd e-com-web-app

# Run setup script (Windows)
setup.bat

# Or manual installation (All platforms)
npm install
```

### Manual Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dbiswas29/e-com-web-app.git
   cd e-com-web-app
   ```

2. **Install Root Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

5. **Environment Configuration**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cd frontend && cp .env.example .env.local && cd ..
   cd backend && cp .env.example .env && cd ..
   
   # Edit environment files with your configuration
   # See Environment Configuration section above
   ```

6. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   mongosh
   
   # Seed the database with sample data
   cd backend
   npm run seed
   cd ..
   ```

7. **Verify Installation**
   ```bash
   # Run development servers
   npm run dev
   
   # Check frontend: http://localhost:3000
   # Check backend: http://localhost:3001
   # Check API docs: http://localhost:3001/api/docs
   ```

## 🚀 Development

### Development Commands

#### Start All Services
```bash
# Start both frontend and backend concurrently
npm run dev

# Frontend will be available at: http://localhost:3000
# Backend will be available at: http://localhost:3001
```

#### Start Services Individually
```bash
# Frontend only (Next.js dev server)
npm run dev:frontend
# or
cd frontend && npm run dev

# Backend only (NestJS dev server)
npm run dev:backend
# or
cd backend && npm run start:dev
```

#### Other Development Commands
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:frontend
npm run lint:backend

# Database operations
cd backend
npm run seed          # Seed database with sample data
npm run seed:clear    # Clear database
```

### Development Workflow
1. **Start Development Servers**: `npm run dev`
2. **Make Changes**: Edit files in `frontend/` or `backend/`
3. **Auto-Reload**: Changes are automatically detected and servers restart
4. **Test Changes**: Visit http://localhost:3000 to see your changes
5. **API Testing**: Use http://localhost:3001/api/docs for Swagger UI

## 🏗️ Build & Production

### Build Commands
```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend  # Creates .next folder
npm run build:backend   # Creates dist folder
```

### Production Deployment
```bash
# Start production servers
npm run start

# Or start individually
npm run start:frontend  # Starts Next.js production server
npm run start:backend   # Starts NestJS production server
```

### Production Environment Setup
1. **Environment Variables**: Update `.env` files for production
2. **Database**: Set up production MongoDB instance
3. **Security**: 
   - Change JWT secrets
   - Configure CORS for production domains
   - Set up SSL certificates
4. **Performance**: 
   - Enable caching
   - Configure CDN for static assets
   - Set up load balancing if needed

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **Client Request**: User interacts with Next.js frontend
2. **API Call**: Frontend makes HTTP requests to NestJS backend
3. **Authentication**: JWT tokens validate user identity
4. **Data Processing**: Backend processes business logic
5. **Database Operations**: Mongoose ODM interacts with MongoDB
6. **Response**: Data flows back through the layers to the client

### Security Layers
- **Frontend**: Form validation, XSS protection, secure storage
- **Backend**: JWT authentication, input validation, rate limiting
- **Database**: Data validation, secure connections, access control

## � Project Structure

```
e-com-web-app/
├── 📁 frontend/                    # Next.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/                # Next.js 14 App Router
│   │   │   ├── 📄 page.tsx        # Homepage
│   │   │   ├── 📄 layout.tsx      # Root layout
│   │   │   ├── 📄 globals.css     # Global styles
│   │   │   ├── 📄 providers.tsx   # Context providers
│   │   │   ├── 📁 products/       # Product pages
│   │   │   │   ├── 📄 page.tsx    # Product listing
│   │   │   │   └── 📁 [id]/       # Dynamic product detail
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 cart/           # Shopping cart
│   │   │   ├── 📁 auth/           # Authentication pages
│   │   │   │   ├── 📁 login/
│   │   │   │   └── 📁 register/
│   │   │   ├── 📁 profile/        # User profile
│   │   │   ├── 📁 orders/         # Order history
│   │   │   ├── 📁 categories/     # Category pages
│   │   │   ├── 📁 about/          # About page
│   │   │   └── 📁 contact/        # Contact page
│   │   ├── 📁 components/         # Reusable UI Components
│   │   │   ├── 📁 layout/         # Layout components
│   │   │   │   ├── 📄 Header.tsx  # Navigation header
│   │   │   │   └── 📄 Footer.tsx  # Site footer
│   │   │   ├── 📁 home/           # Homepage components
│   │   │   │   ├── 📄 Hero.tsx    # Hero section
│   │   │   │   ├── 📄 FeaturedProducts.tsx
│   │   │   │   └── 📄 Categories.tsx
│   │   │   ├── 📁 products/       # Product components
│   │   │   │   ├── 📄 ProductCard.tsx
│   │   │   │   ├── 📄 ProductGrid.tsx
│   │   │   │   ├── 📄 ProductFilters.tsx
│   │   │   │   └── 📄 ProductImageGallery.tsx
│   │   │   ├── 📁 cart/           # Cart components
│   │   │   │   ├── 📄 CartItems.tsx
│   │   │   │   └── 📄 CartSummary.tsx
│   │   │   └── 📁 ui/             # Generic UI components
│   │   │       └── 📄 LoadingSpinner.tsx
│   │   ├── 📁 store/              # State Management (Zustand)
│   │   │   ├── 📄 authStore.ts    # Authentication state
│   │   │   └── 📄 cartStore.ts    # Shopping cart state
│   │   ├── 📁 lib/                # Utility Libraries
│   │   │   ├── 📄 api.ts          # API client configuration
│   │   │   └── 📄 server-api.ts   # Server-side API calls
│   │   └── 📁 types/              # TypeScript Type Definitions
│   │       ├── 📄 index.ts        # Common types
│   │       └── 📄 env.d.ts        # Environment types
│   ├── 📁 public/                 # Static Assets
│   │   ├── 🖼️ favicon.ico        # Site favicon
│   │   ├── 🖼️ icon-192.png       # PWA icons
│   │   ├── 🖼️ icon-512.png
│   │   └── 📄 robots.txt          # SEO robots file
│   ├── 📁 e2e/                    # End-to-End Tests
│   │   └── 📄 ecommerce.spec.ts   # E2E test scenarios
│   ├── 📁 coverage/               # Test Coverage Reports
│   ├── 📄 package.json            # Frontend dependencies
│   ├── 📄 next.config.js          # Next.js configuration
│   ├── 📄 tailwind.config.js      # Tailwind CSS config
│   ├── 📄 jest.config.js          # Jest testing config
│   └── 📄 playwright.config.ts    # Playwright E2E config
│
├── 📁 backend/                     # NestJS Backend Application
│   ├── 📁 src/
│   │   ├── 📄 main.ts             # Application entry point
│   │   ├── 📄 app.module.ts       # Root application module
│   │   ├── 📁 modules/            # Feature Modules
│   │   │   ├── 📁 auth/           # Authentication Module
│   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   ├── 📄 auth.service.ts
│   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   ├── 📁 dto/         # Data Transfer Objects
│   │   │   │   ├── 📁 guards/      # Authentication guards
│   │   │   │   └── 📁 strategies/  # Passport strategies
│   │   │   ├── 📁 products/       # Products Module
│   │   │   │   ├── 📄 products.controller.ts
│   │   │   │   ├── 📄 products.service.ts
│   │   │   │   └── 📄 products.module.ts
│   │   │   ├── 📁 users/          # Users Module
│   │   │   │   ├── 📄 users.controller.ts
│   │   │   │   ├── 📄 users.service.ts
│   │   │   │   └── 📄 users.module.ts
│   │   │   ├── 📁 cart/           # Shopping Cart Module
│   │   │   │   ├── 📄 cart.controller.ts
│   │   │   │   ├── 📄 cart.service.ts
│   │   │   │   └── 📄 cart.module.ts
│   │   │   └── 📁 orders/         # Orders Module
│   │   │       ├── 📄 orders.controller.ts
│   │   │       ├── 📄 orders.service.ts
│   │   │       └── 📄 orders.module.ts
│   │   ├── 📁 schemas/            # MongoDB Schemas
│   │   │   ├── 📄 product.schema.ts
│   │   │   ├── 📄 user.schema.ts
│   │   │   ├── 📄 cart.schema.ts
│   │   │   └── 📄 order.schema.ts
│   │   ├── 📁 common/             # Shared Resources
│   │   │   └── 📁 prisma/         # Database service
│   │   │       ├── 📄 prisma.service.ts
│   │   │       └── 📄 prisma.module.ts
│   │   └── 📁 database/           # Database Configuration
│   │       └── 📄 seeder.ts       # Database seeding
│   ├── 📁 test/                   # Integration Tests
│   │   └── 📄 app.e2e-spec.ts     # End-to-end API tests
│   ├── 📁 scripts/                # Utility Scripts
│   │   ├── 📄 check-images.ts     # Image validation
│   │   ├── 📄 check-prices.ts     # Price validation
│   │   └── 📄 cleanup-duplicates.ts
│   ├── 📄 package.json            # Backend dependencies
│   ├── 📄 nest-cli.json           # NestJS CLI configuration
│   └── 📄 tsconfig.json           # TypeScript configuration
│
├── 📄 package.json                 # Root package.json (workspace)
├── 📄 README.md                    # Project documentation
├── 📄 PROJECT_README.md            # Extended project info
├── 📄 TESTING.md                   # Testing documentation
├── 📄 TEST_SUITE_README.md         # Test suite details
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 run-tests.bat                # Windows test runner
└── 📄 setup.bat                    # Windows setup script
```

## 🎯 Key Features Implementation

### Security
- JWT authentication with refresh tokens
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet for security headers

### Performance
- Next.js Image optimization
- Code splitting and lazy loading
- API response caching
- Database query optimization

### SEO
- Meta tags management
- Structured data (JSON-LD)
- Sitemap generation
- Social media tags

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance

## 📊 API Documentation

### Base URLs
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3001`
- **Swagger Docs**: `http://localhost:3001/api/docs`

### Authentication Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | User registration | `{ email, password, name }` |
| `POST` | `/auth/login` | User login | `{ email, password }` |
| `POST` | `/auth/refresh` | Refresh access token | `{ refreshToken }` |
| `GET` | `/auth/profile` | Get user profile | Headers: `Authorization: Bearer <token>` |

### Product Endpoints
| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/products` | Get all products | `?page=1&limit=10&category=electronics&search=phone&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc` |
| `GET` | `/products/:id` | Get product by ID | - |
| `GET` | `/products/category/:category` | Get products by category | `?page=1&limit=10` |
| `GET` | `/products/search` | Search products | `?q=search-term&page=1&limit=10` |

### Cart Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/cart` | Get user's cart | Headers: `Authorization: Bearer <token>` |
| `POST` | `/cart/add` | Add item to cart | `{ productId, quantity }` |
| `PUT` | `/cart/update/:itemId` | Update cart item | `{ quantity }` |
| `DELETE` | `/cart/remove/:itemId` | Remove item from cart | - |
| `DELETE` | `/cart/clear` | Clear entire cart | - |

### Order Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/orders` | Create new order | `{ shippingAddress, paymentMethod }` |
| `GET` | `/orders` | Get user's orders | Headers: `Authorization: Bearer <token>` |
| `GET` | `/orders/:id` | Get order by ID | - |
| `PUT` | `/orders/:id/status` | Update order status | `{ status }` |

### Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "timestamp": "2025-07-31T08:30:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { /* additional error info */ }
  },
  "timestamp": "2025-07-31T08:30:00.000Z"
}
```

## ⚙️ Environment Configuration

### Required Environment Variables

#### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-here

# Database (for direct connections if needed)
NEXT_PUBLIC_MONGODB_URI=mongodb://localhost:27017/ecommerce

# External Services (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-MEASUREMENT-ID
```

#### Backend (.env)
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce
DB_NAME=ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (if implemented)
MAX_FILE_SIZE=5242880
UPLOAD_DESTINATION=./uploads

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Environment Setup Steps
1. **Copy Environment Files**:
   ```bash
   cp .env.example .env
   cd frontend && cp .env.example .env.local
   cd ../backend && cp .env.example .env
   ```

2. **Update Configuration**:
   - Replace placeholder values with your actual configuration
   - Generate secure JWT secrets (use `openssl rand -base64 32`)
   - Configure database connection strings
   - Set up external service API keys if needed

3. **Verify Configuration**:
   ```bash
   # Check if environment variables are loaded
   npm run dev
   ```

## 🧪 Testing

### Testing Strategy
This project implements a comprehensive testing strategy with multiple layers:

#### Test Types
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and service interactions
- **End-to-End Tests**: Test complete user workflows
- **Code Coverage**: Ensure adequate test coverage across the codebase

### Frontend Testing

#### Technologies Used
- **Jest**: JavaScript testing framework
- **React Testing Library**: Simple and complete testing utilities
- **@testing-library/user-event**: User interaction simulation
- **Playwright**: End-to-end testing framework

#### Test Structure
```
frontend/src/
├── **/__tests__/              # Unit tests
├── **/*.test.tsx              # Component tests
├── e2e/                       # End-to-end tests
└── coverage/                  # Coverage reports
```

#### Running Frontend Tests
```bash
# All frontend tests
npm run test:frontend

# Individual commands
cd frontend

# Unit tests
npm test

# Tests in watch mode
npm run test:watch

# Tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

#### Frontend Test Examples
- **Component Tests**: ProductCard, Cart, Authentication forms
- **Page Tests**: Homepage, Product listing, Product detail
- **Store Tests**: Zustand state management
- **API Tests**: HTTP client utilities
- **E2E Tests**: Complete user journeys

### Backend Testing

#### Technologies Used
- **Jest**: Testing framework
- **Supertest**: HTTP assertions for API testing
- **@nestjs/testing**: NestJS testing utilities

#### Test Structure
```
backend/
├── src/**/*.spec.ts           # Unit tests
├── test/                      # Integration tests
│   └── app.e2e-spec.ts       # E2E API tests
└── coverage/                  # Coverage reports
```

#### Running Backend Tests
```bash
# All backend tests
npm run test:backend

# Individual commands
cd backend

# Unit tests
npm run test

# Tests in watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

#### Backend Test Examples
- **Service Tests**: Products, Auth, Cart, Orders
- **Controller Tests**: API endpoint testing
- **E2E Tests**: Complete API workflows
- **Database Tests**: MongoDB operations

### Running All Tests
```bash
# Run all tests (frontend + backend)
npm run test

# Or use the batch script (Windows)
run-tests.bat
```

### Test Coverage
- **Frontend Target**: >80% code coverage
- **Backend Target**: >90% code coverage
- **Critical Paths**: 100% coverage for authentication and payment flows

### Test Reports
- **Coverage Reports**: Generated in `coverage/` directories
- **HTML Reports**: Open `coverage/lcov-report/index.html` in browser
- **Console Output**: Summary displayed after test runs

## 🎯 Key Features Implementation

### 🔒 Security Features
- **Authentication**: JWT-based with refresh tokens and secure storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Comprehensive validation using Zod and Class Validator
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: SameSite cookies and CSRF tokens
- **Rate Limiting**: API request throttling to prevent abuse
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet**: Security headers for enhanced protection

### ⚡ Performance Features
- **Image Optimization**: Next.js automatic image optimization and lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components and routes loaded on demand
- **Caching**: API response caching and static asset caching
- **Database Optimization**: Indexed queries and aggregation pipelines
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Compression**: Gzip compression for static assets

### 🔍 SEO Features
- **Meta Tags**: Dynamic meta tag generation per page
- **Structured Data**: JSON-LD schema markup for rich snippets
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling directives
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Canonical URLs**: Prevent duplicate content issues

### ♿ Accessibility Features
- **Semantic HTML**: Proper HTML5 semantic elements
- **ARIA Attributes**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical focus order and visible focus indicators
- **Color Contrast**: WCAG 2.1 AA compliant color ratios
- **Alt Text**: Descriptive alternative text for images
- **Form Labels**: Proper form labeling and error messages

### 📱 Responsive Design
- **Mobile-First**: Design approach starting with mobile devices
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch-Friendly**: Appropriate touch targets for mobile
- **Progressive Enhancement**: Base functionality without JavaScript
- **Flexible Layouts**: CSS Grid and Flexbox for responsive layouts

## 🚀 Deployment Guide

### Prerequisites for Deployment
- **Node.js**: v22.17.0 or higher
- **MongoDB**: Production database instance
- **Domain**: Registered domain name (optional for local deployment)
- **SSL Certificate**: For HTTPS (recommended for production)

### Local Production Deployment
```bash
# Build the application
npm run build

# Start production servers
npm run start
```

### Docker Deployment (Optional)
```bash
# Build Docker images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Environment Variables for Production
Update your `.env` files with production values:
- Change JWT secrets to strong, unique values
- Update CORS origins to your production domain
- Configure production database connection
- Set up external service API keys
- Enable error tracking and monitoring

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backed up and secured
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Monitoring and logging set up
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Find process using port 3000
npx kill-port 3000

# Find process using port 3001
npx kill-port 3001
```

#### Node Version Issues
```bash
# Check current Node version
node --version

# Install correct version using nvm
nvm install 22.17.0
nvm use 22.17.0
```

#### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Frontend debug mode
cd frontend && npm run dev

# Backend debug mode
cd backend && npm run start:debug
```

### Log Files
- **Frontend Logs**: Console output in browser developer tools
- **Backend Logs**: Console output in terminal
- **Database Logs**: MongoDB log files (varies by installation)

## 📚 Additional Resources

### Documentation Links
- **Next.js Documentation**: https://nextjs.org/docs
- **NestJS Documentation**: https://docs.nestjs.com
- **MongoDB Documentation**: https://docs.mongodb.com
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Zustand Documentation**: https://github.com/pmndrs/zustand

### Learning Resources
- **Next.js Tutorial**: https://nextjs.org/learn
- **NestJS Course**: https://docs.nestjs.com/first-steps
- **MongoDB University**: https://university.mongodb.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

### Community
- **Next.js Discord**: https://discord.com/invite/nextjs
- **NestJS Discord**: https://discord.gg/G7Qnnhy
- **MongoDB Community**: https://community.mongodb.com

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the powerful backend framework
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.