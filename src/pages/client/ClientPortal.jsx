import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FaRocket, FaClock, FaCheckCircle, FaCommentDots, FaSignOutAlt,
  FaHourglassHalf, FaPhoneAlt, FaEnvelope, FaPaperPlane,
  FaExclamationCircle, FaHome, FaPaperclip, FaBars, FaChevronDown, FaDownload
} from 'react-icons/fa';
import logo from '../../assets/dominion softwares main logo.png';
import MediaPreviewGrid from '../../components/MediaPreviewGrid';

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-50/60 p-4 rounded-xl border border-orange-200 mt-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md shrink-0">
          <FaClock className="text-white text-base" />
        </div>
        <div>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Project Deadline</p>
          <p className="text-sm text-gray-800 font-bold">{new Date(deadline).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-orange-100 pt-3 sm:pt-0">
        <span className="text-[10px] text-gray-500 uppercase font-bold mb-0.5 sm:mb-1">Time Remaining</span>
        <span className="font-mono text-sm font-bold text-primary bg-white px-2.5 py-1 rounded border border-orange-200 min-w-[110px] text-center shadow-xs">
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
      toast.success('Feedback submitted successfully!');
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
    <div className="min-h-screen flex flex-col bg-[#FDF6EF]">
      {/* Top Bar — sleek black/orange styled header matching dominion softwares */}
      <header className="px-6 py-4 flex items-center justify-between shadow-lg relative z-20" style={{ backgroundColor: '#1B1B1B' }}>
        {/* Top orange line highlight */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary-light to-primary" />
        
        <div className="flex items-center gap-3">
          <img src={logo} alt="Dominion Softwares" className="h-9 w-auto object-contain" />
          <div className="min-w-0">
            <span className="text-white font-extrabold text-base tracking-wide">DOMINION</span>
            <span className="text-primary font-extrabold text-base tracking-wide ml-1">SOFTWARES</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="text-gray-300 text-sm hidden md:block">
            Logged in as: <span className="text-white font-semibold">{user?.name}</span>
          </span>

          {/* Go To Home Button */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-all duration-300 hover:shadow-sm"
            title="Go to website homepage"
          >
            <FaHome className="text-primary text-xs sm:text-sm" />
            <span>Home</span>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-dark px-3.5 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_2px_10px_rgba(255,95,0,0.3)] cursor-pointer"
            title="Sign Out"
          >
            <FaSignOutAlt className="text-xs sm:text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Application List */}
        <aside className="w-72 shrink-0 border-r overflow-y-auto hidden md:block" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0D8' }}>
          <div className="p-4 border-b" style={{ borderColor: '#E5E0D8' }}>
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
                        : 'bg-white border-gray-100 hover:border-orange-300 hover:bg-orange-50/40'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 text-sm truncate">{app.organizationName}</p>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Mobile Application Switcher */}
          {!loading && applications.length > 0 && (
            <div className="md:hidden mb-6 bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-xs">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Select Project / Application
              </label>
              <div className="relative">
                <select
                  value={selectedApp?._id || ''}
                  onChange={(e) => {
                    const app = applications.find(a => a._id === e.target.value);
                    if (app) setSelectedApp(app);
                  }}
                  className="w-full bg-[#FDF6EF] text-heading text-sm font-semibold rounded-xl border border-[#E5E0D8] p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Choose a Project --</option>
                  {applications.map(app => (
                    <option key={app._id} value={app._id}>
                      {app.organizationName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-body-light">
                  <FaChevronDown className="text-xs" />
                </div>
              </div>
            </div>
          )}

          {!selectedApp ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-24">
              <FaRocket className="text-5xl mb-4 opacity-20 text-primary animate-pulse" />
              <p className="font-semibold text-gray-500">Select a project from the list to view details</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedApp._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                {/* Header */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-heading">{selectedApp.organizationName}</h1>
                  <p className="text-body-light text-xs sm:text-sm mt-0.5">{selectedApp.organizationType}</p>
                </div>

                {/* Status Banner */}
                <div className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border ${statusCfg.color} bg-white shadow-sm`}>
                  <div className="mt-1 shrink-0">
                    <statusCfg.icon className="text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base">{statusCfg.label}</p>
                    <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">{statusCfg.desc}</p>
                  </div>
                </div>

                {/* Countdown Timer — only for approved with deadline */}
                {selectedApp.status === 'approved' && selectedApp.deadline && (
                  <CountdownTimer deadline={selectedApp.deadline} />
                )}
                {selectedApp.status === 'approved' && !selectedApp.deadline && (
                  <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 text-xs sm:text-sm text-orange-700 flex items-center gap-3">
                    <FaClock className="shrink-0 text-primary" />
                    <span>Your project is in development. The admin will set a deadline soon.</span>
                  </div>
                )}

                {/* Project Summary */}
                <div className="bg-white rounded-2xl border border-border-light shadow-xs p-4 sm:p-6">
                  <h2 className="font-bold text-heading text-base mb-4 pb-2 border-b border-gray-100">Project Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-[10px] text-body-light uppercase font-bold mb-0.5">Primary Goal</p>
                      <p className="text-heading font-medium">{selectedApp.primaryGoal || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-body-light uppercase font-bold mb-0.5">Timeline Requested</p>
                      <p className="text-heading font-medium">{selectedApp.timeline || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-body-light uppercase font-bold mb-0.5">Budget</p>
                      <p className="text-heading font-medium">{selectedApp.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-body-light uppercase font-bold mb-0.5">Submitted On</p>
                      <p className="text-heading font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-body-light uppercase font-bold mb-2">Project Description</p>
                    <p className="text-body text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-[#FDF6EF] p-4 rounded-xl border border-[#F5EDE4]">
                      {selectedApp.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Attached Requirements Media & Assets */}
                <div className="bg-white rounded-2xl border border-border-light shadow-xs p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h2 className="font-bold text-heading text-base flex items-center gap-2">
                      <FaPaperclip className="text-primary" /> Attached Media & Requirements
                    </h2>
                    {selectedApp.attachedFiles && selectedApp.attachedFiles.length > 0 && (
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {selectedApp.attachedFiles.length} file(s)
                      </span>
                    )}
                  </div>

                  {selectedApp.attachedFiles && selectedApp.attachedFiles.length > 0 ? (
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-border-light">
                      <MediaPreviewGrid compact={false} files={selectedApp.attachedFiles} />
                    </div>
                  ) : (
                    <p className="text-xs text-body-light italic bg-orange-50/45 p-4 rounded-xl border border-orange-100/60 leading-relaxed">
                      No media files were attached during submission. If you want to send us competitor references, voice notes, walkthrough videos, or logo design assets, you can discuss them below in the chat or email them directly.
                    </p>
                  )}
                </div>

                {/* Conversation Thread */}
                <div className="bg-white rounded-2xl border border-border-light shadow-xs p-4 sm:p-6">
                  <h2 className="font-bold text-heading text-base mb-1 flex items-center gap-2">
                    <FaCommentDots className="text-primary" /> Communication History
                  </h2>
                  <p className="text-xs text-body-light mb-4 pb-4 border-b border-gray-100">Use this to reply to the admin, request clarifications, or provide additional information.</p>

                  <div className="flex flex-col space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
                    {selectedApp.messages && selectedApp.messages.length > 0 ? (
                      selectedApp.messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'client' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-body-light mt-1 px-1">{new Date(msg.createdAt).toLocaleString()} • {msg.sender === 'client' ? 'You' : 'Dominion Team'}</span>
                        </div>
                      ))
                    ) : (
                      /* Legacy Fallback */
                      <>
                        {selectedApp.adminFeedback ? (
                          <div className="flex flex-col items-start">
                            <div className="max-w-[85%] p-3 bg-gray-100 border border-gray-200 text-gray-800 rounded-xl rounded-bl-none text-xs sm:text-sm">
                              <p className="whitespace-pre-wrap">{selectedApp.adminFeedback}</p>
                            </div>
                            <span className="text-[9px] text-body-light mt-1 px-1">Legacy • Dominion Team</span>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-body-light italic text-center my-4 bg-gray-50 p-4 rounded-xl">
                            No messages yet. We'll update you here when there's news about your project.
                          </p>
                        )}
                        
                        {selectedApp.clientFeedback && (
                          <div className="flex flex-col items-end mt-4">
                            <div className="max-w-[85%] p-3 bg-primary text-white rounded-xl rounded-br-none text-xs sm:text-sm">
                              <p className="whitespace-pre-wrap">{selectedApp.clientFeedback}</p>
                            </div>
                            <span className="text-[9px] text-body-light mt-1 px-1">Legacy • You</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <textarea
                    rows="4"
                    className="w-full border border-border-light rounded-xl px-4 py-3 text-xs sm:text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-gray-50 placeholder-body-light/60"
                    placeholder="Type your message or feedback here..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim() || submittingFeedback}
                    className="mt-3 flex items-center gap-2 bg-primary hover:bg-primary-dark hover:shadow-[0_2px_10px_rgba(255,95,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-sm cursor-pointer"
                  >
                    {submittingFeedback ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <FaPaperPlane />}
                    Send Feedback to Admin
                  </button>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl border border-border-light shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="font-semibold text-heading text-sm sm:text-base mb-0.5">Need to speak to someone?</p>
                    <p className="text-xs sm:text-sm text-body-light">Reach out to us directly via email or phone.</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <a href="mailto:dominionsoftwares001@gmail.com" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-heading px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all">
                      <FaEnvelope className="text-primary" /> Email
                    </a>
                    <a href="tel:+254700000000" className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:shadow-[0_2px_10px_rgba(255,95,0,0.25)]">
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
