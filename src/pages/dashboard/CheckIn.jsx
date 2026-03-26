import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTicketAlt } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function CheckIn() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [validateResult, setValidateResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketNumber.trim()) return;

    setSearching(true);
    setValidateResult(null);
    try {
      const { data } = await api.get(`/tickets/search/lookup?number=${ticketNumber.trim()}`);
      setResults(data.data || []);
      if (data.data.length === 0) {
        toast.error('No tickets found');
      }
    } catch (error) {
      toast.error('Search failed');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleValidate = async (ticket) => {
    try {
      const { data } = await api.put(`/tickets/validate/number/${ticket.ticketNumber}`);
      setValidateResult({ ticketId: ticket._id, ...data });

      // Update local state
      setResults(prev => prev.map(t =>
        t._id === ticket._id ? { ...t, status: data.status === 'valid' ? 'used' : t.status, usedAt: new Date() } : t
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Validation failed');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      valid: 'bg-green-50 text-green-600',
      used: 'bg-gray-100 text-gray-600',
      cancelled: 'bg-red-50 text-red-600',
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.valid}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-heading mb-2">Check-In</h1>
      <p className="text-body-light mb-6">Search by ticket number and mark as used</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-body-light" />
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
              placeholder="Enter ticket number (e.g. DOM-A3F8-7K2X)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-light bg-white text-heading font-mono
                         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button type="submit" disabled={searching} className="btn-primary px-6 disabled:opacity-50">
            {searching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-3">
        {results.map((ticket) => {
          const isJustValidated = validateResult?.ticketId === ticket._id;

          return (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl border p-5 ${
                isJustValidated && validateResult.status === 'valid'
                  ? 'border-green-300 bg-green-50'
                  : isJustValidated && validateResult.status === 'already_used'
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-border-light'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <FaTicketAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-lg">{ticket.ownerName}</p>
                    <p className="text-sm text-primary font-medium">{ticket.typeName}</p>
                    <p className="text-xs text-body-light font-mono mt-1">{ticket.ticketNumber}</p>
                    {ticket.ownerEmail && (
                      <p className="text-xs text-body-light mt-0.5">{ticket.ownerEmail}</p>
                    )}
                    <p className="text-xs text-body-light mt-0.5">{ticket.eventTitle}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {statusBadge(ticket.status)}
                  {ticket.status === 'valid' && (
                    <button
                      onClick={() => handleValidate(ticket)}
                      className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg
                                 hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <FaCheckCircle /> Mark as Used
                    </button>
                  )}
                  {ticket.status === 'used' && ticket.usedAt && (
                    <p className="text-xs text-body-light">
                      Used {new Date(ticket.usedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Validation feedback */}
              <AnimatePresence>
                {isJustValidated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border-light"
                  >
                    {validateResult.status === 'valid' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle /> <span className="font-semibold">Checked in successfully!</span>
                      </div>
                    )}
                    {validateResult.status === 'already_used' && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <FaExclamationTriangle /> <span className="font-semibold">{validateResult.message}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
