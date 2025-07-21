# Nest.js E-commerce API

This is the backend API for the E-commerce application built using Nest.js. It provides endpoints for managing products, user authentication, and cart functionalities.

## Features

- **Product Management**: CRUD operations for products.
- **User Authentication**: Secure user registration and login.
- **Cart Management**: Add, remove, and view items in the cart.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce-app/api/nestjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm run start
   ```

4. **Access the API**:
   The API will be running on `http://localhost:3000`.

## API Endpoints

- **Products**
  - `GET /products`: Retrieve all products.
  - `GET /products/:id`: Retrieve a specific product by ID.
  - `POST /products`: Create a new product.
  - `PUT /products/:id`: Update a product by ID.
  - `DELETE /products/:id`: Delete a product by ID.

- **Authentication**
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Login an existing user.

- **Cart**
  - `GET /cart`: Retrieve the current user's cart.
  - `POST /cart`: Add an item to the cart.
  - `DELETE /cart/:id`: Remove an item from the cart.

## Best Practices

- Follow RESTful API design principles.
- Implement proper error handling and validation.
- Secure sensitive endpoints with authentication and authorization.

## Technologies Used

- Nest.js
- TypeScript
- PostgreSQL (or any preferred database)
- JWT for authentication

## License

This project is licensed under the MIT License.