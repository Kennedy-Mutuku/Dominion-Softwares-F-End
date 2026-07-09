import { useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaCalendarAlt, FaPlusCircle, FaQrcode, FaSearch,
  FaSignOutAlt, FaBars, FaTimes, FaTicketAlt, FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import OrganizerDashboard from './OrganizerDashboard';
import EventManager from './EventManager';
import EventForm from './EventForm';
import EventSales from './EventSales';
import AttendeeList from './AttendeeList';
import TicketScanner from './TicketScanner';
import CheckIn from './CheckIn';
import EventCreated from './EventCreated';
import AdminInbox from './AdminInbox';
import { FaInbox } from 'react-icons/fa';

const sidebarLinks = [
  { to: '/dashboard', label: 'Overview', icon: FaTachometerAlt, end: true },
  { to: '/dashboard/events', label: 'My Events', icon: FaCalendarAlt },
  { to: '/dashboard/events/new', label: 'Create Event', icon: FaPlusCircle },
  { to: '/dashboard/scanner', label: 'QR Scanner', icon: FaQrcode },
  { to: '/dashboard/check-in', label: 'Check-In', icon: FaSearch },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar — slim on mobile, standard on desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[160px] md:w-56 bg-dark text-white transform transition-transform duration-300
        md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo + Close */}
          <div className="px-3 py-3 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5" onClick={() => setSidebarOpen(false)}>
              <FaTicketAlt className="text-primary text-sm" />
              <span className="font-bold text-sm">DOMINION</span>
              <span className="text-primary font-bold text-sm">TICKETS</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white cursor-pointer p-1">
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* User Info — compact */}
          <div className="px-3 py-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs truncate">{user?.name}</p>
                <p className="text-[10px] text-text-muted truncate">{user?.organization || user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav — compact spacing */}
          <nav className="flex-1 py-2">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border-r-2 border-primary'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon className="text-sm shrink-0" />
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/dashboard/admin-inbox"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all mt-4 ${
                    isActive
                      ? 'bg-primary/20 text-primary border-r-2 border-primary'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <FaInbox className="text-sm shrink-0" />
                Admin Inbox
              </NavLink>
            )}
          </nav>

          {/* Bottom — compact */}
          <div className="px-2 py-2 border-t border-white/10 space-y-0.5">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-muted hover:text-white transition-colors rounded-lg"
            >
              <FaHome className="text-sm" /> Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full cursor-pointer rounded-lg"
            >
              <FaSignOutAlt className="text-sm" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-border-light px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-heading text-xl cursor-pointer"
          >
            <FaBars />
          </button>
          <h2 className="text-base md:text-lg font-semibold text-heading">Dashboard</h2>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/events/new" className="btn-primary text-xs md:text-sm py-2 px-3 md:px-4 inline-flex items-center gap-1">
              <FaPlusCircle className="text-xs" /> <span className="hidden sm:inline">New</span> Event
            </Link>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 p-3 md:p-6">
          <Routes>
            <Route index element={<OrganizerDashboard />} />
            <Route path="events" element={<EventManager />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/:id/edit" element={<EventForm />} />
            <Route path="events/:id/created" element={<EventCreated />} />
            <Route path="events/:id/sales" element={<EventSales />} />
            <Route path="events/:id/attendees" element={<AttendeeList />} />
            <Route path="scanner" element={<TicketScanner />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="admin-inbox" element={<AdminInbox />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
