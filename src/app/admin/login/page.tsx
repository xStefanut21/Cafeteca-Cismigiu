'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vă rugăm să completați toate câmpurile');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password, rememberMe);
      
      if (error) {
        throw error;
      }
      
      toast.success('Autentificare reușită!');
      router.push('/admin/dashboard');
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la autentificare.';
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Email sau parolă incorecte. Vă rugăm să încercați din nou.');
      } else if (errorMessage.includes('Too many requests')) {
        toast.error('Prea multe încercări eșuate. Vă rugăm să așteptați puțin înainte de a încerca din nou.');
      } else if (errorMessage.includes('Network error')) {
        toast.error('Eroare de conexiune la server. Vă rugăm să verificați conexiunea la internet.');
      } else if (errorMessage.includes('User not found')) {
        toast.error('Nu există niciun cont asociat acestui email.');
      } else {
        toast.error('A apărut o eroare la autentificare. Vă rugăm să încercați din nou mai târziu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Autentificare Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Introduceti datele de autentificare pentru a accesa panoul de administrare
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Adresă email
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Adresă email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Parolă
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ține-mă minte
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                Ai uitat parola?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              {isLoading ? 'Se autentifică...' : 'Autentificare'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Sau contactați administratorul</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
