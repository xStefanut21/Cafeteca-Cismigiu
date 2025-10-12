'use client';

import { useState } from 'react';
import { mockEvents } from '@/types/events';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Get unique months from events
  const months = ['all', ...new Set(mockEvents.map(event => 
    new Date(event.date).toLocaleString('ro-RO', { month: 'long' })
  ))];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = selectedMonth === 'all' || 
                        new Date(event.date).toLocaleString('ro-RO', { month: 'long' }).toLowerCase() === selectedMonth.toLowerCase();
    
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Evenimente</h1>
        <p className="text-lg text-amber-800 max-w-2xl mx-auto">
          Descoperă evenimentele noastre speciale și întâlnește-i pe alți iubitori de cafea
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Caută evenimente..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month.toLowerCase()}>
                {month === 'all' ? 'Toate lunile' : month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nu s-au găsit evenimente</h3>
          <p className="text-gray-500">Încearcă să modifici criteriile de căutare.</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-amber-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-amber-900 mb-4">Nu rata niciun eveniment</h3>
        <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
          Abonează-te la newsletter-ul nostru pentru a fi la curent cu toate evenimentele și noutățile Cafeteca Cismigiu.
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <Input 
            type="email" 
            placeholder="Adresa ta de email" 
            className="flex-1"
          />
          <button className="bg-amber-700 text-white px-6 py-2 rounded-md hover:bg-amber-800 transition-colors">
            Abonează-te
          </button>
        </div>
      </div>
    </div>
  );
}
