import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AttendeeList() {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const { data } = await api.get(`/events/${id}/attendees`);
        setTickets(data.data || []);
      } catch (error) {
        toast.error('Failed to load attendees');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  const filtered = tickets.filter((t) =>
    (t.ownerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.ticketNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.ownerEmail || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusIcon = (status) => {
    if (status === 'valid') return <FaClock className="text-yellow-500" />;
    if (status === 'used') return <FaCheckCircle className="text-green-500" />;
    return <FaTimesCircle className="text-red-500" />;
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
      <Link to="/dashboard/events" className="flex items-center gap-2 text-body hover:text-heading mb-4 transition-colors text-sm">
        <FaArrowLeft /> Back to Events
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Attendees</h1>
          <p className="text-body-light text-sm">{tickets.length} total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-body-light" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or ticket number..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light bg-white text-heading
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-light overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-body-light border-b border-border-light">
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Ticket Type</th>
              <th className="px-5 py-3 font-medium">Ticket #</th>
              <th className="px-5 py-3 font-medium">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr key={ticket._id} className="border-b border-border-light/50 hover:bg-cream/50">
                <td className="px-5 py-3">{statusIcon(ticket.status)}</td>
                <td className="px-5 py-3 font-medium text-heading">{ticket.ownerName}</td>
                <td className="px-5 py-3 text-body-light">{ticket.ownerEmail}</td>
                <td className="px-5 py-3">{ticket.typeName}</td>
                <td className="px-5 py-3 font-mono text-xs">{ticket.ticketNumber}</td>
                <td className="px-5 py-3 text-body-light">
                  {ticket.usedAt ? new Date(ticket.usedAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-body-light">
                  {search ? 'No matching attendees' : 'No attendees yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
