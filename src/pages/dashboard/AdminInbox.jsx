import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInbox, FaEnvelope, FaBriefcase, FaTimes, FaSpinner } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminInbox() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-body-light">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <p>Loading inbox...</p>
        </div>
      );
    }

    const currentList = activeTab === 'applications' ? applications : messages;

    if (currentList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-body-light bg-cream-dark/10 rounded-xl border border-dashed border-border-light">
          <FaInbox className="text-5xl mb-4 opacity-50" />
          <p>No {activeTab} found.</p>
        </div>
      );
    }

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
                <h4 className="font-semibold text-heading truncate">
                  {activeTab === 'applications' ? item.organizationName : item.name}
                </h4>
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading">Admin Inbox</h1>
          <p className="text-body text-sm mt-1">Manage project applications and contact messages.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-light mb-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'applications' ? 'text-primary' : 'text-body hover:text-heading'
          }`}
        >
          Applications ({applications.length})
          {activeTab === 'applications' && (
            <motion.div layoutId="inboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'messages' ? 'text-primary' : 'text-body hover:text-heading'
          }`}
        >
          Messages ({messages.length})
          {activeTab === 'messages' && (
            <motion.div layoutId="inboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="lg:sticky top-6">
          {renderContent()}
        </div>

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
                    <h2 className="text-xl font-bold text-heading">
                      {activeTab === 'applications' ? selectedItem.organizationName : selectedItem.name}
                    </h2>
                    <p className="text-sm text-primary font-medium mt-1">
                      {activeTab === 'applications' ? selectedItem.organizationType : 'Contact Inquiry'}
                    </p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-2 text-body-light hover:text-red-500 transition-colors">
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg border border-border-light">
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Contact Person</p>
                    <p className="font-medium text-heading">{activeTab === 'applications' ? selectedItem.contactPerson : selectedItem.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Date Received</p>
                    <p className="text-body">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Email</p>
                    <a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline">{selectedItem.email}</a>
                  </div>
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-1">Phone</p>
                    <p className="text-body">{selectedItem.phone || 'Not provided'}</p>
                  </div>
                </div>

                {activeTab === 'applications' && (
                  <>
                    <div>
                      <p className="text-xs text-body-light uppercase font-semibold mb-2">Project Description</p>
                      <div className="bg-white p-4 rounded-lg border border-border-light text-sm text-body whitespace-pre-wrap">
                        {selectedItem.projectDescription}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg border border-border-light">
                      <div>
                        <p className="text-xs text-body-light uppercase font-semibold mb-1">Budget</p>
                        <p className="text-body">{selectedItem.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-body-light uppercase font-semibold mb-1">Timeline</p>
                        <p className="text-body">{selectedItem.timeline}</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'messages' && (
                  <div>
                    <p className="text-xs text-body-light uppercase font-semibold mb-2">Message Content</p>
                    <div className="bg-white p-4 rounded-lg border border-border-light text-sm text-body whitespace-pre-wrap leading-relaxed">
                      {selectedItem.message}
                    </div>
                  </div>
                )}
                
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50"
              >
                <FaInbox className="text-6xl mb-4 text-body-light" />
                <p className="text-heading font-medium">Select an item to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
