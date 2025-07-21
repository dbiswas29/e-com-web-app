"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
let CartService = class CartService {
    constructor() {
        this.cartItems = [];
    }
    async addCartItem(item) {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            return existingItem;
        }
        else {
            const newItem = Object.assign(Object.assign({}, item), { quantity: item.quantity });
            this.cartItems.push(newItem);
            return newItem;
        }
    }
    async removeCartItem(itemId) {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== itemId);
    }
    async getCartItems() {
        return this.cartItems;
    }
    async clearCart() {
        this.cartItems = [];
        return this.cartItems;
    }
};
CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
exports.CartService = CartService;
