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
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white transform transition-transform duration-300
        md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <FaTicketAlt className="text-primary text-xl" />
              <div>
                <span className="font-bold text-lg">DOMINION</span>
                <span className="text-primary font-bold text-lg ml-1">TICKETS</span>
              </div>
            </Link>
            <p className="text-xs text-text-muted mt-1">Organizer Dashboard</p>
          </div>

          {/* User Info */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-text-muted">{user?.organization || user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border-r-3 border-primary'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon className="text-base" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              <FaHome /> Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors w-full cursor-pointer"
            >
              <FaSignOutAlt /> Sign Out
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
        <header className="bg-white border-b border-border-light px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-heading text-xl cursor-pointer"
          >
            <FaBars />
          </button>
          <h2 className="text-lg font-semibold text-heading">Dashboard</h2>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/events/new" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
              + New Event
            </Link>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 p-6">
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
          </Routes>
        </main>
      </div>
    </div>
  );
}
