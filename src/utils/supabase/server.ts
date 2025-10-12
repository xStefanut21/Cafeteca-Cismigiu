import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieOptions = {
  path?: string;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  secure?: boolean;
  maxAge?: number;
  expires?: Date | string;
};

type CookieMethods = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};

export function createClient() {
  const cookieStore = cookies();
  
  const cookieMethods: CookieMethods = {
    get: (name) => {
      return cookieStore.get(name)?.value;
    },
    set: (name, value, options) => {
      try {
        const cookieOptions = {
          path: options.path || '/',
          httpOnly: options.httpOnly ?? true,
          sameSite: options.sameSite ?? 'lax',
          secure: options.secure ?? process.env.NODE_ENV === 'production',
          ...options
        };
        
        // Convert expires to string if it's a Date object
        if (cookieOptions.expires && cookieOptions.expires instanceof Date) {
          cookieOptions.expires = cookieOptions.expires.toUTCString();
        }
        
        // Set cookie using document.cookie in the browser
        if (typeof document !== 'undefined') {
          document.cookie = `${name}=${value}; ${Object.entries(cookieOptions)
            .map(([key, val]) => `${key}=${val}`)
            .join('; ')}`;
        }
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    },
    remove: (name, options) => {
      try {
        const cookieOptions = {
          path: options.path || '/',
          maxAge: 0,
          httpOnly: options.httpOnly ?? true,
          sameSite: options.sameSite ?? 'lax',
          secure: options.secure ?? process.env.NODE_ENV === 'production',
          ...options
        };
        
        // Remove cookie using document.cookie in the browser
        if (typeof document !== 'undefined') {
          document.cookie = `${name}=; ${Object.entries(cookieOptions)
            .map(([key, val]) => `${key}=${val}`)
            .join('; ')}`;
        }
      } catch (error) {
        console.error('Error removing cookie:', error);
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieMethods.get(name),
        set: (name, value, options) => cookieMethods.set(name, value, options as CookieOptions),
        remove: (name, options) => cookieMethods.remove(name, options as CookieOptions),
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
