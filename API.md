# API Documentation

This document provides comprehensive API documentation for the E-Commerce Web Application backend.

## 📋 Overview

The API is built with NestJS and follows RESTful principles. All endpoints return JSON responses and use standard HTTP status codes.

### Base Information
- **Base URL**: `http://localhost:3001`
- **API Version**: v1
- **Documentation**: `http://localhost:3001/api/docs` (Swagger UI)
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer tokens

## 🔐 Authentication

### Authentication Flow
1. **Register**: Create a new user account
2. **Login**: Authenticate and receive access token
3. **Access Protected Routes**: Include token in Authorization header
4. **Refresh Token**: Get new access token when expired

### Token Structure
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "60d5ecb74b24c1b8f8f9e1a1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Authentication Header
```
Authorization: Bearer <your-access-token>
```

## 🔑 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, must include uppercase, lowercase, number
- `name`: Minimum 2 characters, maximum 50 characters

**Response (201):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "60d5ecb74b24c1b8f8f9e1a1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-07-31T08:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
```json
// 400 - Email already exists
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "User with this email already exists"
  }
}

// 400 - Validation error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

### POST /auth/login
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "60d5ecb74b24c1b8f8f9e1a1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  },
  "message": "Login successful"
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "Token refreshed successfully"
}
```

### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ecb74b24c1b8f8f9e1a1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-07-31T08:30:00.000Z",
    "updatedAt": "2025-07-31T08:30:00.000Z"
  }
}
```

## 📦 Product Endpoints

### GET /products
Retrieve products with optional filtering, sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | 1 |
| `limit` | number | Items per page (max 50) | 12 |
| `category` | string | Filter by category | - |
| `search` | string | Search in name/description | - |
| `minPrice` | number | Minimum price filter | - |
| `maxPrice` | number | Maximum price filter | - |
| `sortBy` | string | Sort field (name, price, rating, createdAt) | createdAt |
| `sortOrder` | string | Sort order (asc, desc) | desc |
| `inStock` | boolean | Filter in-stock products only | - |

**Example Request:**
```
GET /products?page=1&limit=12&category=electronics&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "60d5ecb74b24c1b8f8f9e1a1",
        "name": "iPhone 13 Pro",
        "description": "Latest iPhone with advanced camera system",
        "price": 999.99,
        "imageUrl": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",
        "images": [
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",
          "https://images.unsplash.com/photo-1605370445499-1c0d5b4ad8e3"
        ],
        "category": "electronics",
        "stock": 25,
        "rating": 4.8,
        "reviewCount": 156,
        "features": ["5G Ready", "Pro Camera System", "A15 Bionic Chip"],
        "isActive": true,
        "createdAt": "2025-07-31T08:30:00.000Z",
        "updatedAt": "2025-07-31T08:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 58,
      "itemsPerPage": 12,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "appliedFilters": {
        "category": "electronics",
        "minPrice": 100,
        "maxPrice": 500
      },
      "availableCategories": ["electronics", "clothing", "books"],
      "priceRange": {
        "min": 9.99,
        "max": 1999.99
      }
    }
  }
}
```

### GET /products/:id
Get a single product by ID.

**Parameters:**
- `id`: Product ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ecb74b24c1b8f8f9e1a1",
    "name": "iPhone 13 Pro",
    "description": "Latest iPhone with advanced camera system and exceptional performance.",
    "price": 999.99,
    "imageUrl": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",
    "images": [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5",
      "https://images.unsplash.com/photo-1605370445499-1c0d5b4ad8e3",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505"
    ],
    "category": "electronics",
    "stock": 25,
    "rating": 4.8,
    "reviewCount": 156,
    "features": [
      "5G Ready",
      "Pro Camera System", 
      "A15 Bionic Chip",
      "Face ID",
      "Wireless Charging"
    ],
    "specifications": {
      "display": "6.1-inch Super Retina XDR",
      "storage": "128GB",
      "battery": "Up to 22 hours video playback",
      "camera": "12MP Pro camera system"
    },
    "isActive": true,
    "createdAt": "2025-07-31T08:30:00.000Z",
    "updatedAt": "2025-07-31T08:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

### GET /products/category/:category
Get products by category with pagination.

**Parameters:**
- `category`: Category name (string)

**Query Parameters:**
Same as GET /products (except category filter)

**Response:** Same format as GET /products

### GET /products/search
Search products by name or description.

**Query Parameters:**
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `q` | string | Search query | Yes |
| `page` | number | Page number | No |
| `limit` | number | Items per page | No |

**Example Request:**
```
GET /products/search?q=iphone&page=1&limit=10
```

**Response:** Same format as GET /products

## 🛒 Cart Endpoints

### GET /cart
Get current user's cart.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ecb74b24c1b8f8f9e1a2",
    "userId": "60d5ecb74b24c1b8f8f9e1a1",
    "items": [
      {
        "id": "60d5ecb74b24c1b8f8f9e1a3",
        "productId": "60d5ecb74b24c1b8f8f9e1a1",
        "product": {
          "id": "60d5ecb74b24c1b8f8f9e1a1",
          "name": "iPhone 13 Pro",
          "price": 999.99,
          "imageUrl": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5"
        },
        "quantity": 2,
        "price": 999.99,
        "subtotal": 1999.98,
        "addedAt": "2025-07-31T08:30:00.000Z"
      }
    ],
    "itemCount": 2,
    "subtotal": 1999.98,
    "tax": 199.99,
    "shipping": 0,
    "total": 2199.97,
    "createdAt": "2025-07-31T08:30:00.000Z",
    "updatedAt": "2025-07-31T08:30:00.000Z"
  }
}
```

