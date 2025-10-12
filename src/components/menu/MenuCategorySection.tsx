import { MenuCategory, MenuItem } from '@/types/menu';
import { MenuItemCard } from './MenuItemCard';
import { slugify } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MenuCategorySectionProps {
  category: MenuCategory;
  items: MenuItem[];
  searchQuery?: string;
  filters?: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
    popular: boolean;
  };
}

export function MenuCategorySection({ category, items, searchQuery = '', filters }: MenuCategorySectionProps) {
  if (!items.length) return null;

  // Filter items based on search query and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = !filters || (
      (!filters.vegetarian || item.isVegetarian) &&
      (!filters.vegan || item.isVegan) &&
      (!filters.glutenFree || item.isGlutenFree) &&
      (!filters.spicy || item.isSpicy) &&
      (!filters.popular || item.isPopular)
    );
    
    return matchesSearch && matchesFilters;
  });

  if (filteredItems.length === 0) return null;

  return (
    <section id={slugify(category.name)} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 md:p-8 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-espresso-800 dark:text-sand-100 mb-1">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sand-600 dark:text-sand-400">{category.description}</p>
            )}
          </div>
          <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
            {filteredItems.some(item => item.isPopular) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 dark:from-amber-900/30 dark:to-amber-800/20 dark:text-amber-300">
                Popular
              </span>
            )}
            {filteredItems.some(item => item.isNew) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-800/20 dark:text-green-300">
                New
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <MenuItemCard 
                item={item}
                className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
