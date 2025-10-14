'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, X, Calendar, Clock, MapPin, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { uploadEventImage, deleteEventImage } from '@/utils/fileUpload';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string | null;
  capacity?: number | null;
  contactphone?: string;
  contactemail?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        if (eventsData) {
          setEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Eroare la încărcarea evenimentelor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentEvent) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Te rog să selectezi doar fișiere imagine (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fișierul trebuie să fie mai mic de 5MB');
      return;
    }

    try {
      setIsUploading(true);

      const uploadResult = await uploadEventImage(file, currentEvent.id);

      if (uploadResult.success && uploadResult.url) {
        setCurrentEvent({
          ...currentEvent,
          image: uploadResult.url
        });
        toast.success('Imagine încărcată cu succes!');
      } else {
        toast.error(uploadResult.error || 'Eroare la încărcarea imaginii');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Eroare la încărcarea imaginii');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sunteți sigur că doriți să ștergeți acest eveniment?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setEvents(events.filter(event => event.id !== id));
        toast.success('Eveniment șters cu succes!');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Eroare la ștergerea evenimentului: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    try {
      setIsLoading(true);

      // Validate required fields
      if (!currentEvent.title || !currentEvent.date || !currentEvent.time || !currentEvent.location) {
        throw new Error('Titlul, data, ora și locația sunt obligatorii');
      }

      console.log('Saving event:', currentEvent);

      const eventData = {
        title: currentEvent.title,
        description: currentEvent.description || '',
        date: currentEvent.date,
        time: currentEvent.time,
        location: currentEvent.location,
        image: currentEvent.image || null,
        capacity: currentEvent.capacity || null,
        contactphone: currentEvent.contactphone || null,
        contactemail: currentEvent.contactemail || null,
        is_active: currentEvent.is_active !== false,
        updated_at: new Date().toISOString()
      };

      console.log('Event data to save:', eventData);

      if (currentEvent.id) {
        // Update existing event
        console.log('Updating existing event with ID:', currentEvent.id);

        // If we're updating an existing event and changing the image, delete the old one
        const existingEvent = events.find(e => e.id === currentEvent.id);
        if (existingEvent?.image && existingEvent.image !== currentEvent.image) {
          await deleteEventImage(existingEvent.image);
        }

        const { data, error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', currentEvent.id)
          .select()
          .single();

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }

        console.log('Event updated successfully:', data);
        setEvents(events.map(e => e.id === currentEvent.id ? data : e));
        toast.success('Eveniment actualizat cu succes!');
      } else {
        // Add new event
        console.log('Creating new event');
        const { data, error } = await supabase
          .from('events')
          .insert([{
            ...eventData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        console.log('Event created successfully:', data);
        setEvents([...events, data]);
        toast.success('Eveniment adăugat cu succes!');
      }

      setIsDialogOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      let errorMessage = 'Eroare la salvarea evenimentului: ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Eroare necunoscută';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Evenimente</h1>
            <p className="text-muted-foreground">
              Gestionează evenimentele cafenelei
            </p>
          </div>
          <Button onClick={() => {
            setCurrentEvent({
              title: '',
              description: '',
              date: '',
              time: '',
              location: '',
              capacity: 0,
              contactphone: '',
              contactemail: '',
              is_active: true
            });
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă eveniment
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută evenimente..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eveniment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data și ora
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locație
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acțiuni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {event.image && (
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="rounded-full object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          {event.description && (
                            <div className="text-sm text-gray-500">
                              {event.description.length > 50
                                ? `${event.description.substring(0, 50)}...`
                                : event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-amber-600" />
                        {new Date(event.date).toLocaleDateString('ro-RO')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-1 text-amber-600" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.is_active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.is_active !== false ? 'Activ' : 'Inactiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-amber-600 hover:text-amber-900 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Event Form Dialog */}
        {isDialogOpen && currentEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {currentEvent.id ? 'Editează eveniment' : 'Adaugă eveniment nou'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setCurrentEvent(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titlu eveniment *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={currentEvent.title || ''}
                      onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descriere
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={currentEvent.description || ''}
                      onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Data *
                      </label>
                      <input
                        type="date"
                        id="date"
                        required
                        value={currentEvent.date || ''}
                        onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Ora *
                      </label>
                      <input
                        type="time"
                        id="time"
                        required
                        value={currentEvent.time || ''}
                        onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Locație *
                    </label>
                    <input
                      type="text"
                      id="location"
                      required
                      value={currentEvent.location || ''}
                      onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Imagine eveniment
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />
                      {isUploading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      )}
                    </div>
                    {currentEvent.image && (
                      <div className="mt-2">
                        <img
                          src={currentEvent.image}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Selectează o imagine pentru eveniment (JPG, PNG, max 5MB)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                        Capacitate
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        min="0"
                        value={currentEvent.capacity || ''}
                        onChange={(e) => setCurrentEvent({...currentEvent, capacity: parseInt(e.target.value) || undefined})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactphone" className="block text-sm font-medium text-gray-700">
                        Telefon contact
                      </label>
                      <input
                        type="tel"
                        id="contactphone"
                        value={currentEvent.contactphone || ''}
                        onChange={(e) => setCurrentEvent({...currentEvent, contactphone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactemail" className="block text-sm font-medium text-gray-700">
                        Email contact
                      </label>
                      <input
                        type="email"
                        id="contactemail"
                        value={currentEvent.contactemail || ''}
                        onChange={(e) => setCurrentEvent({...currentEvent, contactemail: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={currentEvent.is_active !== false}
                      onChange={(e) => setCurrentEvent({...currentEvent, is_active: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Eveniment activ
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setCurrentEvent(null);
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Anulează
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      {currentEvent.id ? 'Actualizează' : 'Adaugă'} eveniment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
