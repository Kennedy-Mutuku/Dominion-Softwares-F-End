import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaCalendarAlt, FaPlusCircle, FaQrcode, FaSearch,
  FaSignOutAlt, FaBars, FaTimes, FaHome, FaInbox, FaTicketAlt, FaChevronRight, FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/dominion softwares main logo.png';
import api from '../../utils/api';

// Imports
import OrganizerDashboard from './OrganizerDashboard';
import EventManager from './EventManager';
import EventForm from './EventForm';
import EventSales from './EventSales';
import AttendeeList from './AttendeeList';
import TicketScanner from './TicketScanner';
import CheckIn from './CheckIn';
import EventCreated from './EventCreated';

// New Admin components (to be created)
import AdminDashboard from './AdminDashboard';
import AdminApplications from './AdminApplications';
import AdminMessages from './AdminMessages';

// ─── Organizer sidebar links ──────────────────────────────────────────────────
const organizerLinks = [
  { to: '/dashboard',            label: 'Dashboard',    icon: FaTachometerAlt, end: true },
  { to: '/dashboard/events',     label: 'My Events',    icon: FaCalendarAlt },
  { to: '/dashboard/events/new', label: 'Create Event', icon: FaPlusCircle },
  { to: '/dashboard/scanner',    label: 'QR Scanner',   icon: FaQrcode },
  { to: '/dashboard/check-in',   label: 'Check-In',     icon: FaSearch },
];

function SidebarLink({ to, label, icon: Icon, end, onClick, badgeCount }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-primary/20 text-primary'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`text-base shrink-0 ${isActive ? 'text-primary' : ''}`} />
          <span className="flex-1">{label}</span>
          
          {/* Badge */}
          {badgeCount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-md shadow-primary/40"
            >
              {badgeCount}
            </motion.div>
          )}

          {isActive && <FaChevronRight className="text-[10px] text-primary/60 ml-1" />}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({ newApplications: 0, unattendedMessages: 0, activeTickets: 0 });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (isAdmin) {
      const fetchAdminStats = async () => {
        try {
          const res = await api.get('/dashboard/admin-stats');
          if (res.data.success) {
            setAdminStats(res.data.data);
          }
        } catch (error) {
          console.error("Failed to load admin stats", error);
        }
      };
      fetchAdminStats();
      // Polling could be added here if real-time is needed
      const interval = setInterval(fetchAdminStats, 60000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // ─── Admin sidebar links ──────────────────────────────────────────────────────
  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt, end: true },
    { to: '/dashboard/applications', label: 'Applications', icon: FaInbox, badgeCount: adminStats.newApplications },
    { to: '/dashboard/messages', label: 'Messages', icon: FaEnvelope, badgeCount: adminStats.unattendedMessages },
  ];

  const navLinks = isAdmin ? adminLinks : organizerLinks;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F0]">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        className={[
          'flex flex-col bg-[#1B1B1B] text-white z-50 shrink-0',
          'transition-transform duration-300 ease-in-out',
          'md:translate-x-0 md:w-60 md:relative md:h-full',
          'fixed inset-y-0 left-0 w-[260px]',
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
          <img src={logo} alt="Dominion Softwares" className="h-10 w-auto object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-white leading-tight tracking-wide">DOMINION</p>
            <p className="text-sm font-extrabold text-primary leading-tight tracking-wide">SOFTWARES</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/40 hover:text-white transition-colors cursor-pointer p-1 shrink-0"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* User pill */}
        <div className="px-4 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-base shrink-0 shadow-lg shadow-primary/30">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
              <span className="mt-1 inline-block px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase rounded-full tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
            {isAdmin ? 'Admin Panel' : 'Organizer'}
          </p>

          {navLinks.map((link) => (
            <SidebarLink key={link.to} {...link} onClick={() => setSidebarOpen(false)} />
          ))}

          {/* Tickets — shown for both roles, using badge for admin */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
              Ticketing
            </p>
            <SidebarLink
              to="/tickets"
              label="Tickets"
              icon={FaTicketAlt}
              onClick={() => setSidebarOpen(false)}
              badgeCount={isAdmin ? adminStats.activeTickets : 0}
            />
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <FaHome className="shrink-0" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full cursor-pointer"
          >
            <FaSignOutAlt className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div id="dashboard-scroll-container" className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center gap-4 shadow-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-heading text-xl cursor-pointer hover:text-primary transition-colors"
          >
            <FaBars />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-heading">
              {isAdmin ? 'Admin Dashboard' : 'Organizer Dashboard'}
            </h1>
            <p className="text-xs text-body-light hidden sm:block">
              {isAdmin
                ? 'Manage applications, messages, and oversee platform activity'
                : `Welcome back, ${user?.name?.split(' ')[0]}`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isAdmin && (
              <Link
                to="/dashboard/events/new"
                className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
              >
                <FaPlusCircle className="text-xs" />
                <span className="hidden sm:inline">New Event</span>
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-red-50 hover:text-red-600 text-primary font-bold text-sm rounded-full transition-colors cursor-pointer group"
              title="Sign Out"
            >
              <span>{user?.name?.split(' ')[0] || 'Dominion'}</span>
              <FaSignOutAlt className="text-sm opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route index element={isAdmin ? <AdminDashboard /> : <OrganizerDashboard />} />
            
            {/* Organizer routes */}
            <Route path="events" element={<EventManager />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/:id/edit" element={<EventForm />} />
            <Route path="events/:id/created" element={<EventCreated />} />
            <Route path="events/:id/sales" element={<EventSales />} />
            <Route path="events/:id/attendees" element={<AttendeeList />} />
            <Route path="scanner" element={<TicketScanner />} />
            <Route path="check-in" element={<CheckIn />} />

            {/* Admin routes */}
            <Route path="applications" element={<AdminApplications />} />
            <Route path="messages" element={<AdminMessages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
