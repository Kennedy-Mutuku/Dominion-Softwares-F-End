import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInbox, FaEnvelope, FaTicketAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/admin-stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'New Applications', 
      value: stats?.newApplications || 0, 
      icon: FaExclamationCircle, 
      color: 'bg-orange-500', 
      link: '/dashboard/applications',
      subtitle: 'Awaiting your review'
    },
    { 
      label: 'Unattended Messages', 
      value: stats?.unattendedMessages || 0, 
      icon: FaEnvelope, 
      color: 'bg-red-500', 
      link: '/dashboard/messages',
      subtitle: 'Need responses'
    },
    { 
      label: 'Total Applications', 
      value: stats?.totalApplications || 0, 
      icon: FaInbox, 
      color: 'bg-blue-500', 
      link: '/dashboard/applications',
      subtitle: 'All time'
    },
    { 
      label: 'Total Messages', 
      value: stats?.totalMessages || 0, 
      icon: FaCheckCircle, 
      color: 'bg-teal-500', 
      link: '/dashboard/messages',
      subtitle: 'All time'
    },
    { 
      label: 'Active Tickets', 
      value: stats?.activeTickets || 0, 
      icon: FaTicketAlt, 
      color: 'bg-purple-500', 
      link: '/tickets',
      subtitle: 'Valid event tickets'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-heading mb-2">Admin Overview</h1>
      <p className="text-body-light mb-8">Here's a quick glimpse of what needs your attention today.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((card, i) => (
          <Link key={card.label} to={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-6 relative overflow-hidden border border-border-light hover:border-primary/50 hover:shadow-xl shadow-sm transition-all duration-300 group cursor-pointer"
            >
              {/* Background Accent */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${card.color} group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-body-light mb-1">{card.label}</p>
                  <p className="text-4xl font-extrabold text-heading">
                    {card.value}
                    {card.value > 0 && ['New Applications', 'Unattended Messages'].includes(card.label) && (
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2 mb-2 animate-ping" />
                    )}
                  </p>
                  <p className="text-xs text-body-light mt-2">{card.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform`}>
                  <card.icon className="text-xl" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions (Admin specific) */}
      <h2 className="text-xl font-bold text-heading mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/dashboard/applications" className="bg-white rounded-3xl p-6 border border-border-light hover:border-primary hover:shadow-lg transition-all text-center group">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <FaInbox className="text-2xl" />
          </div>
          <p className="font-bold text-lg text-heading">Review Applications</p>
          <p className="text-sm text-body-light mt-1">Process pending client requests</p>
        </Link>
        <Link to="/dashboard/messages" className="bg-white rounded-3xl p-6 border border-border-light hover:border-primary hover:shadow-lg transition-all text-center group">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <FaEnvelope className="text-2xl" />
          </div>
          <p className="font-bold text-lg text-heading">Reply to Messages</p>
          <p className="text-sm text-body-light mt-1">Respond to contact inquiries</p>
        </Link>
      </div>
    </div>
  );
}
