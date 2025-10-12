import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Product = {
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!product) {
      return NextResponse.json(
        { error: 'Produsul nu a fost găsit' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Eroare la preluarea produsului' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    const updates: Partial<Product> = await request.json();
    
    // Validate required fields if present in updates
    if ('name' in updates && !updates.name) {
      return NextResponse.json(
        { error: 'Numele este obligatoriu' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea produsului' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      );
    }

    // Check if product exists
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('id', params.id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Produsul nu a fost găsit' },
        { status: 404 }
      );
    }

    // Soft delete by updating is_active to false
    const { error: updateError } = await supabase
      .from('products')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      })
      .eq('id', params.id);

    if (updateError) throw updateError;

    return NextResponse.json(
      { message: 'Produs șters cu succes' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Eroare la ștergerea produsului' },
      { status: 500 }
    );
  }
}
