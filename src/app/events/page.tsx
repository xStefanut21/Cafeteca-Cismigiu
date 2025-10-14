'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EventCard } from '@/components/events/EventCard';

import type { Event } from '@/types/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('date');

        if (eventsError) {
          throw eventsError;
        }

        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Evenimente</h1>
        <p className="text-lg text-amber-800 max-w-2xl mx-auto">
          Descoperă evenimentele noastre speciale și întâlnește-i pe alți iubitori de cafea
        </p>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Deocamdată nu există evenimente anunțate</h3>
          <p className="text-gray-500">Verifică în curând pentru evenimente noi și interesante!</p>
        </div>
      )}
    </div>
  );
}
