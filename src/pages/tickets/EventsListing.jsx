import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaTicketAlt, FaQrcode, FaShareAlt, FaChartBar,
  FaArrowRight, FaCalendarPlus, FaUserShield, FaMobileAlt, FaFileDownload
} from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/tickets/EventCard';

const categories = [
  'All', 'conference', 'concert', 'workshop', 'seminar', 'church-event',
  'sports', 'charity', 'festival', 'networking', 'other'
];

const categoryLabels = {
  'All': 'All Events',
  'conference': 'Conferences',
  'concert': 'Concerts',
  'workshop': 'Workshops',
  'seminar': 'Seminars',
  'church-event': 'Church Events',
  'sports': 'Sports',
  'charity': 'Charity',
  'festival': 'Festivals',
  'networking': 'Networking',
  'other': 'Other',
};

const howItWorks = [
  {
    icon: FaCalendarPlus,
    title: 'Create Your Event',
    desc: 'Set up your event in minutes — add details, ticket types, pricing, and customize what info you collect from attendees.',
  },
  {
    icon: FaShareAlt,
    title: 'Share Your Link',
    desc: 'Get a unique event link to share on WhatsApp, social media, email, or anywhere. Attendees register and buy tickets instantly.',
  },
  {
    icon: FaFileDownload,
    title: 'Attendees Get E-Tickets',
    desc: 'Buyers receive a professional PDF ticket (ID-card size) with a QR code and ticket number — ready to print or show on phone.',
  },
  {
    icon: FaQrcode,
    title: 'Scan & Validate at Entry',
    desc: 'Use your phone camera to scan QR codes at the door, or search by ticket number. Each ticket can only be used once.',
  },
];

