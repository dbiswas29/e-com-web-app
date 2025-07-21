import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import styles from '../styles/Home.module.css';

const Home = () => {
  const { cartItems } = useCart();

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - E-commerce App</title>
        <meta name="description" content="Welcome to our e-commerce store!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>Welcome to Our E-commerce Store</h1>
        <nav>
          <Link href="/plp">Products</Link>
          <Link href="/cart">Cart ({cartItems.length})</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <h2>Featured Products</h2>
        {/* Add product cards or other components here */}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} E-commerce App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;