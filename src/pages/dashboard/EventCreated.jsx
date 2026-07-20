import { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheckCircle, FaRocket, FaShareAlt, FaCopy, FaEdit, FaChartBar,
  FaExclamationTriangle, FaWhatsapp, FaEnvelope, FaArrowRight,
  FaTicketAlt, FaQrcode, FaUsers
} from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EventCreated() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug, title } = location.state || {};
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const eventUrl = `${window.location.origin}/e/${slug}`;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.patch(`/events/${id}/status`, { status: 'published' });
      setPublished(true);
      toast.success('Event is now live!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success('Link copied to clipboard!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this event: ${title}\n${eventUrl}`)}`, '_blank');
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`You're invited: ${title}`)}&body=${encodeURIComponent(`Check out this event and get your tickets:\n\n${eventUrl}`)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-3xl font-bold text-heading mb-2">Event Created Successfully!</h1>
        <p className="text-body text-lg">
          <span className="font-semibold text-heading">"{title || 'Your event'}"</span> is ready.
        </p>
      </motion.div>

      {/* IMPORTANT: Publish Step */}
      {!published ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <FaExclamationTriangle className="text-amber-600 text-xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-heading mb-2">
                One More Step — Publish Your Event
              </h2>
              <p className="text-body mb-4">
                Your event is saved as a <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">draft</span>.
                It won't be visible to the public until you publish it. When you're ready, hit the button below to go live.
              </p>
              <ul className="text-sm text-body space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                  <span>Once published, attendees can view your event and buy tickets</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                  <span>You'll get a shareable link to send to your audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                  <span>You can still edit the event after publishing</span>
                </li>
              </ul>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full sm:w-auto bg-green-500 text-white px-8 py-3.5 rounded-full font-bold
                           hover:bg-green-600 hover:shadow-lg transition-all duration-300 cursor-pointer
                           disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {publishing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaRocket /> Publish Event Now
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Published Success + Share Options */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-6"
        >
          {/* Live Badge */}
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-bold text-lg">Your Event is LIVE!</span>
            </div>
            <p className="text-body">Attendees can now view your event and purchase tickets.</p>
          </div>

          {/* Shareable Link */}
          <div className="bg-white rounded-2xl border border-border-light p-6">
            <h3 className="font-bold text-heading mb-3 flex items-center gap-2">
              <FaShareAlt className="text-primary" /> Share Your Event Link
            </h3>
            <p className="text-sm text-body mb-4">
              Send this link to your audience — anyone who opens it can view the event and buy tickets directly.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-cream rounded-xl px-4 py-3 font-mono text-sm text-heading truncate border border-border-light">
                {eventUrl}
              </div>
              <button
                onClick={copyLink}
                className="shrink-0 bg-primary text-white px-5 py-3 rounded-xl font-semibold
                           hover:bg-primary-dark transition-all cursor-pointer flex items-center gap-2"
              >
                <FaCopy /> Copy
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white
                           font-medium hover:bg-green-600 transition-colors cursor-pointer text-sm"
              >
                <FaWhatsapp /> WhatsApp
              </button>
              <button
                onClick={shareEmail}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white
                           font-medium hover:bg-blue-600 transition-colors cursor-pointer text-sm"
              >
                <FaEnvelope /> Email
              </button>
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-700 text-white
                           font-medium hover:bg-gray-800 transition-colors cursor-pointer text-sm"
              >
                <FaCopy /> Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-border-light p-6 mb-6"
      >
        <h3 className="font-bold text-heading mb-4">What's Next?</h3>
        <div className="space-y-3">
          <Link
            to={`/dashboard/events/${id}/edit`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <FaEdit className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-heading text-sm">Edit Event Details</p>
              <p className="text-xs text-body-light">Update info, ticket types, or registration fields</p>
            </div>
            <FaArrowRight className="text-body-light text-xs" />
          </Link>

          <Link
            to={`/dashboard/events/${id}/sales`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <FaChartBar className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-heading text-sm">View Sales & Analytics</p>
              <p className="text-xs text-body-light">Track ticket sales, revenue, and orders in real-time</p>
            </div>
            <FaArrowRight className="text-body-light text-xs" />
          </Link>

          <Link
            to={`/dashboard/events/${id}/attendees`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <FaUsers className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-heading text-sm">View Attendee List</p>
              <p className="text-xs text-body-light">See who's coming, their registration details</p>
            </div>
            <FaArrowRight className="text-body-light text-xs" />
          </Link>

          <Link
            to="/dashboard/scanner"
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FaQrcode className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-heading text-sm">Ticket Scanner</p>
              <p className="text-xs text-body-light">Ready for event day — scan QR codes at the entrance</p>
            </div>
            <FaArrowRight className="text-body-light text-xs" />
          </Link>
        </div>
      </motion.div>

      {/* Back to Events */}
      <div className="text-center">
        <Link
          to="/dashboard/events"
          className="text-primary font-semibold hover:underline text-sm inline-flex items-center gap-2"
        >
          <FaTicketAlt /> Go to My Events
        </Link>
      </div>
    </div>
  );
}
