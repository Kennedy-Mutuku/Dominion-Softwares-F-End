import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaCommentDots, FaEnvelope, FaPhone, FaArchive, FaInbox, FaClock, FaPaperPlane } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const ProjectCountdown = ({ item, handleUpdateDeadline }) => {
  const { deadline, timeline, createdAt } = item;

  const autoDeadline = React.useMemo(() => {
    if (!timeline || !createdAt) return '';
    const baseDate = new Date(createdAt);
    if (timeline === '1 - 2 Weeks') baseDate.setDate(baseDate.getDate() + 14);
    else if (timeline === '1 - 3 Months') baseDate.setMonth(baseDate.getMonth() + 3);
    else if (timeline === '3 - 6 Months') baseDate.setMonth(baseDate.getMonth() + 6);
    else return '';
    return baseDate.toISOString().split('T')[0];
  }, [timeline, createdAt]);

  const [newDeadline, setNewDeadline] = useState(autoDeadline);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (autoDeadline && !newDeadline) {
      setNewDeadline(autoDeadline);
    }
  }, [autoDeadline]);

  useEffect(() => {
    if (!deadline) return;
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(deadline);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Deadline Reached');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) {
    return (
      <div className="flex items-center gap-3 bg-orange-50/50 p-4 rounded-lg border border-orange-200">
        <div className="w-10 h-10 bg-orange-500 rotate-45 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <FaClock className="-rotate-45 text-white text-lg" />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 ml-2">
          <div className="flex-1">
            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-0.5">Set Project Deadline</p>
            <p className="text-xs text-body-light">Max timeline given by customer: <span className="font-semibold text-heading">{timeline || 'None'}</span></p>
          </div>
          <div className="flex gap-2">
            <input 
              type="date" 
              max={autoDeadline || undefined}
              min={new Date().toISOString().split('T')[0]}
              className="text-sm border border-orange-200 rounded px-2 py-1.5 focus:outline-none focus:border-orange-500 bg-white"
              value={newDeadline}
              onChange={e => setNewDeadline(e.target.value)}
            />
            <button 
              onClick={() => handleUpdateDeadline(newDeadline)}
              disabled={!newDeadline}
              className="bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-lg border border-orange-200">
      <div className="w-12 h-12 bg-orange-500 rotate-45 rounded-xl flex items-center justify-center shadow-md shrink-0">
        <div className="-rotate-45 text-white font-extrabold text-sm text-center leading-tight">
          {timeLeft === 'Deadline Reached' ? '0d' : timeLeft.split(' ')[0]}
        </div>
      </div>
      <div className="ml-2">
        <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-0.5">Project Deadline</p>
        <p className="text-base text-heading font-semibold">{new Date(deadline).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <span className="text-[10px] text-body-light uppercase tracking-wider font-bold mb-1">Time Remaining</span>
        <span className="text-sm font-bold text-orange-600 font-mono bg-white px-2 py-1 rounded border border-orange-200 shadow-sm min-w-[120px] text-center">
          {timeLeft === 'Deadline Reached' ? <span className="text-red-500">Past Due</span> : timeLeft}
        </span>
      </div>
    </div>
  );
};

export default function ApplicationDetailView({
  selectedItem,
  activeTab,
  setSelectedItem,
  handleUpdateStatus,
  handleSendFeedback,
  isUpdating
}) {
  const [internalNote, setInternalNote] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const onSendFeedback = async () => {
    if (!internalNote.trim()) return;
    setIsSendingFeedback(true);
    await handleSendFeedback(selectedItem._id, internalNote);
    setIsSendingFeedback(false);
    setInternalNote('');
  };

  if (!selectedItem) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50 bg-white rounded-xl border border-border-light h-full min-h-[500px]"
      >
        <FaInbox className="text-6xl mb-4 text-body-light" />
        <p className="text-heading font-medium">Select an application from the list to review details and take action.</p>
      </motion.div>
    );
  }

  const isApplication = activeTab === 'applications' || (selectedItem.projectDescription && activeTab === 'archived');
  const title = isApplication ? selectedItem.organizationName : selectedItem.name;

  return (
    <motion.div
      key={selectedItem._id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white border border-border-light rounded-xl shadow-sm flex flex-col h-[calc(100vh-140px)]"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border-light p-6 rounded-t-xl shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-heading">{title}</h2>
              {isApplication && <StatusBadge status={selectedItem.status} />}
            </div>
            <p className="text-sm text-body mt-1">
              {isApplication ? 
                (selectedItem.clientType === 'church' ? 'Church / Ministry' : 
                 selectedItem.clientType === 'business' ? 'Business / Corporate' : 
                 'Organization') + ' • ' + selectedItem.organizationType 
                : 'Contact Inquiry'}
            </p>
          </div>
          <button 
            onClick={() => setSelectedItem(null)} 
            className="p-2 text-body-light hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${selectedItem.email}`} className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
            <FaEnvelope /> Reply via Email
          </a>
          {selectedItem.phone && (
            <a href={`tel:${selectedItem.phone}`} className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <FaPhone /> Call Client
            </a>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Summary Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-border-light">
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-body-light uppercase font-semibold mb-1">Contact Person</p>
            <p className="font-medium text-heading">{isApplication ? selectedItem.contactPerson : selectedItem.name}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-body-light uppercase font-semibold mb-1">Date Received</p>
            <p className="text-body font-medium">{new Date(selectedItem.createdAt).toLocaleString()}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-body-light uppercase font-semibold mb-1">Email</p>
            <p className="text-body font-medium truncate" title={selectedItem.email}>{selectedItem.email}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-body-light uppercase font-semibold mb-1">Phone</p>
            <p className="text-body font-medium">{selectedItem.phone || 'Not provided'}</p>
          </div>
        </div>

        {isApplication ? (
          <>
            {selectedItem.status === 'approved' && (
              <ProjectCountdown 
                item={selectedItem}
                handleUpdateDeadline={(newDeadline) => handleUpdateStatus(selectedItem._id, selectedItem.status, selectedItem.adminFeedback, newDeadline)}
              />
            )}

            {/* Project Overview */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-heading border-b border-border-light pb-2">Project Overview</h3>
              
              <div className="bg-white p-5 rounded-lg border border-border-light shadow-sm space-y-5 text-sm">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Primary Goal</p>
                    <p className="text-heading font-medium">{selectedItem.primaryGoal || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Target Audience</p>
                    <p className="text-heading font-medium">{selectedItem.targetAudience || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-body-light uppercase font-semibold mb-2">Detailed Requirements</p>
                  <p className="text-body whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md">
                    {selectedItem.projectDescription}
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-5 pt-4 border-t border-border-light">
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Budget Range</p>
                    <p className="text-heading font-medium">{selectedItem.budget || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Est. Timeline</p>
                    <p className="text-heading font-medium">{selectedItem.timeline || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Payment Integration</p>
                    <p className="text-heading font-medium">{selectedItem.paymentIntegration || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Admin Notes — Send Feedback to Client */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-heading border-b border-border-light pb-2">Message to Client</h3>
              <div className="bg-orange-50/30 p-5 rounded-lg border border-orange-100">
                <p className="text-xs text-orange-600 uppercase font-semibold mb-2">Previously Sent Feedback</p>
                {selectedItem.adminFeedback ? (
                  <div className="text-sm text-heading italic mb-4 p-3 bg-white border border-orange-200 rounded-md">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 not-italic">Current message shown to client:</p>
                    <p>"{selectedItem.adminFeedback}"</p>
                  </div>
                ) : (
                  <p className="text-sm text-body-light italic mb-4">No feedback sent to client yet.</p>
                )}

                {/* Client's feedback to admin */}
                {selectedItem.clientFeedback && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Client's Reply:</p>
                    <p className="text-sm text-blue-800 italic">"{selectedItem.clientFeedback}"</p>
                  </div>
                )}
                
                <textarea
                  className="w-full p-3 text-sm border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  rows="3"
                  placeholder="Write a message or feedback to send to the client..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                ></textarea>

                <button
                  onClick={onSendFeedback}
                  disabled={!internalNote.trim() || isSendingFeedback}
                  className="mt-3 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {isSendingFeedback ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : <FaPaperPlane />}
                  Send Feedback to Client
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-base font-bold text-heading border-b border-border-light pb-2 mb-4">Message Content</h3>
            <div className="bg-white p-6 rounded-lg border border-border-light text-sm text-body whitespace-pre-wrap leading-relaxed shadow-sm">
              {selectedItem.message}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {isApplication && (
        <div className="p-6 border-t border-border-light bg-gray-50 rounded-b-xl flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={() => handleUpdateStatus(selectedItem._id, 'approved', internalNote)}
            disabled={isUpdating || selectedItem.status === 'approved'}
            className="flex-1 min-w-[150px] bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FaCheckCircle /> Approve
          </button>
          
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
             <select 
                className="bg-white border border-border-light py-2.5 px-4 rounded-xl text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => {
                  if (e.target.value) {
                    handleUpdateStatus(selectedItem._id, e.target.value, internalNote);
                    e.target.value = ''; // Reset select after action
                  }
                }}
                defaultValue=""
             >
                <option value="" disabled>Change Status...</option>
                <option value="pending">Mark Pending</option>
                <option value="contacted">Mark Contacted</option>
                <option value="feedback">In Review</option>
             </select>
          </div>

          <button 
            onClick={() => handleUpdateStatus(selectedItem._id, 'rejected', internalNote)}
            disabled={isUpdating || selectedItem.status === 'rejected'}
            className="px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            Reject
          </button>
          
          <button 
            onClick={() => handleUpdateStatus(selectedItem._id, 'closed', internalNote)}
            disabled={isUpdating || selectedItem.status === 'closed'}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FaArchive /> Archive
          </button>
        </div>
      )}
    </motion.div>
  );
}
