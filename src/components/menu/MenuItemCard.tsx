import { useState } from 'react';
import { MenuItem } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      <div 
        className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer ${
          isExpanded ? 'ring-2 ring-amber-300' : ''
        }`}
        onClick={toggleExpand}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <span className="font-semibold text-amber-700 whitespace-nowrap ml-4">
              {formatPrice(item.price)}
            </span>
          </div>
          
          <div className="mt-1">
            {item.description && (
              <div 
                className={`text-sm text-gray-500 transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'max-h-96 mt-2' : 'max-h-0'
                }`}
              >
                {item.description}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-wrap gap-1">
            {item.isPopular && (
              <Badge variant="default" className="bg-amber-100 text-amber-800">
                Popular
              </Badge>
            )}
            {item.isNew && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Nou
              </Badge>
            )}
            {item.isVegetarian && (
              <Badge variant="outline" className="border-green-300 text-green-700">
                Vegetarian
              </Badge>
            )}
            {item.isVegan && (
              <Badge variant="outline" className="border-green-400 text-green-800">
                Vegan
              </Badge>
            )}
            {item.isGlutenFree && (
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                Fără gluten
              </Badge>
            )}
                {item.isSpicy && (
                  <Badge variant="outline" className="border-red-200 text-red-700">
                    Picant
                  </Badge>
                )}
              </div>
              
              {item.description && (
                <button 
                  className="text-amber-600 hover:text-amber-800 transition-colors p-1 -mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand();
                  }}
                  aria-label={isExpanded ? 'Ascunde detalii' : 'Arată detalii'}
                >
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
