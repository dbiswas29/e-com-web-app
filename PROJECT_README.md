# E-Commerce Web Application

A full-stack e-commerce web application built with Next.js frontend and NestJS backend.

## 🚀 Features

### Frontend (Next.js)
- **Homepage** with hero section, featured products, categories, and newsletter
- **Product Listing Page (PLP)** with filters, search, and grid layout
- **Product Detail Page (PDP)** with product information and add to cart
- **Shopping Cart** with add/remove items, quantity management
- **Responsive Design** with Tailwind CSS
- **State Management** with Zustand
- **Authentication** with JWT tokens

### Backend (NestJS)
- **Authentication API** with JWT and password hashing
- **Products API** with CRUD operations, categories, and search
- **Cart Management** with add/remove items
- **Order Management** with order creation and tracking
- **User Management** with profiles and roles
- **API Documentation** with Swagger/OpenAPI
- **Database** with Prisma and SQLite

## 📁 Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── products/    # Product listing page
│   │   │   └── cart/        # Shopping cart page
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # Header, Footer
│   │   │   ├── home/        # Homepage components
│   │   │   ├── products/    # Product components
│   │   │   └── cart/        # Cart components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # API utilities
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── users/       # User management
│   │   │   ├── products/    # Product management
│   │   │   ├── cart/        # Cart management
│   │   │   └── orders/      # Order management
│   │   └── common/          # Shared modules (Prisma)
│   └── prisma/              # Database schema and migrations
└── package.json             # Root package manager
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment (Windows):**
   ```bash
   ./setup.bat
   ```

   **Setup environment (Unix/Linux/macOS):**
   ```bash
   ./setup.sh
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

### Manual Setup

1. **Backend setup:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run start:dev
   ```

2. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Documentation:** http://localhost:3001/api/docs

## 📊 Database Schema

The application uses SQLite with the following main entities:

- **Users** - Customer accounts with authentication
- **Products** - Product catalog with categories
- **Cart** - Shopping cart items per user
- **Orders** - Order management with items and shipping
- **Reviews** - Product reviews and ratings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🎨 Frontend Features

### Components
- **Header**: Navigation with cart counter and authentication
- **Hero**: Landing page hero section with CTA
- **Categories**: Product category grid
- **ProductCard**: Reusable product display component
- **ProductsGrid**: Product listing with pagination
- **ProductFilters**: Search and filter functionality
- **CartItems**: Shopping cart item management
- **CartSummary**: Order total and checkout

### State Management
- **authStore**: User authentication state
- **cartStore**: Shopping cart state and actions

## 🔒 Security Features

- JWT authentication with secure httpOnly cookies
- Password hashing with Argon2
- CORS configuration
- Rate limiting
- Input validation with Zod
- XSS protection with Helmet

## 🚀 Deployment Ready

The project includes:
- ✅ `.gitignore` files for both frontend and backend
- ✅ Environment variable templates
- ✅ Setup scripts for easy deployment
- ✅ TypeScript configuration
- ✅ ESLint and Prettier configuration
- ✅ Production build scripts

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## 🧪 Sample Data

The database is seeded with:
- Sample products across different categories
- Test user accounts
- Product reviews and ratings

## 📚 Technologies Used

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Headless UI
- React Hook Form
- Zod validation
- Axios

### Backend
- NestJS
- TypeScript
- Prisma ORM
- SQLite
- JWT with Passport.js
- Swagger/OpenAPI
- Argon2 (password hashing)
- Helmet (security)

## 🤝 Contributing

This project is ready for GitHub! You can:
1. Push to your repository
2. Set up CI/CD pipelines
3. Deploy to your preferred hosting platform
4. Add more features and improvements

## 📄 License

This project is open source and available under the MIT License.
