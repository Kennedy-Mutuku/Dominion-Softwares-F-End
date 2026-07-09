import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  FaHome, FaInfoCircle, FaCogs, FaBriefcase, FaEnvelope, FaRocket,
  FaPhone, FaGlobe, FaTicketAlt, FaUser, FaSignOutAlt, FaTachometerAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Dominion Sodtwares Logo.png';

const navLinks = [
  { to: '/', label: 'Home', icon: FaHome },
  { to: '/about', label: 'About', icon: FaInfoCircle },
  { to: '/services', label: 'Services', icon: FaCogs },
  { to: '/portfolio', label: 'Portfolio', icon: FaBriefcase },
  { to: '/tickets', label: 'Tickets', icon: FaTicketAlt },
  { to: '/contact', label: 'Contact', icon: FaEnvelope },
  { to: '/apply', label: 'Apply', icon: FaRocket },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ===== TOP NAVBAR BAR ===== */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="flex items-center justify-between h-[76px] md:h-[84px]">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-heading text-2xl w-[46px] flex items-center justify-center cursor-pointer -ml-5"
            >
              <HiMenu />
            </button>

            {/* Logo */}
            <Link to="/" className="md:mr-auto group">
              <div className="flex items-center gap-3 md:gap-4">

                {/* Logo image with glow ring on hover */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-xl bg-primary/10 scale-110 opacity-0
                                  group-hover:opacity-100 transition-all duration-300 blur-sm" />
                  <img
                    src={logo}
                    alt="Dominion Softwares Logo"
                    className="relative h-12 md:h-14 w-auto object-contain
                               drop-shadow-[0_2px_8px_rgba(232,130,12,0.25)]
                               group-hover:drop-shadow-[0_4px_16px_rgba(232,130,12,0.4)]
                               transition-all duration-300"
                  />
                </div>

                {/* Thin vertical divider */}
                <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

                {/* Brand text */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[18px] md:text-[24px] font-extrabold tracking-tight text-heading leading-none">
                      DOMINION
                    </span>
                    <span className="text-[18px] md:text-[24px] font-extrabold tracking-tight text-primary leading-none">
                      SOFTWARES
                    </span>
                  </div>
                  <span className="text-[8.5px] md:text-[10px] text-primary/60 tracking-[0.18em]
                                   font-semibold uppercase mt-1">
                    Automate · Optimize · Dominate
                  </span>
                </div>

              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.filter(l => l.to !== '/apply').map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative text-[15px] font-medium transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-body hover:text-heading'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              <Link to="/apply"
                className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full
                           hover:bg-primary-dark hover:shadow-[0_4px_16px_rgba(232,130,12,0.3)]
                           transition-all duration-300 cursor-pointer ml-2"
              >
                Apply Now
              </Link>

              {/* Auth Section */}
              {user ? (
                <div className="relative ml-3">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-cream hover:bg-cream-dark transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-heading hidden lg:block">{user.name.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-border-light py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-border-light">
                          <p className="text-sm font-semibold text-heading">{user.name}</p>
                          <p className="text-xs text-body-light">{user.email}</p>
                        </div>
                        {(user.role === 'organizer' || user.role === 'admin') && (
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-body hover:bg-cream hover:text-heading transition-colors"
                          >
                            <FaTachometerAlt className="text-xs" /> Dashboard
                          </Link>
                        )}
                        <Link
                          to="/my-tickets"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-body hover:bg-cream hover:text-heading transition-colors"
                        >
                          <FaTicketAlt className="text-xs" /> My Tickets
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full cursor-pointer"
                        >
                          <FaSignOutAlt className="text-xs" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-3 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Spacer for mobile to balance hamburger */}
            <div className="w-10 md:hidden" />
          </div>
        </div>
      </motion.nav>

      {/* ===== MOBILE: SIDEBAR (icon strip that expands) ===== */}
      <div
        className={`fixed left-0 top-[112px] bottom-0 bg-primary z-[45] md:hidden
                     flex flex-col transition-all duration-300 overflow-hidden border-r border-primary-dark/30 ${
                       isOpen ? 'w-[155px]' : 'w-[46px]'
                     }`}
      >
        {/* Nav links - identical spacing in both states */}
        <nav className="flex-1 flex flex-col pt-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => {
                setIsOpen(true);
              }}
              className={({ isActive }) =>
                `flex items-center h-[42px] px-[11px] cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary'
                    : 'text-white/75 hover:bg-white/15 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-[24px] h-[24px] rounded-md flex items-center justify-center shrink-0 ${
                    isActive ? '' : ''
                  }`}>
                    <link.icon className="text-[15px]" />
                  </div>
                  <span className={`text-[13px] font-medium whitespace-nowrap ml-3 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                  }`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom contact */}
        <div className={`mb-4 flex flex-col items-center gap-3 ${isOpen ? 'items-start px-4' : ''}`}>
          <a href="tel:+254740881485" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors">
            <FaPhone className="text-xs shrink-0" />
            {isOpen && <span className="text-xs">0740881485</span>}
          </a>
          <a href="mailto:info@dominionsoftwares.com" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors">
            <FaEnvelope className="text-xs shrink-0" />
            {isOpen && <span className="text-[11px]">info@dominion...</span>}
          </a>
        </div>
      </div>

      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[44] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile layout: content beside sidebar, no overflow */}
      <style>{`
        @media (max-width: 767px) {
          html, body {
            overflow-x: hidden;
            width: 100vw;
          }
          .app-content {
            margin-left: 46px;
            width: calc(100vw - 46px);
            max-width: calc(100vw - 46px);
            overflow-x: hidden;
          }
          .app-content * {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
