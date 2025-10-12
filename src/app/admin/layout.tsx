"use client";

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminNavbar from '@/components/admin/AdminNavbar';
import '../globals.css';

// Initialize font at module level with display: swap for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-sans min-h-screen flex flex-col bg-gray-50`}>
      <AuthProvider>
        <AdminNavbar />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}
