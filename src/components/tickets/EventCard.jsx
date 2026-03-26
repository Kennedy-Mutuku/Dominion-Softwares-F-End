import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { format } from 'date-fns';

export default function EventCard({ event }) {
  const startDate = new Date(event.date?.start);
  const minPrice = event.ticketTypes?.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : null;
  const maxPrice = event.ticketTypes?.length > 0
    ? Math.max(...event.ticketTypes.map(t => t.price))
    : null;

  const priceDisplay = () => {
    if (minPrice === null) return 'Free';
    if (minPrice === 0 && maxPrice === 0) return 'Free';
    if (minPrice === maxPrice) return `KES ${minPrice.toLocaleString()}`;
    if (minPrice === 0) return `Free - KES ${maxPrice.toLocaleString()}`;
    return `KES ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
  };

  const categoryLabels = {
    'conference': 'Conference',
    'concert': 'Concert',
    'workshop': 'Workshop',
    'seminar': 'Seminar',
    'church-event': 'Church Event',
    'sports': 'Sports',
    'charity': 'Charity',
    'festival': 'Festival',
    'networking': 'Networking',
    'other': 'Other',
  };

  return (
    <Link to={`/e/${event.slug}`} className="block group">
      <div className="card p-0 overflow-hidden hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          {event.images?.cover ? (
            <img
              src={event.images.cover}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaTicketAlt className="text-5xl text-primary/30" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-heading text-xs font-semibold px-3 py-1 rounded-full">
              {categoryLabels[event.category] || event.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {priceDisplay()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-body">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary text-xs shrink-0" />
              <span>{format(startDate, 'EEE, MMM d, yyyy • h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary text-xs shrink-0" />
              <span className="line-clamp-1">{event.venue?.name}, {event.venue?.city}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
