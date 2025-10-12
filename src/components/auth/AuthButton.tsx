'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleSignIn} variant="outline">
        Sign In
      </Button>
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </div>
  );
}
