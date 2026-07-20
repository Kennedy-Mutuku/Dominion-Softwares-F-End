import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTicketAlt, FaMoneyBillWave, FaCheckCircle, FaChartLine, FaShoppingCart } from 'react-icons/fa';
import api from '../../utils/api';

export default function OrganizerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
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
    { label: 'Total Events', value: stats?.totalEvents || 0, icon: FaCalendarAlt, color: 'bg-blue-500' },
    { label: 'Published', value: stats?.publishedEvents || 0, icon: FaChartLine, color: 'bg-green-500' },
    { label: 'Tickets Sold', value: stats?.totalTicketsSold || 0, icon: FaTicketAlt, color: 'bg-purple-500' },
    { label: 'Tickets Used', value: stats?.ticketsUsed || 0, icon: FaCheckCircle, color: 'bg-teal-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FaShoppingCart, color: 'bg-primary' },
    { label: 'Revenue', value: `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FaMoneyBillWave, color: 'bg-primary' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-border-light"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-body-light">{card.label}</p>
                <p className="text-2xl font-bold text-heading mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-heading mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/events/new" className="bg-white rounded-xl p-5 border border-border-light hover:border-primary hover:shadow-md transition-all text-center">
          <FaCalendarAlt className="text-3xl text-primary mx-auto mb-3" />
          <p className="font-semibold text-heading">Create Event</p>
          <p className="text-sm text-body-light mt-1">Set up a new event</p>
        </Link>
        <Link to="/dashboard/scanner" className="bg-white rounded-xl p-5 border border-border-light hover:border-primary hover:shadow-md transition-all text-center">
          <FaTicketAlt className="text-3xl text-primary mx-auto mb-3" />
          <p className="font-semibold text-heading">Scan Tickets</p>
          <p className="text-sm text-body-light mt-1">Validate at entrance</p>
        </Link>
        <Link to="/dashboard/check-in" className="bg-white rounded-xl p-5 border border-border-light hover:border-primary hover:shadow-md transition-all text-center">
          <FaCheckCircle className="text-3xl text-primary mx-auto mb-3" />
          <p className="font-semibold text-heading">Check-In</p>
          <p className="text-sm text-body-light mt-1">Search by ticket number</p>
        </Link>
      </div>
    </div>
  );
}
