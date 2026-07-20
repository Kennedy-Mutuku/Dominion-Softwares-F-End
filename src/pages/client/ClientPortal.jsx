import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FaRocket, FaClock, FaCheckCircle, FaCommentDots, FaSignOutAlt,
  FaHourglassHalf, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaHome,
  FaExclamationCircle
} from 'react-icons/fa';

const STATUS_CONFIG = {
  pending: { label: 'Under Review', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: FaHourglassHalf, desc: 'Our team is currently reviewing your application.' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaPhoneAlt, desc: 'We have reached out to you. Please check your email or phone.' },
  feedback: { label: 'Feedback Needed', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FaCommentDots, desc: 'The admin has left notes and needs your feedback or clarification.' },
  approved: { label: 'Approved — In Development', color: 'bg-green-100 text-green-700 border-green-200', icon: FaRocket, desc: 'Your project has been approved and is actively being developed!' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: FaCheckCircle, desc: 'This project has been completed or closed.' },
};

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) { setTimeLeft('Deadline Reached'); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-200 mt-4">
      <div className="w-12 h-12 bg-orange-500 rotate-45 rounded-xl flex items-center justify-center shadow-md shrink-0">
        <div className="-rotate-45 text-white font-extrabold text-sm text-center leading-tight">
          {timeLeft.split(' ')[0] || '—'}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Project Deadline</p>
        <p className="text-sm text-heading font-semibold">{new Date(deadline).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-body-light uppercase font-bold mb-1">Time Remaining</span>
        <span className="font-mono text-sm font-bold text-orange-600 bg-white px-2 py-1 rounded border border-orange-200 min-w-[120px] text-center">
          {timeLeft === 'Deadline Reached' ? <span className="text-red-500">Past Due</span> : timeLeft}
        </span>
      </div>
    </div>
  );
}

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/applications/my-applications');
      setApplications(data.data || []);
      if (data.data?.length > 0) setSelectedApp(data.data[0]);
    } catch (err) {
      toast.error('Could not load your applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      const { data } = await api.put(`/applications/${selectedApp._id}/feedback`, { clientFeedback: feedbackText });
      toast.success('Feedback submitted!');
      setFeedbackText('');
      setApplications(apps => apps.map(a => a._id === selectedApp._id ? data.data : a));
      setSelectedApp(data.data);
    } catch (err) {
      toast.error('Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const statusCfg = selectedApp ? (STATUS_CONFIG[selectedApp.status] || STATUS_CONFIG.pending) : null;

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#1B1B1B] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <FaRocket className="text-white text-sm" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">Dominion</span>
            <span className="text-orange-500 font-extrabold text-base"> Softwares</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm hidden sm:block">Welcome, <span className="text-white font-semibold">{user?.name}</span></span>
          <Link to="/" className="text-gray-400 hover:text-white transition-colors" title="Go to website">
            <FaHome />
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm" title="Sign Out">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Application List */}
        <aside className="w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">My Projects</p>
          </div>
          {loading ? (
            <div className="space-y-3 p-4">
              {[1,2].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              <FaHourglassHalf className="text-3xl mx-auto mb-2 opacity-30" />
              No applications yet.
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {applications.map(app => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const IconComp = cfg.icon;
                return (
                  <button
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedApp?._id === app._id
                        ? 'bg-orange-50 border-orange-500 border-l-4'
                        : 'bg-white border-gray-100 hover:border-orange-300'
                    }`}
                  >
                    <p className="font-semibold text-heading text-sm truncate">{app.organizationName}</p>
                    <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${cfg.color}`}>
                      <IconComp className="text-[9px]" /> {cfg.label}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedApp ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-24">
              <FaRocket className="text-5xl mb-4 opacity-20" />
              <p className="font-medium text-gray-500">Select a project to view details</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedApp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                {/* Header */}
                <div>
                  <h1 className="text-2xl font-extrabold text-heading">{selectedApp.organizationName}</h1>
                  <p className="text-body text-sm mt-0.5">{selectedApp.organizationType}</p>
                </div>

                {/* Status Banner */}
                <div className={`flex items-start gap-4 p-5 rounded-xl border ${statusCfg.color} bg-white shadow-sm`}>
                  <div className="mt-0.5">
                    <statusCfg.icon className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-base">{statusCfg.label}</p>
                    <p className="text-sm mt-0.5 opacity-80">{statusCfg.desc}</p>
                  </div>
                </div>

                {/* Countdown Timer — only for approved with deadline */}
                {selectedApp.status === 'approved' && selectedApp.deadline && (
                  <CountdownTimer deadline={selectedApp.deadline} />
                )}
                {selectedApp.status === 'approved' && !selectedApp.deadline && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700 flex items-center gap-3">
                    <FaClock className="shrink-0" />
                    <span>Your project is in development. The admin will set a deadline soon.</span>
                  </div>
                )}

                {/* Project Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <h2 className="font-bold text-heading mb-4 pb-2 border-b border-gray-100">Project Summary</h2>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Primary Goal</p>
                      <p className="text-heading">{selectedApp.primaryGoal || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Timeline Requested</p>
                      <p className="text-heading">{selectedApp.timeline || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Budget</p>
                      <p className="text-heading">{selectedApp.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Submitted On</p>
                      <p className="text-heading">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Project Description</p>
                    <p className="text-body text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {selectedApp.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedApp.adminFeedback && (
                  <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-5">
                    <h2 className="font-bold text-heading mb-3 flex items-center gap-2">
                      <FaExclamationCircle className="text-orange-500" /> Message from Dominion Team
                    </h2>
                    <p className="text-sm text-body leading-relaxed italic bg-orange-50 p-4 rounded-lg border border-orange-100">
                      "{selectedApp.adminFeedback}"
                    </p>
                  </div>
                )}

                {/* Client Feedback Box */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <h2 className="font-bold text-heading mb-1 flex items-center gap-2">
                    <FaCommentDots className="text-orange-500" /> Your Feedback
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">Use this to reply to the admin, request clarifications, or provide additional information.</p>

                  {selectedApp.clientFeedback && (
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 text-sm text-body">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Your Last Message</p>
                      <p className="italic">"{selectedApp.clientFeedback}"</p>
                    </div>
                  )}

                  <textarea
                    rows="4"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-gray-50"
                    placeholder="Type your message or feedback here..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim() || submittingFeedback}
                    className="mt-3 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {submittingFeedback ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <FaPaperPlane />}
                    Send Feedback
                  </button>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="font-semibold text-heading mb-1">Need to speak to someone?</p>
                    <p className="text-sm text-body-light">Reach out to us directly via email or phone.</p>
                  </div>
                  <div className="flex gap-3">
                    <a href="mailto:mutukukennedy5@gmail.com" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-heading px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                      <FaEnvelope className="text-orange-500" /> Email
                    </a>
                    <a href="tel:+254700000000" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                      <FaPhoneAlt /> Call Us
                    </a>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
