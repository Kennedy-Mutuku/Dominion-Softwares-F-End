import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaTicketAlt } from 'react-icons/fa';
import api from '../../utils/api';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownload = async () => {
    if (!order) return;
    try {
      await generateTicketPDF(order.tickets, order.event);
      toast.success('Tickets downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-heading mb-2">Booking Confirmed!</h1>
          <p className="text-body mb-2">Order #{order.order?.orderNumber}</p>
          <p className="text-body-light mb-8">
            Your {order.tickets?.length || 0} ticket{(order.tickets?.length || 0) > 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-heading">{order.event?.title}</span>
          </p>

          {/* Tickets Preview */}
          <div className="space-y-3 mb-8">
            {(order.tickets || []).map((ticket) => (
              <div key={ticket._id} className="card flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FaTicketAlt className="text-primary text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-heading">{ticket.typeName}</p>
                  <p className="text-sm text-body-light">Ticket #{ticket.ticketNumber}</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Valid
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2">
              <FaDownload /> Download Tickets (PDF)
            </button>
            <Link to="/my-tickets" className="btn-outline flex items-center justify-center gap-2">
              <FaTicketAlt /> View My Tickets
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
