import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import toast from 'react-hot-toast';

import ApplicationList from './components/inbox/ApplicationList';
import ApplicationDetailView from './components/inbox/ApplicationDetailView';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, feedback = '', deadline) => {
    setIsUpdating(true);
    try {
      const payload = { status, adminFeedback: feedback };
      if (deadline !== undefined) payload.deadline = deadline;
      
      await api.put(`/applications/${id}/status`, payload);
      toast.success(`Application marked as ${status}`);
      
      setApplications(apps => apps.map(app => {
        if (app._id === id) {
          const updated = { ...app, status, adminFeedback: feedback };
          if (deadline !== undefined) updated.deadline = deadline;
          return updated;
        }
        return app;
      }));
      
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => {
          const updated = { ...prev, status, adminFeedback: feedback };
          if (deadline !== undefined) updated.deadline = deadline;
          return updated;
        });
      }
    } catch (error) {
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendFeedback = async (id, feedback) => {
    try {
      const currentApp = applications.find(a => a._id === id);
      if (!currentApp) return;
      await api.put(`/applications/${id}/status`, { status: currentApp.status, adminFeedback: feedback });
      toast.success('Feedback sent to client!');
      setApplications(apps => apps.map(app =>
        app._id === id ? { ...app, adminFeedback: feedback } : app
      ));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => ({ ...prev, adminFeedback: feedback }));
      }
    } catch (error) {
      toast.error('Failed to send feedback to client.');
    }
  };

  const processedData = useMemo(() => {
    let currentList = applications;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      currentList = currentList.filter(item => {
        const title = item.organizationName || item.name || '';
        const email = item.email || '';
        const desc = item.projectDescription || '';
        return title.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q);
      });
    }

    if (statusFilter !== 'all') {
      currentList = currentList.filter(item => (item.status || 'pending') === statusFilter);
    }

    currentList.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return currentList;
  }, [applications, searchQuery, statusFilter, sortBy]);

  return (
    <div className="flex flex-col h-full bg-[#F7F5F0]">
      <div className="px-6 pt-6 pb-2">
        <div className="text-xs text-body-light mb-1 font-semibold uppercase tracking-wider">
          Dashboard <span className="mx-1">&gt;</span> Client Applications
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-body-light text-sm" />
              <input
                type="text"
                placeholder="Search applications..."
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
                  <option value="feedback">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="closed">Closed</option>
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

        <div className="flex flex-col lg:flex-row gap-6 pb-6 min-h-0 flex-1">
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 overflow-y-auto pr-1 custom-scrollbar">
            <ApplicationList
              loading={loading}
              activeTab="applications"
              list={processedData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className="flex-1 min-w-0 hidden lg:block relative">
            <AnimatePresence mode="wait">
              <ApplicationDetailView
                selectedItem={selectedItem}
                activeTab="applications"
                setSelectedItem={setSelectedItem}
                handleUpdateStatus={handleUpdateStatus}
                handleSendFeedback={handleSendFeedback}
                isUpdating={isUpdating}
              />
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {selectedItem && (
              <div className="lg:hidden fixed inset-0 z-50 bg-[#F7F5F0] overflow-y-auto">
                <div className="p-4 min-h-screen">
                  <ApplicationDetailView
                    selectedItem={selectedItem}
                    activeTab="applications"
                    setSelectedItem={setSelectedItem}
                    handleUpdateStatus={handleUpdateStatus}
                    handleSendFeedback={handleSendFeedback}
                    isUpdating={isUpdating}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
