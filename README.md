# E-Commerce Web Application

A modern, full-stack e-commerce web application built with Next.js (frontend) and NestJS (backend), following industry best practices for performance, accessibility, SEO, and security.

## 🚀 Features

### Frontend (Next.js)
- **Homepage**: Hero section, featured products, categories
- **Product Listing Page (PLP)**: Product grid with filtering and sorting
- **Product Detail Page (PDP)**: Detailed product information
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login, signup, profile management
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Accessible**: WCAG 2.1 AA compliant
- **Performance**: Image optimization, lazy loading, code splitting

### Backend (NestJS)
- **RESTful APIs**: Products, Users, Cart, Orders
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation and sanitization
- **Security**: CORS, rate limiting, helmet
- **Documentation**: Swagger/OpenAPI

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + Passport
- **Validation**: Class Validator
- **Documentation**: Swagger
- **Testing**: Jest

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dbiswas29/e-com-web-app.git
   cd e-com-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. **Set up MongoDB**
   ```bash
   # Make sure MongoDB is installed and running
   # Default connection: mongodb://localhost:27017/ecommerce
   # Database will be automatically seeded when backend starts
   ```

## 🚀 Development

### Start both frontend and backend
```bash
npm run dev
```

### Start individually
```bash
# Frontend only (runs on http://localhost:3000)
npm run dev:frontend

# Backend only (runs on http://localhost:3001)
npm run dev:backend
```

## 🏗️ Build

```bash
npm run build
```

## 🚀 Production

```bash
npm run start
```

## 📱 Project Structure

```
e-com-web-app/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/            # Utilities and configurations
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── schemas/        # MongoDB schemas
│   │   ├── database/       # Database seeder
│   │   └── main.ts
│   └── package.json
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
└── package.json           # Root package.json
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

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Products
- `GET /products` - Get all products (with pagination)
- `GET /products/:id` - Get product by ID
- `GET /products/category/:category` - Get products by category

### Cart
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove/:id` - Remove item from cart

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order by ID

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

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