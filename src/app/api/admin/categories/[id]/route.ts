import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Category = {
  name: string;
  description?: string;
  is_active: boolean;
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

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Eroare la preluarea categoriei' },
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

    const updates: Partial<Category> = await request.json();
    
    // Validate required fields if present in updates
    if ('name' in updates && !updates.name) {
      return NextResponse.json(
        { error: 'Numele este obligatoriu' },
        { status: 400 }
      );
    }

    // Check for duplicate category name if name is being updated
    if (updates.name) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', updates.name)
        .neq('id', params.id)
        .single();

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Există deja o categorie cu acest nume' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('categories')
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
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea categoriei' },
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

    // Check if category exists
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', params.id)
      .single();

    if (fetchError || !category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      );
    }

    // Check if category is in use by any products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', params.id)
      .limit(1);

    if (productsError) throw productsError;
    
    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Nu puteți șterge o categorie care are produse asociate' },
        { status: 400 }
      );
    }

    // Soft delete by updating is_active to false
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      })
      .eq('id', params.id);

    if (updateError) throw updateError;

    return NextResponse.json(
      { message: 'Categorie ștearsă cu succes' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Eroare la ștergerea categoriei' },
      { status: 500 }
    );
  }
}
