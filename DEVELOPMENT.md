# Development Guide

This document provides detailed information for developers working on the E-Commerce Web Application.

## 🛠️ Development Environment Setup

### Prerequisites Verification
```bash
# Check Node.js version (should be v22.17.0)
node --version

# Check npm version (should be v10.9.2)
npm --version

# Check MongoDB installation
mongosh --version

# Verify MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"
```

### IDE Configuration

#### VS Code (Recommended)
Install these extensions for optimal development experience:
- **TypeScript**: Enhanced TypeScript support
- **ES7+ React/Redux/React-Native snippets**: React snippets
- **Tailwind CSS IntelliSense**: Tailwind CSS autocomplete
- **Auto Rename Tag**: Automatically rename paired HTML tags
- **Bracket Pair Colorizer**: Color matching brackets
- **GitLens**: Enhanced Git capabilities
- **Thunder Client**: API testing within VS Code
- **Jest**: Test runner integration
- **MongoDB for VS Code**: MongoDB integration

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## 📁 Code Organization

### Frontend Structure Guidelines

#### Component Organization
```
components/
├── layout/          # Layout components (Header, Footer, Sidebar)
├── ui/             # Generic UI components (Button, Input, Modal)
├── features/       # Feature-specific components
│   ├── auth/       # Authentication components
│   ├── products/   # Product-related components
│   └── cart/       # Cart-related components
└── common/         # Shared components
```

#### Naming Conventions
- **Components**: PascalCase (`ProductCard.tsx`)
- **Files**: camelCase for utilities (`apiClient.ts`)
- **Folders**: kebab-case (`user-profile/`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

#### Component Structure
```typescript
// ProductCard.tsx
import React from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="product-card">
      {/* Component content */}
    </div>
  );
};

export default ProductCard;
```

### Backend Structure Guidelines

#### Module Organization
```
src/modules/
├── auth/           # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/        # Data Transfer Objects
│   ├── guards/     # Auth guards
│   └── strategies/ # Passport strategies
├── products/       # Products module
└── common/         # Shared functionality
```

#### Service Pattern
```typescript
// products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) 
    private productModel: Model<ProductDocument>
  ) {}

  async findAll(query: ProductQueryDto): Promise<Product[]> {
    // Service implementation
  }
}
```

## 🔄 Development Workflow

### Git Workflow
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/product-filtering
   ```

2. **Make Changes**
   - Write code following coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add product filtering functionality"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/product-filtering
   # Create Pull Request on GitHub
   ```

### Commit Message Convention
Follow conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Code Review Process
1. **Self Review**: Review your own code before requesting review
2. **Automated Checks**: Ensure CI/CD checks pass
3. **Peer Review**: Get approval from team members
4. **Testing**: Verify functionality works as expected
5. **Merge**: Squash and merge to main branch

## 🧪 Testing Guidelines

### Frontend Testing

#### Component Testing Best Practices
```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  // ... other properties
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });
});
```

#### E2E Testing Best Practices
```typescript
// products.spec.ts
import { test, expect } from '@playwright/test';

test('user can browse and filter products', async ({ page }) => {
  await page.goto('/products');
  
  // Check products are displayed
  await expect(page.locator('.product-card')).toHaveCount(12);
  
  // Apply category filter
  await page.click('text=Electronics');
  await expect(page.locator('.product-card')).toHaveCount(6);
  
  // Check URL updated
  await expect(page).toHaveURL(/.*category=electronics/);
});
```

### Backend Testing

#### Service Testing
```typescript
// products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        // Mock dependencies
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should return filtered products', async () => {
    const result = await service.findAll({ category: 'electronics' });
    expect(result).toHaveLength(6);
    expect(result[0].category).toBe('electronics');
  });
});
```

#### E2E API Testing
```typescript
// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(12);
      });
  });
});
```

## 🚀 Performance Optimization

### Frontend Optimization

#### Code Splitting
```typescript
// Dynamic imports for code splitting
const ProductDetail = lazy(() => import('./ProductDetail'));

// Route-based splitting
const routes = [
  {
    path: '/products/:id',
    component: lazy(() => import('./pages/ProductDetail')),
  },
];
```

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/products/product-1.jpg"
  alt="Product 1"
  width={600}
  height={400}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### State Management Optimization
```typescript
// Zustand store with selectors
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    total: state.total + item.price,
  })),
}));

// Use selectors to prevent unnecessary re-renders
const items = useCartStore((state) => state.items);
const total = useCartStore((state) => state.total);
```

### Backend Optimization

#### Database Optimization
```typescript
// Add indexes for frequently queried fields
@Schema()
export class Product {
  @Prop({ index: true })
  category: string;

  @Prop({ index: true })
  price: number;

  @Prop({ text: true }) // Text index for search
  name: string;
}

// Use aggregation pipelines for complex queries
async findProductsWithStats() {
  return this.productModel.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}
```

#### Caching Strategy
```typescript
// Redis caching (if implemented)
@Injectable()
export class ProductsService {
  async findAll(query: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const products = await this.productModel.find(query);
    await this.cacheService.set(cacheKey, products, 300); // 5 min cache
    
    return products;
  }
}
```

## 🔧 Debugging

### Frontend Debugging

#### React Developer Tools
1. Install React Developer Tools browser extension
2. Use Components tab to inspect component state
3. Use Profiler tab to identify performance bottlenecks

#### Browser DevTools
```javascript
// Console debugging
console.log('Debug data:', data);
console.table(products); // For arrays/objects
console.time('API Call'); // Performance timing
// ... code to measure
console.timeEnd('API Call');

// Network tab for API debugging
// Sources tab for breakpoints
// Application tab for localStorage/cookies
```

#### VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/frontend",
      "runtimeArgs": ["--inspect"]
    }
  ]
}
```

### Backend Debugging

#### NestJS Debugging
```bash
# Start in debug mode
npm run start:debug