export default function EventsListing() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/events', { params });
        setEvents(data.data.events || []);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [search, category, page]);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-dark to-dark-light py-16 md:py-24">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaTicketAlt className="text-primary text-2xl" />
              <span className="text-primary text-sm uppercase tracking-[0.2em] font-semibold">
                Dominion Tickets
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
              Your Events,{' '}
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              The all-in-one ticketing platform for event organizers. Create events, sell tickets,
              and validate entry — all from one place. No app downloads, no complications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user?.role === 'organizer' || user?.role === 'admin' ? (
                <Link to="/dashboard/events/new" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-4">
                  <FaCalendarPlus /> Create an Event
                </Link>
              ) : (
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-4">
                  <FaCalendarPlus /> Start Selling Tickets
                </Link>
              )}
              <a href="#browse-events" className="border-2 border-white/30 text-white px-10 py-4 rounded-full font-semibold
                         hover:bg-white/10 transition-all duration-300 text-center cursor-pointer flex items-center justify-center gap-2">
                Browse Events <FaArrowRight className="text-sm" />
              </a>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <FaUserShield className="text-primary" />
              <span>Secure & Reliable</span>
            </div>
            <div className="flex items-center gap-2">
              <FaQrcode className="text-primary" />
              <span>QR Code Validation</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMobileAlt className="text-primary" />
              <span>Works on Any Phone</span>
            </div>
            <div className="flex items-center gap-2">
              <FaFileDownload className="text-primary" />
              <span>PDF E-Tickets</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (for organizers) ===== */}
      <section className="py-16 bg-cream-dark/40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">For Event Organizers</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-heading mt-3 mb-4">
              How Dominion Tickets Works
            </h2>
            <p className="text-body max-w-2xl mx-auto text-lg">
              Whether you're hosting a conference, concert, church event, or workshop —
              set up professional ticketing in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border-light text-center
                           hover:shadow-lg hover:shadow-primary/8 hover:border-primary/25
                           hover:-translate-y-1 transition-all duration-400 group"
              >
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto
                                  group-hover:bg-primary group-hover:shadow-[0_4px_15px_rgba(232,130,12,0.3)] transition-all duration-300">
                    <step.icon className="text-primary text-xl group-hover:text-white transition-colors" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold
                                   flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-heading mb-2">{step.title}</h3>
                <p className="text-body text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA for organizers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-10 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Sell Tickets for Your Event?
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Sign up as an event organizer — it's free to get started. Create your first event,
              set up ticket types, and share your link. It's that simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user?.role === 'organizer' || user?.role === 'admin' ? (
                <Link to="/dashboard/events/new" className="bg-white text-primary px-8 py-3.5 rounded-full font-bold
                           hover:bg-heading hover:text-white transition-all duration-300 shadow-lg text-center cursor-pointer
                           flex items-center justify-center gap-2">
                  <FaCalendarPlus /> Create Your Event Now
                </Link>
              ) : user ? (
                <Link to="/register" className="bg-white text-primary px-8 py-3.5 rounded-full font-bold
                           hover:bg-heading hover:text-white transition-all duration-300 shadow-lg text-center cursor-pointer
                           flex items-center justify-center gap-2">
                  <FaCalendarPlus /> Register as Event Organizer
                </Link>
              ) : (
                <Link to="/register" className="bg-white text-primary px-8 py-3.5 rounded-full font-bold
                           hover:bg-heading hover:text-white transition-all duration-300 shadow-lg text-center cursor-pointer
                           flex items-center justify-center gap-2">
                  <FaCalendarPlus /> Get Started — It's Free
                </Link>
              )}
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold
                         hover:bg-white hover:text-primary transition-all duration-300 text-center cursor-pointer">
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-heading mb-4">
              Everything You Need to Run Successful Events
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-border-light">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <FaTicketAlt className="text-green-600 text-lg" />
              </div>
              <h3 className="font-bold text-heading mb-2">Multiple Ticket Types</h3>
              <p className="text-body text-sm leading-relaxed">
                Create VIP, Regular, Early Bird, Group — as many ticket types as you need, each with its own price and quantity.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-border-light">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <FaQrcode className="text-blue-600 text-lg" />
              </div>
              <h3 className="font-bold text-heading mb-2">QR Code Entry</h3>
              <p className="text-body text-sm leading-relaxed">
                Every ticket gets a unique QR code. Scan with your phone camera at the door — no special equipment needed.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-border-light">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <FaChartBar className="text-purple-600 text-lg" />
              </div>
              <h3 className="font-bold text-heading mb-2">Sales Dashboard</h3>
              <p className="text-body text-sm leading-relaxed">
                Track sales in real-time, view attendee lists, download reports, and see exactly how your event is performing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BROWSE EVENTS ===== */}
      <section id="browse-events" className="section-padding bg-cream-dark/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-heading mb-3">
              Browse Upcoming Events
            </h2>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Find events near you and grab your tickets before they sell out.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-body-light" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search events by name, location, or category..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border-light bg-white text-heading text-lg
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-body border border-border-light hover:border-primary hover:text-primary'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border-light">
              <FaTicketAlt className="text-5xl text-body-light mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-heading mb-2">No events found</h3>
              <p className="text-body mb-6 max-w-md mx-auto">
                {search || category !== 'All'
                  ? 'Try adjusting your search or filters.'
                  : 'No upcoming events right now. Are you an event organizer? Create your first event!'}
              </p>
              {!search && category === 'All' && (
                <Link
                  to={user?.role === 'organizer' ? '/dashboard/events/new' : '/register'}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FaCalendarPlus /> {user?.role === 'organizer' ? 'Create an Event' : 'Start Selling Tickets'}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    page === p
                      ? 'bg-primary text-white'
                      : 'bg-white text-body border border-border-light hover:border-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-heading mb-4">
            Have an Event Coming Up?
          </h2>
          <p className="text-body text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of organizers using Dominion Tickets to sell event tickets professionally.
            Set up in minutes, not days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user?.role === 'organizer' ? '/dashboard/events/new' : '/register'}
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              Get Started <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
          <p className="text-body-light text-sm mt-6">
            Powered by <span className="font-semibold text-heading">Dominion Softwares Ltd</span> | Tel: 0740 881 485
          </p>
        </div>
      </section>
    </div>
  );
}
