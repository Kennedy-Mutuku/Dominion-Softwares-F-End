import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function ApplicationFilters({
  activeTab,
  setActiveTab,
  counts,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}) {
  return (
    <div className="mb-6 space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-light">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'applications' ? 'text-orange-500' : 'text-body hover:text-heading'
          }`}
        >
          Applications ({counts.applications})
          {activeTab === 'applications' && (
            <motion.div layoutId="inboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'messages' ? 'text-orange-500' : 'text-body hover:text-heading'
          }`}
        >
          Messages ({counts.messages})
          {activeTab === 'messages' && (
            <motion.div layoutId="inboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'archived' ? 'text-orange-500' : 'text-body hover:text-heading'
          }`}
        >
          Archived ({counts.archived})
          {activeTab === 'archived' && (
            <motion.div layoutId="inboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-body-light text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-40">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-body-light text-xs" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-white border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="feedback">In Review / Feedback</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative w-full sm:w-40">
            <FaSort className="absolute left-3 top-1/2 -translate-y-1/2 text-body-light text-xs" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-white border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
