'use client';

import { useState, useEffect } from 'react';
import { MenuCategory, MenuItem } from '@/types/menu';
import { MenuCategorySection } from '@/components/menu/MenuCategorySection';
import { MenuFilters, FilterState } from '@/components/menu/MenuFilters';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuContentProps {
  initialCategories: MenuCategory[];
  initialMenuItems: MenuItem[];
}

export function MenuContent({ initialCategories, initialMenuItems }: MenuContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
    popular: false,
  });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [categories] = useState<MenuCategory[]>(initialCategories);
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter menu items based on search and filters
  const filteredItems = menuItems.filter((item) => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    // Apply filters
    const matchesFilters = (
      (!filters.vegetarian || item.isVegetarian) &&
      (!filters.vegan || item.isVegan) &&
      (!filters.glutenFree || item.isGlutenFree) &&
      (!filters.spicy || item.isSpicy) &&
      (!filters.popular || item.isPopular)
    );

    return matchesSearch && matchesFilters;
  });

  // Group items by category
  const itemsByCategory = categories
    .map(category => ({
      category,
      items: filteredItems
        .filter(item => item.categoryId === category.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    }))
    .filter(group => group.items.length > 0)
    .sort((a, b) => (a.category.order || 0) - (b.category.order || 0));

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-sand-100 dark:from-espresso-950 dark:to-espresso-900">
      {/* Decorative elements */}
      <div className="decorative-dots inset-0" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)' }} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/80 to-lagoon-900/80 dark:from-espresso-900/90 dark:to-espresso-950/90" />
        <div className="absolute inset-0 bg-[url('/images/coffee-beans-pattern.png')] opacity-5 dark:opacity-[0.02]" />
        
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Meniu Cafeteca</h1>
            <p className="text-xl text-sand-100 mb-8">Descoperă aromele noastre selecționate cu grijă</p>
          </motion.div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-12 -mt-12 relative z-20">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-espresso-800 rounded-2xl shadow-lg p-6 mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută în meniu..."
                  className="w-full px-4 py-3 rounded-lg border border-sand-200 dark:border-espresso-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-espresso-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-3 text-sand-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <MenuFilters 
              filters={filters} 
              setFilters={setFilters}
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-16">
          <AnimatePresence>
            {itemsByCategory.length > 0 ? (
              itemsByCategory.map(({ category, items }) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  id={`category-${category.id}`}
                >
                  <MenuCategorySection category={category} items={items} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Nu s-au găsit produse care să corespundă criteriilor tale.</h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      vegetarian: false,
                      vegan: false,
                      glutenFree: false,
                      spicy: false,
                      popular: false,
                    });
                  }}
                  className="mt-4 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
