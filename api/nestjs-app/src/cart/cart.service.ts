import { Injectable } from '@nestjs/common';
import { CartItem } from '../types/cart-item.interface'; // Adjust path if needed

@Injectable()
export class CartService {
    private cartItems: CartItem[] = [];

    async addCartItem(item: CartItem): Promise<CartItem> {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            return existingItem;
        } else {
            const newItem = { ...item, quantity: item.quantity };
            this.cartItems.push(newItem);
            return newItem;
        }
    }

    async removeCartItem(itemId: string): Promise<void> {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== itemId);
    }

    async getCartItems(): Promise<CartItem[]> {
        return this.cartItems;
    }

    async clearCart(): Promise<CartItem[]> {
        this.cartItems = [];
        return this.cartItems;
    }
}