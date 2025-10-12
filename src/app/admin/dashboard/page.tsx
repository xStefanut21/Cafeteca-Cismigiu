'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, List } from 'lucide-react';

export default function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');

        console.log('[DEBUG] Products data:', products);
        if (productsError) {
          console.error('Products error:', productsError);
          throw productsError;
        }
        
        // Fetch active categories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        console.log('[DEBUG] Categories data:', categories);
        if (categoriesError) {
          console.error('Categories error:', categoriesError);
          throw categoriesError;
        }
        
        setProductCount(products?.length || 0);
        setCategoryCount(categories?.length || 0);
        
        console.log('[DEBUG] Product count:', products?.length || 0);
        console.log('[DEBUG] Category count:', categories?.length || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setProductCount(0);
        setCategoryCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bun venit înapoi!</h1>
          <p className="text-muted-foreground">
            Rezumat al conținutului meniului tău.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Products Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produse
              </CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{productCount}</div>
              <p className="text-sm text-muted-foreground">
                produse în total în meniu
              </p>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Categorii Active
              </CardTitle>
              <List className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categoryCount}</div>
              <p className="text-sm text-muted-foreground">
                categorii active în meniu
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