# Attach debugger on port 9229
```

#### Database Debugging
```typescript
// Enable mongoose debugging
import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Log database queries
const products = await this.productModel
  .find(query)
  .explain('executionStats'); // Shows query execution details
```

## 📊 Monitoring and Analytics

### Error Tracking
```typescript
// Frontend error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    console.error('Error caught by boundary:', error, errorInfo);
  }
}

// Backend error handling
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Log error details
    console.error('Unhandled exception:', exception);
    
    // Send to monitoring service
    // this.monitoringService.logError(exception);
  }
}
```

### Performance Monitoring
```typescript
// Frontend performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Backend performance monitoring
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`Request took ${duration}ms`);
      }),
    );
  }
}
```

## 🔐 Security Guidelines

### Frontend Security
- **XSS Prevention**: Use React's built-in XSS protection
- **Secure Storage**: Store sensitive data in httpOnly cookies
- **CSRF Protection**: Include CSRF tokens in forms
- **Content Security Policy**: Configure CSP headers

### Backend Security
- **Input Validation**: Validate all inputs using DTOs
- **SQL Injection**: Use parameterized queries (Mongoose protects against NoSQL injection)
- **Rate Limiting**: Implement rate limiting for APIs
- **Authentication**: Use JWT with proper expiration
- **Authorization**: Implement role-based access control

### Security Checklist
- [ ] All user inputs validated
- [ ] Sensitive data encrypted
- [ ] HTTPS configured
- [ ] Security headers implemented
- [ ] Dependencies regularly updated
- [ ] Error messages don't leak sensitive information
- [ ] Proper session management
- [ ] File upload restrictions

## 📝 Documentation Standards

### Code Documentation
```typescript
/**
 * Retrieves products based on filter criteria
 * @param query - Filter criteria including category, price range, etc.
 * @returns Promise resolving to array of filtered products
 * @throws {NotFoundException} When no products match the criteria
 */
async findProducts(query: ProductQueryDto): Promise<Product[]> {
  // Implementation
}
```

### API Documentation
- Use Swagger decorators for automatic API documentation
- Include request/response examples
- Document error scenarios
- Provide usage examples

### Component Documentation
```typescript
/**
 * ProductCard component displays product information in a card layout
 * 
 * @example
 * ```tsx
 * <ProductCard 
 *   product={productData} 
 *   onAddToCart={handleAddToCart}
 *   showQuickView={true}
 * />
 * ```
 */
interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Callback when user adds product to cart */
  onAddToCart: (productId: string) => void;
  /** Whether to show quick view button */
  showQuickView?: boolean;
}
```

This development guide provides comprehensive information for maintaining and extending the e-commerce application. Follow these guidelines to ensure code quality, performance, and maintainability.
