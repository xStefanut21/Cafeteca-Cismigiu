import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Category = {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Eroare la preluarea categoriilor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const category: Omit<Category, 'id' | 'created_at' | 'updated_at'> = await request.json();
    
    // Validate required fields
    if (!category.name) {
      return NextResponse.json(
        { error: 'Numele categoriei este obligatoriu' },
        { status: 400 }
      );
    }

    // Check for duplicate category name
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', category.name)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Există deja o categorie cu acest nume' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        created_by: session.user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea categoriei' },
      { status: 500 }
    );
  }
}
