export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  isFeatured?: boolean;
  capacity?: number;
  contactphone?: string;
  contactemail?: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Seară de Jazz',
    description: 'Bucură-te de o seară relaxantă cu sunete de jazz live în compania unei cafele de specialitate.',
    date: '2023-11-15',
    time: '20:00',
    location: 'Cafeteca Cismigiu',
    isFeatured: true,
    capacity: 30
  },
  {
    id: '2',
    title: 'Atelier de Latte Art',
    description: 'Învață secretele din spatele artei latte de la barista noștri experimentați.',
    date: '2023-11-22',
    time: '18:00',
    location: 'Cafeteca Cismigiu',
    capacity: 10
  },
  {
    id: '3',
    title: 'Degustare de Cafele Speciale',
    description: 'Descoperă arome unice din întreaga lume într-o seară dedicată iubitorilor de cafea.',
    date: '2023-12-05',
    time: '19:00',
    location: 'Cafeteca Cismigiu',
    isFeatured: true,
    capacity: 20
  }
];
