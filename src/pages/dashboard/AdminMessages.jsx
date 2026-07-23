import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import toast from 'react-hot-toast';

import ApplicationList from './components/inbox/ApplicationList';
import ApplicationDetailView from './components/inbox/ApplicationDetailView';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, feedback = '') => {
    setIsUpdating(true);
    try {
      // Assuming contact route has a status update or we just rely on it locally for now
      // This might need backend implementation if it doesn't exist.
      await api.put(`/contact/${id}/status`, { status, adminFeedback: feedback });
      toast.success(`Message marked as ${status}`);
      
      setMessages(msgs => msgs.map(msg => {
        if (msg._id === id) {
          return { ...msg, status, adminFeedback: feedback };
        }
        return msg;
      }));
      
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => ({ ...prev, status, adminFeedback: feedback }));
      }
    } catch (error) {
      toast.error('Failed to update message status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendFeedback = async (id, feedback) => {
    try {
      const currentMsg = messages.find(m => m._id === id);
      if (!currentMsg) return;
      await api.put(`/contact/${id}/status`, { status: currentMsg.status, adminFeedback: feedback });
      toast.success('Reply sent!');
      setMessages(msgs => msgs.map(msg =>
        msg._id === id ? { ...msg, adminFeedback: feedback } : msg
      ));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => ({ ...prev, adminFeedback: feedback }));
      }
    } catch (error) {
      toast.error('Failed to send reply.');
    }
  };

  const processedData = useMemo(() => {
    let currentList = messages;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      currentList = currentList.filter(item => {
        const title = item.name || '';
        const email = item.email || '';
        const desc = item.message || '';
        return title.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q);
      });
    }

    if (statusFilter !== 'all') {
      currentList = currentList.filter(item => (item.status || 'new') === statusFilter);
    }

    currentList.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return currentList;
  }, [messages, searchQuery, statusFilter, sortBy]);

  return (
    <div className="flex flex-col h-full bg-[#F7F5F0]">
      <div className="px-6 pt-6 pb-2">
        <div className="text-xs text-body-light mb-1 font-semibold uppercase tracking-wider">
          Dashboard <span className="mx-1">&gt;</span> Messages
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
                placeholder="Search messages..."
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
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
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
              activeTab="messages"
              list={processedData}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className="flex-1 min-w-0 hidden lg:block relative">
            <AnimatePresence mode="wait">
              <ApplicationDetailView
                selectedItem={selectedItem}
                activeTab="messages"
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
                    activeTab="messages"
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
