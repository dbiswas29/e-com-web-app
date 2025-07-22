import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Modern E-Commerce',
    default: 'Modern E-Commerce - Shop the Latest Products',
  },
  description: 'Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and excellent customer service.',
  keywords: 'ecommerce, shopping, products, online store, deals, fashion, electronics',
  authors: [{ name: 'E-Commerce Team' }],
  creator: 'Modern E-Commerce',
  publisher: 'Modern E-Commerce',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Modern E-Commerce',
    title: 'Modern E-Commerce - Shop the Latest Products',
    description: 'Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and excellent customer service.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern E-Commerce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern E-Commerce - Shop the Latest Products',
    description: 'Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and excellent customer service.',
    images: ['/og-image.jpg'],
    creator: '@ecommerce',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        <a
          href="#main-content"
          className="skip-link focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'text-sm',
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
