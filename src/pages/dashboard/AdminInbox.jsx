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
    const activeMsgs = messages; // assuming messages don't have a closed/rejected status yet
    const archivedItems = [
      ...applications.filter(app => app.status === 'closed' || app.status === 'rejected'),
      // Add archived messages here if applicable in future
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
        // Fallback for missing status is 'pending'
        const itemStatus = item.status || 'pending';
        return itemStatus === statusFilter;
      });
    }

<<<<<<< Updated upstream
    return (
      <div className="space-y-4">
        {currentList.map((item) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={item._id}
            onClick={() => setSelectedItem(item)}
            className="p-5 bg-white border border-border-light rounded-xl hover:border-primary/50 cursor-pointer transition-all shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-primary shrink-0">
              {activeTab === 'applications' ? <FaBriefcase /> : <FaEnvelope />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-heading truncate">
                    {activeTab === 'applications' ? item.organizationName : item.name}
                  </h4>
                  {activeTab === 'applications' && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                      'bg-primary/10 text-primary-dark'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-body-light whitespace-nowrap ml-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-body truncate mb-2">
                {activeTab === 'applications' ? item.projectDescription : item.message}
              </p>
              <div className="flex gap-3 text-xs text-body-light">
                <span>{item.email}</span>
                {item.phone && <span>• {item.phone}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
=======
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
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
        {/* Detail Panel */}
        <div className="bg-cream-dark/20 border border-border-light rounded-xl p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start pb-4 border-b border-border-light">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-heading">
                        {activeTab === 'applications' ? selectedItem.organizationName : selectedItem.name}
                      </h2>
                      {activeTab === 'applications' && (
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                          selectedItem.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                          selectedItem.status === 'feedback' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          selectedItem.status === 'contacted' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          selectedItem.status === 'closed' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          'bg-primary/10 text-primary-dark border border-primary/20'
                        }`}>
                          {selectedItem.status || 'pending'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-primary font-medium mt-1">
                      {activeTab === 'applications' ? 
                        (selectedItem.clientType === 'church' ? 'Church / Ministry' : 
                         selectedItem.clientType === 'business' ? 'Business / Corporate' : 
                         'Organization') + ' • ' + selectedItem.organizationType 
                        : 'Contact Inquiry'}
                    </p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-2 text-body-light hover:text-red-500 transition-colors">
                    <FaTimes />
                  </button>
=======
          {/* Detail Workspace */}
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
>>>>>>> Stashed changes
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
