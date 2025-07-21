export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Optional for security reasons
}

export interface AuthResponse {
    token: string;
    user: User;
}