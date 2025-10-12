import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieOptions = {
  path?: string;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  secure?: boolean;
  maxAge?: number;
  expires?: Date;
};

type CookieMethods = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return early if we don't have the required environment variables
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in middleware');
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const cookieMethods: CookieMethods = {
    get: (name) => request.cookies.get(name)?.value,
    set: (name, value, options) => {
      request.cookies.set({
        name,
        value,
        path: options.path || '/',
        httpOnly: options.httpOnly ?? true,
        sameSite: options.sameSite ?? 'lax',
        secure: options.secure ?? process.env.NODE_ENV === 'production',
        ...options,
      });
      response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      response.cookies.set({
        name,
        value,
        path: options.path || '/',
        httpOnly: options.httpOnly ?? true,
        sameSite: options.sameSite ?? 'lax',
        secure: options.secure ?? process.env.NODE_ENV === 'production',
        ...options,
      });
    },
    remove: (name, options) => {
      request.cookies.set({
        name,
        value: '',
        path: options.path || '/',
        maxAge: 0,
        httpOnly: options.httpOnly ?? true,
        sameSite: options.sameSite ?? 'lax',
        secure: options.secure ?? process.env.NODE_ENV === 'production',
        ...options,
      });
      response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      response.cookies.set({
        name,
        value: '',
        path: options.path || '/',
        maxAge: 0,
        httpOnly: options.httpOnly ?? true,
        sameSite: options.sameSite ?? 'lax',
        secure: options.secure ?? process.env.NODE_ENV === 'production',
        ...options,
      });
    },
  };

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: cookieMethods.get,
      set: cookieMethods.set,
      remove: cookieMethods.remove,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // This will refresh session if expired - required for Server Components
  try {
    await supabase.auth.getSession();
  } catch (error) {
    console.error('Error refreshing session:', error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Database type has been moved to @/types/database.types
// Import it when needed: import type { Database } from '@/types/database.types';