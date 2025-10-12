'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Filter, Search, X } from 'lucide-react';

export interface FilterState {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
  popular: boolean;
}

export interface MenuFiltersProps {
  filters: FilterState;
  setFilters?: (filters: FilterState) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

export function MenuFilters({ 
  filters, 
  setFilters,
  onSearch,
  onFilterChange,
  className 
}: MenuFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleFilterChange = (filter: keyof FilterState) => {
    const newFilters = {
      ...filters,
      [filter]: !filters[filter],
    };
    
    if (setFilters) {
      setFilters(newFilters);
    }
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    setSearchQuery('');
    const resetFilters = {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false,
      popular: false,
    };
    
    if (setFilters) {
      setFilters(resetFilters);
    }
    onFilterChange?.(resetFilters);
    onSearch?.('');
  };

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Caută în meniu..."
              className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>Filtre</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filtrează după:</h3>
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 text-amber-700 hover:bg-amber-100"
            >
              <X className="h-4 w-4 mr-1" />
              Resetează
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('popular')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${
                filters.popular ? 'bg-amber-100 text-amber-800 hover:bg-amber-100/90' : ''
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleFilterChange('vegetarian')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${
                filters.vegetarian ? 'bg-green-100 text-green-800 hover:bg-green-100/90' : ''
              }`}
            >
              Vegetarian
            </button>
            <button
              onClick={() => handleFilterChange('vegan')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${
                filters.vegan ? 'bg-green-200 text-green-800 hover:bg-green-200/90' : ''
              }`}
            >
              Vegan
            </button>
            <button
              onClick={() => handleFilterChange('glutenFree')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${
                filters.glutenFree ? 'bg-blue-100 text-blue-800 hover:bg-blue-100/90' : ''
              }`}
            >
              Fără gluten
            </button>
            <button
              onClick={() => handleFilterChange('spicy')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${
                filters.spicy ? 'bg-red-100 text-red-800 hover:bg-red-100/90' : ''
              }`}
            >
              Picant
            </button>
          </div>
        </div>
      )}
    </div>
  );