### POST /cart/add
Add item to cart.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "productId": "60d5ecb74b24c1b8f8f9e1a1",
  "quantity": 1
}
```

**Validation Rules:**
- `productId`: Valid MongoDB ObjectId, product must exist
- `quantity`: Positive integer, cannot exceed available stock

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itemId": "60d5ecb74b24c1b8f8f9e1a3",
    "message": "Item added to cart",
    "cart": {
      // Full cart object as in GET /cart
    }
  }
}
```

**Error Responses:**
```json
// 400 - Product out of stock
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Requested quantity exceeds available stock",
    "details": {
      "requested": 5,
      "available": 3
    }
  }
}

// 404 - Product not found
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

### PUT /cart/update/:itemId
Update cart item quantity.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Parameters:**
- `itemId`: Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Cart item updated",
    "cart": {
      // Full cart object
    }
  }
}
```

### DELETE /cart/remove/:itemId
Remove item from cart.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Parameters:**
- `itemId`: Cart item ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Item removed from cart",
    "cart": {
      // Updated cart object
    }
  }
}
```

### DELETE /cart/clear
Clear entire cart.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Cart cleared successfully"
  }
}
```

## 📋 Order Endpoints

### POST /orders
Create a new order from cart items.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "****-****-****-1234",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ecb74b24c1b8f8f9e1a4",
    "orderNumber": "ORD-2025-001",
    "userId": "60d5ecb74b24c1b8f8f9e1a1",
    "items": [
      {
        "productId": "60d5ecb74b24c1b8f8f9e1a1",
        "product": {
          "name": "iPhone 13 Pro",
          "imageUrl": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5"
        },
        "quantity": 2,
        "price": 999.99,
        "subtotal": 1999.98
      }
    ],
    "subtotal": 1999.98,
    "tax": 199.99,
    "shipping": 0,
    "total": 2199.97,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "createdAt": "2025-07-31T08:30:00.000Z",
    "estimatedDelivery": "2025-08-07T08:30:00.000Z"
  }
}
```

### GET /orders
Get user's order history.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |
| `status` | string | Filter by status | - |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "60d5ecb74b24c1b8f8f9e1a4",
        "orderNumber": "ORD-2025-001",
        "total": 2199.97,
        "status": "shipped",
        "itemCount": 2,
        "createdAt": "2025-07-31T08:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

### GET /orders/:id
Get detailed order information.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Parameters:**
- `id`: Order ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ecb74b24c1b8f8f9e1a4",
    "orderNumber": "ORD-2025-001",
    "userId": "60d5ecb74b24c1b8f8f9e1a1",
    "items": [
      {
        "productId": "60d5ecb74b24c1b8f8f9e1a1",
        "product": {
          "id": "60d5ecb74b24c1b8f8f9e1a1",
          "name": "iPhone 13 Pro",
          "imageUrl": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5"
        },
        "quantity": 2,
        "price": 999.99,
        "subtotal": 1999.98
      }
    ],
    "subtotal": 1999.98,
    "tax": 199.99,
    "shipping": 0,
    "total": 2199.97,
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "paymentStatus": "completed",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2025-07-31T08:30:00.000Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-07-31T09:30:00.000Z"
      },
      {
        "status": "shipped",
        "timestamp": "2025-08-01T10:30:00.000Z"
      }
    ],
    "createdAt": "2025-07-31T08:30:00.000Z",
    "estimatedDelivery": "2025-08-07T08:30:00.000Z"
  }
}
```

## 📊 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error context
    }
  },
  "timestamp": "2025-07-31T08:30:00.000Z"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Specific Error Codes

#### Authentication Errors
- `INVALID_CREDENTIALS`: Wrong email/password
- `TOKEN_EXPIRED`: Access token expired
- `TOKEN_INVALID`: Malformed or invalid token
- `EMAIL_EXISTS`: Email already registered

#### Product Errors
- `PRODUCT_NOT_FOUND`: Product doesn't exist
- `INSUFFICIENT_STOCK`: Not enough inventory

#### Cart Errors
- `CART_EMPTY`: Cart has no items
- `ITEM_NOT_FOUND`: Cart item doesn't exist

#### Order Errors
- `PAYMENT_FAILED`: Payment processing failed
- `ORDER_NOT_FOUND`: Order doesn't exist

## 🔧 Rate Limiting

### Rate Limit Rules
- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Search endpoints**: 30 requests per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1627756800
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 300
    }
  }
}
```

## 📈 API Versioning

### Version Strategy
- **Current Version**: v1
- **Header**: `Accept: application/vnd.api+json;version=1`
- **URL**: All endpoints are prefixed with `/api/v1/`

### Version Deprecation
- Versions are supported for minimum 6 months
- Deprecation notices sent via `X-API-Deprecation-Warning` header
- Migration guides provided for major version changes

## 🧪 Testing the API

### Using cURL
```bash
# Register user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get products
curl -X GET "http://localhost:3001/products?page=1&limit=5" \
  -H "Content-Type: application/json"

# Add to cart (requires auth token)
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

### Using Postman
1. Import the Swagger JSON from `http://localhost:3001/api/docs-json`
2. Set up environment variables for base URL and tokens
3. Use collection runner for automated testing

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create new collection
3. Add requests with proper headers and body
4. Use environment variables for tokens

This API documentation provides comprehensive information for integrating with the e-commerce backend. For interactive testing, visit the Swagger UI at `http://localhost:3001/api/docs`.
