'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e.currentTarget.value);
    }
  };

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-width-container container-padding" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-0">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900" style={{ marginRight: '8px' }}>
                E-Commerce
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-0"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search products..."
                className="input pl-10 pr-4"
                aria-label="Search products"
              />
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none focus:ring-0"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none focus:ring-0">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden md:block text-sm">
                    {user?.firstName}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : mounted && !isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium focus:outline-none focus:ring-0"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm px-4 py-2 focus:outline-none focus:ring-0"
                >
                  Sign up
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none focus:ring-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Search */}
            <div className="mt-4 px-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="input pl-10 pr-4"
                  aria-label="Search products"
                />
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
