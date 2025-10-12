import Link from 'next/link';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 1,
    name: 'Cafea proaspăt prăjită',
    description: 'Selecție de cafele de specialitate din întreaga lume',
    image: '/images/coffee-category.jpg',
    link: '/menu#coffee',
  },
  {
    id: 2,
    name: 'Deserturi delicioase',
    description: 'Prăjituri proaspete și dulciuri de casă',
    image: '/images/desserts-category.jpg',
    link: '/menu#desserts',
  },
  {
    id: 3,
    name: 'Sandwich-uri proaspete',
    description: 'Preparate la comandă cu ingrediente de calitate',
    image: '/images/sandwiches-category.jpg',
    link: '/menu#sandwiches',
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Descoperă aromele noastre
          </h2>
          <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-amber-200 relative">
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center text-amber-700">
                  <span className="text-lg font-medium">Imagine: {category.name}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-amber-900">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button asChild variant="outline" className="mt-2">
                  <Link href={category.link}>Vezi selecția</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
