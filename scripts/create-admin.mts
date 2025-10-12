import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize the Supabase client with your project's URL and the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing required environment variables.');
  console.error('Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  updated_at?: string;
}

/**
 * Creates or updates an admin user
 */
async function createOrUpdateAdminUser(email: string, password: string): Promise<void> {
  try {
    console.log(`Processing admin user: ${email}`);
    
    // 1. First try to sign in to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: password + 'wrong' // Intentionally wrong to check if user exists
    });

    let userId: string;

    if (signInError) {
      if (signInError.status === 400) {
        // User exists but password is wrong, get user by email
        console.log('User exists, updating password and role...');
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        if (userError) throw userError;
        
        const user = userData.users.find(u => u.email === email);
        if (!user) {
          throw new Error('User not found');
        }
        
        userId = user.id;
        
        // Update user with new password
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
          user_metadata: { name: 'Admin User' }
        });
        
        if (updateError) throw updateError;
        console.log('Updated existing user with ID:', userId);
      } else {
        // If user doesn't exist, create a new one
        console.log('Creating new admin user...');
        const { data: authData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: 'Admin User' }
        });
        
        if (createError) throw createError;
        if (!authData.user) throw new Error('No user data returned');
        
        userId = authData.user.id;
        console.log('New auth user created with ID:', userId);
      }
    } else {
      // User exists and password is correct
      userId = signInData.user!.id;
      console.log('User already exists with ID:', userId);
    }
    
    // 4. Create or update the profile
    const profile = {
      id: userId,
      email,
      role: 'admin',
      updated_at: new Date().toISOString()
    };

    // Try to insert first
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profile);

    // If insert fails with unique violation, update instead
    if (insertError?.code === '23505') {
      console.log('Updating existing profile...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId);
        
      if (updateError) throw updateError;
    } else if (insertError) {
      throw insertError;
    }

    console.log('✅ Admin user processed successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('Error processing admin user:');
    console.error(error);
    process.exit(1);
  }
}

// Get email and password from command line arguments or use defaults
const email = process.argv[2] || 'admin@cafetecacismigiu.com';
const password = process.argv[3] || 'Admin123!';

// Run the function
createOrUpdateAdminUser(email, password).catch(console.error);
