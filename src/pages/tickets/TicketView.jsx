import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import api from '../../utils/api';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

export default function TicketView() {
  const { ticketCode } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await api.get(`/tickets/${ticketCode}`);
        setTicket(data.data);
      } catch (error) {
        toast.error('Ticket not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketCode]);

  const handleDownload = async () => {
    if (!ticket) return;
    try {
      await generateTicketPDF([ticket], ticket.event);
      toast.success('Ticket downloaded!');
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

  if (!ticket) return null;

  const validationUrl = `${window.location.origin}/api/tickets/validate/qr/${ticket.ticketCode}`;

  return (
    <div className="section-padding">
      <div className="max-w-md mx-auto">
        <Link to="/my-tickets" className="flex items-center gap-2 text-body hover:text-heading mb-6 transition-colors">
          <FaArrowLeft /> Back to My Tickets
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          {/* Status badge */}
          <div className="mb-4">
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${
              ticket.status === 'valid' ? 'text-green-600 bg-green-50' :
              ticket.status === 'used' ? 'text-gray-600 bg-gray-100' :
              'text-red-600 bg-red-50'
            }`}>
              {ticket.status === 'valid' ? 'VALID' : ticket.status === 'used' ? 'USED' : 'CANCELLED'}
            </span>
          </div>

          {/* Event info */}
          <h2 className="text-xl font-bold text-heading mb-1">{ticket.eventTitle}</h2>
          <p className="text-primary font-semibold mb-4">{ticket.typeName}</p>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl border border-border-light inline-block mb-4">
            <QRCodeSVG
              value={validationUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>

          {/* Ticket Number */}
          <p className="text-lg font-mono font-bold text-heading mb-1">{ticket.ticketNumber}</p>
          <p className="text-xs text-body-light mb-6">Present this QR code at the entrance</p>

          {/* Attendee Info */}
          <div className="text-left bg-cream rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-body-light">Name</span>
              <span className="text-sm font-medium text-heading">{ticket.ownerName}</span>
            </div>
            {ticket.attendeeData && Object.entries(ticket.attendeeData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-body-light">{key}</span>
                <span className="text-sm font-medium text-heading">{value}</span>
              </div>
            ))}
          </div>

          {/* Download */}
          <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
            <FaDownload /> Download PDF Ticket
          </button>

          {/* Branding */}
          <div className="mt-6 pt-4 border-t border-border-light">
            <p className="text-xs font-bold text-heading">DOMINION TICKETS</p>
            <p className="text-xs text-body-light">Dominion Softwares Ltd | Tel: 0740 881 485</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
