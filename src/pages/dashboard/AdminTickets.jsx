import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaMoneyBillWave, FaUserCheck, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';

export default function AdminTickets() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, eventsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/events')
        ]);
        
        setStats(statsRes.data.data);
        setEvents(eventsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticketing overview');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading">Ticketing Overview</h1>
        <p className="text-body-light mt-1">Platform-wide statistics and event ticketing performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaTicketAlt}
          title="Total Tickets Sold"
          value={stats?.totalTicketsSold || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0, stats?.currency || 'KES')}
          color="bg-green-500"
        />
        <StatCard
          icon={FaUserCheck}
          title="Total Check-ins"
          value={stats?.ticketsUsed || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={FaCalendarCheck}
          title="Active Events"
          value={stats?.publishedEvents || 0}
          color="bg-orange-500"
        />
      </div>

      {/* Events Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-heading">
            <FaChartLine className="text-primary" />
            Event Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-body font-semibold">
                <th className="p-4 pl-6">Event Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tickets Sold</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-heading">
                      {event.title}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        event.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      {event.stats.totalSold}
                    </td>
                    <td className="p-4 text-gray-500">
                      {event.stats.totalCapacity}
                    </td>
                    <td className="p-4 font-semibold text-green-600">
                      {formatCurrency(event.stats.revenue, 'KES')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${color}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-body-light mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-black text-heading tracking-tight">
            {value}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
