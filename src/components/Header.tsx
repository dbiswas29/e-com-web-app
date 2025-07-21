import React from 'react';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
    const { cartItems } = useCart();

    return (
        <header className="header">
            <div className="logo">
                <Link href="/">E-Commerce</Link>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/plp">Products</Link>
                    </li>
                    <li>
                        <Link href="/cart">Cart ({cartItems.length})</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;