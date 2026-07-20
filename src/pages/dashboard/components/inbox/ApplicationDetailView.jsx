import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaCommentDots, FaEnvelope, FaPhone, FaArchive, FaInbox } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

export default function ApplicationDetailView({
  selectedItem,
  activeTab,
  setSelectedItem,
  handleUpdateStatus,
  isUpdating
}) {
  const [internalNote, setInternalNote] = useState('');

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

            {/* Internal Admin Notes */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-heading border-b border-border-light pb-2">Internal Admin Notes</h3>
              <div className="bg-orange-50/30 p-5 rounded-lg border border-orange-100">
                <p className="text-xs text-orange-600 uppercase font-semibold mb-2">Previous Note / Feedback</p>
                {selectedItem.adminFeedback ? (
                  <p className="text-sm text-heading italic mb-4 p-3 bg-white border border-orange-200 rounded-md">
                    "{selectedItem.adminFeedback}"
                  </p>
                ) : (
                  <p className="text-sm text-body-light italic mb-4">No notes recorded yet.</p>
                )}
                
                <textarea
                  className="w-full p-3 text-sm border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  rows="3"
                  placeholder="Write a new internal note or status feedback..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                ></textarea>
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
