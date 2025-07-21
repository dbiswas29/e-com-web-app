import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { CartItem } from '../types';

const useCart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

    const getCartItemCount = () => {
        return cartItems.length;
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item: CartItemType) => total + item.price * item.quantity, 0);
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        getCartItemCount,
        getTotalPrice,
    };
};

export default useCart;