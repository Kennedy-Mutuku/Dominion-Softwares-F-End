import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTicketAlt, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EventSales() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data: res } = await api.get(`/dashboard/sales/${id}`);
        setData(res.data);
      } catch (error) {
        toast.error('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const totalRevenue = data.orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalTickets = data.ticketTypes.reduce((s, tt) => s + tt.sold, 0);

  return (
    <div>
      <Link to="/dashboard/events" className="flex items-center gap-2 text-body hover:text-heading mb-4 transition-colors text-sm">
        <FaArrowLeft /> Back to Events
      </Link>

      <h1 className="text-2xl font-bold text-heading mb-2">{data.event.title}</h1>
      <p className="text-body-light mb-6">Sales Analytics</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FaMoneyBillWave className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-body-light">Revenue</p>
              <p className="text-xl font-bold text-heading">KES {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FaTicketAlt className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-body-light">Tickets Sold</p>
              <p className="text-xl font-bold text-heading">{totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaShoppingCart className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-body-light">Orders</p>
              <p className="text-xl font-bold text-heading">{data.orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Types Breakdown */}
      <div className="bg-white rounded-xl border border-border-light p-5 mb-8">
        <h2 className="font-semibold text-heading mb-4">Ticket Types</h2>
        <div className="space-y-3">
          {data.ticketTypes.map((tt) => (
            <div key={tt._id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-heading">{tt.name}</p>
                <p className="text-sm text-body-light">KES {tt.price.toLocaleString()} each</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-heading">{tt.sold}/{tt.quantity}</p>
                <div className="w-32 h-2 bg-cream rounded-full mt-1">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(tt.sold / tt.quantity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Chart */}
      {data.salesByDate.length > 0 && (
        <div className="bg-white rounded-xl border border-border-light p-5 mb-8">
          <h2 className="font-semibold text-heading mb-4">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.salesByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#E8820C" radius={[4, 4, 0, 0]} name="Revenue (KES)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <h2 className="font-semibold text-heading mb-4">Recent Orders</h2>
        {data.orders.length === 0 ? (
          <p className="text-body-light text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body-light border-b border-border-light">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Buyer</th>
                  <th className="pb-3 font-medium">Tickets</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.slice(0, 20).map((order) => (
                  <tr key={order._id} className="border-b border-border-light/50">
                    <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                    <td className="py-3">{order.buyer?.name || 'Guest'}</td>
                    <td className="py-3">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="py-3 font-medium">KES {order.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-body-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
