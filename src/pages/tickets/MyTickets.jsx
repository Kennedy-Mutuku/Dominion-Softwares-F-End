import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCalendarAlt, FaDownload, FaQrcode } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../utils/api';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data.data || []);
      } catch (error) {
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-heading mb-8">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <FaTicketAlt className="text-5xl text-body-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-heading mb-2">No tickets yet</h3>
            <p className="text-body mb-6">Browse events and get your first ticket!</p>
            <Link to="/tickets" className="btn-primary">Browse Events</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket, i) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FaTicketAlt className="text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading">{ticket.eventTitle}</h3>
                    <p className="text-sm text-primary font-medium">{ticket.typeName}</p>
                    <p className="text-xs text-body-light mt-1">#{ticket.ticketNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      ticket.status === 'valid' ? 'text-green-600 bg-green-50' :
                      ticket.status === 'used' ? 'text-gray-600 bg-gray-100' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                    <Link
                      to={`/my-tickets/${ticket.ticketCode}`}
                      className="w-10 h-10 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"
                      title="View Ticket"
                    >
                      <FaQrcode className="text-heading" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
