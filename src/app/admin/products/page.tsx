'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // This is the category name for display
  category_id?: string; // This is the foreign key
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  isAvailable: boolean;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
  categories?: {
    name: string;
  } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch products and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories first
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        
        if (categoriesError) throw categoriesError;
        
        if (categoriesData) {
          setCategories(categoriesData);
          
          // Then fetch products with their categories
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
              *,
              categories (
                name
              )
            `)
            .order('name', { ascending: true });
          
          if (productsError) throw productsError;
          
          if (products) {
            // Transform the data to include the category name directly
            const formattedProducts = products.map(product => ({
              ...product,
              category: product.categories?.name || 'Fără categorie',
              isAvailable: product.is_available === undefined ? true : product.is_available,
              image: product.image_url
            }));
            
            setProducts(formattedProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Eroare la încărcarea datelor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sunteți sigur că doriți să ștergeți acest produs?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setProducts(products.filter(product => product.id !== id));
        toast.success('Produs șters cu succes!');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Eroare la ștergerea produsului: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    
    console.log('Submitting product:', currentProduct);
    
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!currentProduct.name || !currentProduct.price) {
        throw new Error('Numele și prețul sunt obligatorii');
      }

      let categoryId = null;
      if (currentProduct.category) {
        // First, try to find the category by name
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', currentProduct.category)
          .single();

        // If category doesn't exist, create it
        if (!categoryData || categoryError) {
          const { data: newCategory, error: createError } = await supabase
            .from('categories')
            .insert([{ 
              name: currentProduct.category,
              is_active: true
            }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating category:', createError);
            throw new Error('Nu s-a putut crea categoria. Asigură-te că ești autentificat și ai permisiunile necesare.');
          }
          
          categoryId = newCategory.id;
          // Add the new category to our local state
          setCategories(prev => [...prev, newCategory]);
        } else {
          categoryId = categoryData.id;
        }
      }

      const productData = {
        name: currentProduct.name,
        price: Number(currentProduct.price),
        description: currentProduct.description || null,
        image_url: currentProduct.image || null,
        is_available: currentProduct.isAvailable !== false,
        category_id: categoryId,
        updated_at: new Date().toISOString()
      };

      if (currentProduct.id) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id)
          .select(`
            *,
            categories (name)
          `)
          .single();
          
        if (error) throw error;
        
        setProducts(products.map(p => p.id === currentProduct.id ? {
          ...data,
          category: data.categories?.name || 'Fără categorie',
          isAvailable: data.is_available
        } : p));
        
        toast.success('Produs actualizat cu succes!');
      } else {
        // Add new product
        const { data, error } = await supabase
          .from('products')
          .insert([{ 
            ...productData,
            created_at: new Date().toISOString()
          }])
          .select(`
            *,
            categories (name)
          `)
          .single();
          
        if (error) throw error;
        
        setProducts([...products, {
          ...data,
          category: data.categories?.name || 'Fără categorie',
          isAvailable: data.is_available
        }]);
        
        toast.success('Produs adăugat cu succes!');
      }
      
      setIsDialogOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Error saving product:');
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast.error('Eroare la salvarea produsului: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Produse</h1>
            <p className="text-muted-foreground">
              Gestionează produsele din meniu
            </p>
          </div>
          <Button onClick={() => {
            setCurrentProduct({
              name: '',
              price: 0,
              category: '',
              description: '',
              isAvailable: true
            });
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă produs
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută produse..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preț
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stoc
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acțiuni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image && (
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image 
                              src={product.image} 
                              alt={product.name}
                              fill
                              className="rounded-full object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">
                              {product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.price.toFixed(2)} RON</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'În stoc' : 'Stoc epuizat'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-amber-600 hover:text-amber-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Product Form Dialog */}
        {isDialogOpen && currentProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {currentProduct.id ? 'Editează produs' : 'Adaugă produs nou'}
                  </h2>
                  <button 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setCurrentProduct(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nume produs *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={currentProduct.name || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Preț (RON) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={currentProduct.price || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Categorie *
                      </label>
                      <select
                        id="category"
                        required
                        value={currentProduct.category || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      >
                        <option value="">Selectează o categorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            const newCategory = prompt('Introdu numele noii categorii:');
                            if (newCategory && newCategory.trim() !== '') {
                              try {
                                const { data: newCategoryData, error } = await supabase
                                  .from('categories')
                                  .insert([{ 
                                    name: newCategory.trim(),
                                    is_active: true
                                  }])
                                  .select()
                                  .single();

                                if (error) throw error;

                                setCategories(prev => [...prev, newCategoryData]);
                                setCurrentProduct({
                                  ...currentProduct,
                                  category: newCategoryData.name
                                });
                                toast.success('Categorie adăugată cu succes!');
                              } catch (error) {
                                console.error('Error adding category:', error);
                                toast.error('Eroare la adăugarea categoriei. Asigură-te că ai permisiunile necesare.');
                              }
                            }
                          }}
                          className="text-xs text-amber-600 hover:text-amber-800"
                        >
                          + Adaugă categorie nouă
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          Dacă nu găsești categoria, poți adăuga una nouă
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descriere
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={currentProduct.description || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isAvailable"
                      name="isAvailable"
                      type="checkbox"
                      checked={currentProduct.isAvailable !== false}
                      onChange={(e) => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                      Disponibil în meniu
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setCurrentProduct(null);
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Anulează
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      {currentProduct.id ? 'Actualizează' : 'Adaugă'} produs
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
