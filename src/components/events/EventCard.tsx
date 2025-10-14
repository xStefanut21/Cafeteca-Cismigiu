import type { Event } from '@/types/events';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'd MMMM yyyy', { locale: ro });
  const formattedTime = format(new Date(`2000-01-01T${event.time}`), 'HH:mm');

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="h-48 bg-amber-100 relative">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-800">
            <span className="text-lg font-medium">Imagine eveniment</span>
          </div>
        )}
        {event.isFeatured && (
          <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Recomandat
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{event.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 text-amber-600 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 text-amber-600 mr-2" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 text-amber-600 mr-2" />
            <span>{event.location}</span>
          </div>
          {event.capacity && (
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 text-amber-600 mr-2" />
              <span>Locuri disponibile: {event.capacity}</span>
            </div>
          )}
        </div>
        
        {/* Contact Information */}
        <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
          {event.contactphone && (
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 text-amber-600 mr-2" />
              <a href={`tel:${event.contactphone}`} className="text-amber-600 hover:underline">
                {event.contactphone}
              </a>
            </div>
          )}
          {event.contactemail && (
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 text-amber-600 mr-2" />
              <a href={`mailto:${event.contactemail}`} className="text-amber-600 hover:underline">
                {event.contactemail}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
