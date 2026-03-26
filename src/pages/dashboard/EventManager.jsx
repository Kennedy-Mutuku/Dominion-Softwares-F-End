import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlusCircle, FaEdit, FaTrash, FaEye, FaShareAlt, FaChartBar,
  FaUsers, FaRocket, FaCopy, FaWhatsapp, FaExclamationTriangle,
  FaCheckCircle, FaLink, FaExternalLinkAlt
} from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(null); // event ID that has share panel open

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/dashboard/events');
      setEvents(data.data || []);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await api.patch(`/events/${eventId}/status`, { status: newStatus });
      toast.success(`Event ${newStatus}!`);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Delete this draft event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const copyShareLink = (slug) => {
    const url = `${window.location.origin}/e/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Event link copied!');
  };

  const shareWhatsApp = (slug, title) => {
    const url = `${window.location.origin}/e/${slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this event: ${title}\n${url}`)}`, '_blank');
  };

  const statusConfig = {
    draft: {
      color: 'bg-amber-50 text-amber-700 border border-amber-200',
      label: 'Draft',
      icon: FaExclamationTriangle,
    },
    published: {
      color: 'bg-green-50 text-green-700 border border-green-200',
      label: 'Live',
      icon: FaCheckCircle,
    },
    cancelled: {
      color: 'bg-red-50 text-red-600 border border-red-200',
      label: 'Cancelled',
      icon: null,
    },
    completed: {
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
      label: 'Completed',
      icon: null,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">My Events</h1>
        <Link to="/dashboard/events/new" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <FaPlusCircle /> New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border-light">
          <FaPlusCircle className="text-5xl text-body-light mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-heading mb-2">No events yet</h3>
          <p className="text-body mb-6">Create your first event to start selling tickets</p>
          <Link to="/dashboard/events/new" className="btn-primary">Create Event</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, i) => {
            const status = statusConfig[event.status] || statusConfig.draft;
            const StatusIcon = status.icon;
            const isShareOpen = shareOpen === event._id;
            const eventUrl = `${window.location.origin}/e/${event.slug}`;

            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-border-light overflow-hidden"
              >
                {/* Draft banner */}
                {event.status === 'draft' && (
                  <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-3">
                    <FaExclamationTriangle className="text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-800 flex-1">
                      <span className="font-semibold">Not published yet</span> — this event is not visible to the public.
                      Publish it to start selling tickets.
                    </p>
                    <button
                      onClick={() => handleStatusChange(event._id, 'published')}
                      className="shrink-0 bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold
                                 hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FaRocket className="text-xs" /> Publish Now
                    </button>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Event info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-heading text-lg">{event.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                          {StatusIcon && <StatusIcon className="text-[10px]" />}
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-body-light">
                        {new Date(event.date.start).toLocaleDateString('en-US', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })} • {event.venue?.name}, {event.venue?.city}
                      </p>

                      {/* Stats row */}
                      <div className="flex gap-6 mt-3 text-sm">
                        <span className="text-body">
                          <span className="font-semibold text-heading">{event.stats?.totalSold || 0}</span>
                          /{event.stats?.totalCapacity || 0} sold
                        </span>
                        <span className="text-body">
                          <span className="font-semibold text-heading">{event.stats?.orders || 0}</span> orders
                        </span>
                        <span className="text-body">
                          <span className="font-semibold text-primary">KES {(event.stats?.revenue || 0).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {event.status === 'published' && (
                        <>
                          <button
                            onClick={() => setShareOpen(isShareOpen ? null : event._id)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg
                                       hover:bg-primary-dark transition-colors cursor-pointer"
                          >
                            <FaShareAlt /> Share Link
                          </button>
                          <a
                            href={`/e/${event.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <FaExternalLinkAlt /> View Page
                          </a>
                        </>
                      )}
                      <Link
                        to={`/dashboard/events/${event._id}/sales`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FaChartBar /> Sales
                      </Link>
                      <Link
                        to={`/dashboard/events/${event._id}/attendees`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
                      >
                        <FaUsers /> Attendees
                      </Link>
                      <Link
                        to={`/dashboard/events/${event._id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-cream text-heading rounded-lg hover:bg-cream-dark transition-colors"
                      >
                        <FaEdit /> Edit
                      </Link>
                      {event.status === 'draft' && (
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Share Panel (slides open) */}
                  <AnimatePresence>
                    {isShareOpen && event.status === 'published' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border-light">
                          <p className="text-sm font-medium text-heading mb-3 flex items-center gap-2">
                            <FaLink className="text-primary" /> Event Link — share this with your audience
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 bg-cream rounded-lg px-4 py-2.5 font-mono text-sm text-heading truncate border border-border-light">
                              {eventUrl}
                            </div>
                            <button
                              onClick={() => copyShareLink(event.slug)}
                              className="shrink-0 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold text-sm
                                         hover:bg-primary-dark transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <FaCopy /> Copy
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => shareWhatsApp(event.slug, event.title)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium
                                         hover:bg-green-600 transition-colors cursor-pointer"
                            >
                              <FaWhatsapp /> Share on WhatsApp
                            </button>
                            <button
                              onClick={() => copyShareLink(event.slug)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-heading text-sm font-medium
                                         hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              <FaCopy /> Copy Link
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
