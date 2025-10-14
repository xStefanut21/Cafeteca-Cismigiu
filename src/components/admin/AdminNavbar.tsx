'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Produse', href: '/admin/products' },
  { name: 'Categorii', href: '/admin/categories' },
  { name: 'Evenimente', href: '/admin/events' },
];

export default function AdminNavbar() {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Don't render anything until we've checked the auth state
  if (loading) {
    return null;
  }

  // Don't show anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-white font-bold text-xl">
                Cafeteca Cismigiu
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${pathname === item.href
                    ? 'border-amber-500 text-white'
                    : 'border-transparent text-amber-100 hover:border-amber-300 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <span className="text-amber-100 text-sm mr-4">
                {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-amber-100 hover:bg-amber-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </Button>
            </div>
          )}
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-200 hover:text-white hover:bg-amber-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Deschide meniul principal</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${pathname === item.href
                ? 'bg-amber-700 text-white'
                : 'text-amber-100 hover:bg-amber-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <div className="pt-4 pb-3 border-t border-amber-700">
              <div className="flex items-center px-4">
                <div className="text-sm text-amber-200">{user.email}</div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-amber-100 hover:bg-amber-600 hover:text-white"
                >
                  Deconectare
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
