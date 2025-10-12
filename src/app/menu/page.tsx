'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  is_spicy?: boolean;
  is_new?: boolean;
  categories?: {
    name: string;
    image_url: string | null;
  } | null;
}

interface SelectedProduct extends Product {
  categoryName: string;
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleProductClick = (product: Product) => {
    const category = categories.find(cat => cat.id === product.category_id);
    setSelectedProduct({
      ...product,
      categoryName: category?.name || 'Categorie'
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('name');

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (productsError || categoriesError) {
          throw productsError || categoriesError;
        }

        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Alege din meniul nostru</h2>
        <div className="w-24 h-1 bg-amber-600 mx-auto mb-12"></div>

        {categories?.map((category: Category) => {
          const categoryProducts = products.filter(
            (product: Product) => product.category_id === category.id
          );
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="mb-16">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">{category.name}</h2>
                <div className="flex-1 ml-4 h-px bg-gradient-to-r from-amber-600 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProducts.map((product: Product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col p-6 cursor-pointer"
                    whileHover={{ y: -5 }}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                        <span className="text-lg font-bold text-amber-600 whitespace-nowrap ml-4">
                          {product.price.toFixed(2)} RON
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.is_vegetarian && (
                          <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
                            Vegetarian
                          </span>
                        )}
                        {product.is_vegan && (
                          <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1.5 rounded-full border border-green-200">
                            Vegan
                          </span>
                        )}
                        {product.is_gluten_free && (
                          <span className="text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
                            Fără gluten
                          </span>
                        )}
                        {product.is_spicy && (
                          <span className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-100">
                            Picant
                          </span>
                        )}
                        {product.is_new && (
                          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                            Nou
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div
              ref={modalRef}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProduct.image_url && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-amber-600 font-medium">{selectedProduct.categoryName}</span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">
                    {selectedProduct.price.toFixed(2)} RON
                  </span>
                </div>

                {selectedProduct.description && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Alergeni și informații nutriționale</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.is_vegetarian && (
                      <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
                        Vegetarian
                      </span>
                    )}
                    {selectedProduct.is_vegan && (
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1.5 rounded-full border border-green-200">
                        Vegan
                      </span>
                    )}
                    {selectedProduct.is_gluten_free && (
                      <span className="text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
                        Fără gluten
                      </span>
                    )}
                    {selectedProduct.is_dairy_free && (
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                        Fără lactoză
                      </span>
                    )}
                    {selectedProduct.is_spicy && (
                      <span className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-100">
                        Picant
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Închide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}