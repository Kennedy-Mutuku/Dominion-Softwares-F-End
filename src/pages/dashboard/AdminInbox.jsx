import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// Sub-components
import ApplicationFilters from './components/inbox/ApplicationFilters';
import ApplicationList from './components/inbox/ApplicationList';
import ApplicationDetailView from './components/inbox/ApplicationDetailView';

export default function AdminInbox() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, msgRes] = await Promise.all([
        api.get('/applications'),
        api.get('/contact')
      ]);
      setApplications(appRes.data.data);
      setMessages(msgRes.data.data);
    } catch (error) {
      console.error('Error fetching inbox data:', error);
      toast.error('Failed to load inbox data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, feedback = '') => {
    setIsUpdating(true);
    try {
      await api.put(`/applications/${id}/status`, { status, adminFeedback: feedback });
      toast.success(`Application marked as ${status}`);
      // Update local state
      setApplications(apps => apps.map(app =>
        app._id === id ? { ...app, status, adminFeedback: feedback } : app
      ));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => ({ ...prev, status, adminFeedback: feedback }));
      }
    } catch (error) {
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Data processing (Filtering & Sorting)
  const processedData = useMemo(() => {
    // 1. Separate based on Archived definition (closed or rejected)
    const activeApps = applications.filter(app => app.status !== 'closed' && app.status !== 'rejected');
    const activeMsgs = messages;
    const archivedItems = [
      ...applications.filter(app => app.status === 'closed' || app.status === 'rejected'),
    ];

    let currentList = [];
    if (activeTab === 'applications') currentList = activeApps;
    else if (activeTab === 'messages') currentList = activeMsgs;
    else if (activeTab === 'archived') currentList = archivedItems;

    // 2. Search filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      currentList = currentList.filter(item => {
        const title = item.organizationName || item.name || '';
        const email = item.email || '';
        const desc = item.projectDescription || item.message || '';
        return title.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q);
      });
    }

    // 3. Status filtering (Only for applications and archived)
    if (statusFilter !== 'all' && activeTab !== 'messages') {
      currentList = currentList.filter(item => {
        const itemStatus = item.status || 'pending';
        return itemStatus === statusFilter;
      });
    }

    // 4. Sorting
    currentList.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return currentList;
  }, [activeTab, applications, messages, searchQuery, statusFilter, sortBy]);

  const counts = useMemo(() => {
    return {
      applications: applications.filter(app => app.status !== 'closed' && app.status !== 'rejected').length,
      messages: messages.length,
      archived: applications.filter(app => app.status === 'closed' || app.status === 'rejected').length
    };
  }, [applications, messages]);

  // When changing tabs, clear selection
  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-[#F7F5F0]">
      {/* Streamlined Header & Breadcrumbs */}
      <div className="px-6 pt-6 pb-2">
        <div className="text-xs text-body-light mb-1 font-semibold uppercase tracking-wider">
          Dashboard <span className="mx-1">&gt;</span> Client Applications
        </div>
      </div>

      <div className="px-6 flex-1 flex flex-col">
        <ApplicationFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Master / Detail Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 pb-6 min-h-0 flex-1">
          {/* Master List */}
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 overflow-y-auto pr-1 custom-scrollbar">
            <ApplicationList
              loading={loading}
              activeTab={activeTab}
              list={processedData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>

          {/* Detail Workspace (Desktop) */}
          <div className="flex-1 min-w-0 hidden lg:block relative">
            <AnimatePresence mode="wait">
              <ApplicationDetailView
                selectedItem={selectedItem}
                activeTab={activeTab}
                setSelectedItem={setSelectedItem}
                handleUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            </AnimatePresence>
          </div>

          {/* Mobile Detail Modal Overlay */}
          <AnimatePresence>
            {selectedItem && (
              <div className="lg:hidden fixed inset-0 z-50 bg-[#F7F5F0] overflow-y-auto">
                <div className="p-4 min-h-screen">
                  <ApplicationDetailView
                    selectedItem={selectedItem}
                    activeTab={activeTab}
                    setSelectedItem={setSelectedItem}
                    handleUpdateStatus={handleUpdateStatus}
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