import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Product = {
  id?: string;
  name: string;
  price: number;
  category_id: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function GET() {
  try {
    const supabase = createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Eroare la preluarea produselor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const product: Omit<Product, 'id' | 'created_at' | 'updated_at'> = await request.json();
    
    // Validate required fields
    if (!product.name || !product.price || !product.category_id) {
      return NextResponse.json(
        { error: 'Numele, prețul și categoria sunt obligatorii' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea produsului' },
      { status: 500 }
    );
  }
}
