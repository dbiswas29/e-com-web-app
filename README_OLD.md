npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcryptjs# E-commerce Application

This is a Next.js e-commerce web application that showcases core concepts such as routing, API integration, state management, and component reuse. The application includes essential pages like the homepage, Product Listing Page (PLP), Product Detail Page (PDP), and a cart page.

## Features

- **Homepage**: Displays featured products and promotional content.
- **Product Listing Page (PLP)**: Lists all available products with filtering options.
- **Product Detail Page (PDP)**: Provides detailed information about a specific product, including images, descriptions, and pricing.
- **Cart**: Allows users to view items added to their cart, modify quantities, and remove items.
- **Add to Cart / Remove from Cart**: Users can easily manage their cart items.

## Technologies Used

- **Frontend**: Next.js, TypeScript, React
- **Backend**: Nest.js (Node.js framework)
- **State Management**: React Context API for cart management
- **Styling**: CSS Modules and global styles
- **API Integration**: Custom API endpoints for product and cart management

## Non-Functional Requirements

- **Web Accessibility**: The application adheres to WCAG guidelines to ensure accessibility for all users.
- **SEO**: Optimized for search engines with proper metadata and structured data.
- **Performance**: Implemented best practices for performance optimization, including code splitting and lazy loading.
- **Security**: Secure API endpoints with authentication and validation.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the Next.js application**:
   ```
   npm run dev
   ```

4. **Run the Nest.js API**:
   Navigate to the `api/nestjs-app` directory and run:
   ```
   npm install
   npm run start
   ```

5. **Access the application**:
   Open your browser and go to `http://localhost:3000` for the frontend and `http://localhost:3001` for the API (if configured to run on a different port).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.