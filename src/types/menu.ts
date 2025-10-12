export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  image?: string;
  order: number;
  isPopular?: boolean;
  isNew?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isSpicy?: boolean;
}

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}

// Mock data for development
export const mockMenuData: MenuData = {
  categories: [
    {
      id: '1',
      name: 'Cafea',
      description: 'Cafea proaspăt prăjită din boabe de calitate',
      order: 1,
    },
    {
      id: '2',
      name: 'Băuturi Răcoritoare',
      description: 'Băuturi răcoritoare și sucuri naturale',
      order: 2,
    },
    {
      id: '3',
      name: 'Deserturi',
      description: 'Deserturi proaspete și delicioase',
      order: 3,
    },
  ],
  items: [
    {
      id: '101',
      name: 'Espresso',
      description: 'Cafea italiană puternică și aromată',
      price: 8.5,
      categoryId: '1',
      isAvailable: true,
      order: 1,
      isPopular: true,
    },
    {
      id: '102',
      name: 'Cappuccino',
      description: 'Espresso cu lapte și spumă de lapte',
      price: 12.0,
      categoryId: '1',
      isAvailable: true,
      order: 2,
      isPopular: true,
    },
    {
      id: '201',
      name: 'Limonadă proaspătă',
      description: 'Limonadă naturală cu mentă și lămâie verde',
      price: 10.0,
      categoryId: '2',
      isAvailable: true,
      order: 1,
      isVegetarian: true,
      isVegan: true,
    },
    {
      id: '301',
      name: 'Cheesecake cu fructe de pădure',
      description: 'Cheesecake cremos cu topping de fructe de pădure proaspete',
      price: 15.0,
      categoryId: '3',
      isAvailable: true,
      order: 1,
      isVegetarian: true,
    },
  ],
};
