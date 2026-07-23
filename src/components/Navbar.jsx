import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  FaHome, FaInfoCircle, FaCogs, FaBriefcase, FaEnvelope, FaRocket,
  FaPhone, FaGlobe, FaTicketAlt, FaUser, FaSignOutAlt, FaTachometerAlt,
  FaChevronDown, FaStar, FaUsers, FaHistory, FaGem,
  FaChurch, FaBuilding, FaWrench, FaTasks, FaLaptopCode, FaMobileAlt,
  FaPaperPlane
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/dominion softwares main logo.png';

const navLinks = [
  { to: '/', label: 'Home', icon: FaHome },
  { to: '/about', label: 'Who We Are', icon: FaInfoCircle },
  { to: '/services', label: 'Services', icon: FaCogs },
  { to: '/portfolio', label: 'Portfolio', icon: FaBriefcase },
  { to: '/tickets', label: 'Tickets', icon: FaTicketAlt },
  { to: '/contact', label: 'Contact', icon: FaEnvelope },
  { to: '/apply', label: 'Apply', icon: FaRocket },
];

const menuDropdowns = {
  '/about': [
    { label: 'Leadership Team', hash: 'leadership', icon: FaUsers },
    { label: 'Our Story & Vision', hash: 'story', icon: FaHistory },
    { label: 'Core Values', hash: 'values', icon: FaGem },
  ],
  '/services': [
    { label: 'Kingdom Tech', hash: 'kingdom-tech', icon: FaChurch },
    { label: 'Enterprise Solutions', hash: 'enterprise', icon: FaBuilding },
    { label: 'What We Build', hash: 'what-we-build', icon: FaWrench },
    { label: 'Our 6-Step Process', hash: 'process', icon: FaTasks },
  ],
  '/portfolio': [
    { label: 'Software Solutions', hash: 'software', icon: FaLaptopCode },
    { label: 'Mobile Applications', hash: 'mobile', icon: FaMobileAlt },
    { label: 'Ticketing System', hash: 'tickets', icon: FaTicketAlt },
  ],
  '/contact': [
    { label: 'Send a Message', hash: 'contact-form', icon: FaPaperPlane },
    { label: 'Leave a Client Review', to: '/reviews', icon: FaStar },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileRoute, setExpandedMobileRoute] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const scrollToTarget = (hashId) => {
    if (!hashId) return;
    const container = document.getElementById('main-scroll-container');
    const target = document.getElementById(hashId);
    if (target) {
      if (container) {
        const headerHeight = 85;
        const targetTop = target.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - headerHeight;
        container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setScrolled(scrollTop > 20);
    };
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        scrollToTarget(hashId);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    setActiveDropdown(null);
    setExpandedMobileRoute(null);
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const handleSubNavigate = (mainPath, item) => {
    setActiveDropdown(null);
    setExpandedMobileRoute(null);
    setIsOpen(false);
    if (item.to) {
      navigate(item.to);
      return;
    }

    if (item.hash) {
      if (location.pathname === mainPath) {
        scrollToTarget(item.hash);
      } else {
        navigate(`${mainPath}#${item.hash}`);
      }
    } else {
      navigate(mainPath);
    }
  };

  const handleTopNavClick = () => {
    setActiveDropdown(null);
    setExpandedMobileRoute(null);
    setIsOpen(false);
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ===== TOP NAVBAR BAR ===== */}
      <nav
        className={`relative z-20 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="flex items-center justify-between h-[76px] gap-4 xl:gap-8">
            {/* Mobile hamburger */}
            <button
              onClick={() => {
                if (isOpen) setExpandedMobileRoute(null);
                setIsOpen(!isOpen);
              }}
              className="xl:hidden text-heading text-2xl w-[46px] flex items-center justify-center cursor-pointer -ml-5"
            >
              <HiMenu />
            </button>

            {/* Logo */}
            <Link to="/" onClick={handleTopNavClick} className="md:mr-auto group shrink-0">
              <div className="flex items-center gap-3 md:gap-4">

                {/* Logo image with glow ring on hover */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-xl bg-primary/10 scale-110 opacity-0
                                  group-hover:opacity-100 transition-all duration-300 blur-sm" />
                  <img
                    src={logo}
                    alt="Dominion Softwares Logo"
                    loading="eager"
                    decoding="async"
                    className="relative h-[45px] md:h-[55px] w-auto object-contain
                               drop-shadow-[0_2px_8px_rgba(232,130,12,0.25)]
                               group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Thin vertical divider */}
                <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

                {/* Brand text */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[18px] md:text-[24px] font-extrabold tracking-tight text-heading leading-none">
                      DOMINION
                    </span>
                    <span className="text-[18px] md:text-[24px] font-extrabold tracking-tight text-primary leading-none">
                      SOFTWARES
                    </span>
                  </div>
                  <div className="flex items-center w-full mt-1">
                    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent to-secondary/60 flex-1"></div>
                    <span className="px-3 text-secondary text-[20px] md:text-[24px] font-bold tracking-wide drop-shadow-sm leading-none" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      Heavenly Inspired
                    </span>
                    <div className="h-[2px] rounded-full bg-gradient-to-l from-transparent to-secondary/60 flex-1"></div>
                  </div>
                </div>

              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-3 2xl:gap-6">
              {navLinks.filter(l => l.to !== '/apply').map((link) => {
                const subItems = menuDropdowns[link.to];
                const isActive = location.pathname === link.to || (link.to === '/contact' && location.pathname === '/reviews');

                if (subItems) {
                  return (
                    <div
                      key={link.to}
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(link.to)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <NavLink
                        to={link.to}
                        onClick={handleTopNavClick}
                        className={`relative text-[14px] 2xl:text-[15px] font-medium whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 ${
                          isActive ? 'text-primary' : 'text-body hover:text-heading'
                        }`}
                      >
                        {link.label}
                        <FaChevronDown className={`text-[10px] text-secondary font-bold transition-transform duration-200 ${activeDropdown === link.to ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`} />
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                          />
                        )}
                      </NavLink>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === link.to && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute top-full left-0 mt-1 min-w-[170px] bg-white rounded-xl shadow-xl border border-border-light py-1 px-1 z-50 overflow-hidden"
                          >
                            <div className="space-y-0.5">
                              {subItems.map((subItem) => (
                                <button
                                  key={subItem.label}
                                  onClick={() => handleSubNavigate(link.to, subItem)}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-heading hover:bg-primary/5 hover:text-primary rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                >
                                  {subItem.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={handleTopNavClick}
                    className={({ isActive }) =>
                      `relative text-[14px] 2xl:text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ${
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
                );
              })}
              <Link to="/apply"
                className="bg-primary text-white text-sm font-semibold px-5 2xl:px-6 py-2 2xl:py-2.5 rounded-full
                           whitespace-nowrap hover:bg-primary-dark hover:shadow-[0_4px_16px_rgba(255,95,0,0.35)]
                           transition-all duration-300 cursor-pointer ml-1 2xl:ml-2"
              >
                Get a Quote
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
                    <span className="text-sm font-medium text-heading hidden xl:block">{user.name.split(' ')[0]}</span>
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
            <div className="w-10 xl:hidden" />
          </div>
        </div>
      </nav>

      {/* ===== MOBILE: SIDEBAR (icon strip that expands) ===== */}
      <div
        className={`fixed left-0 top-[115px] bottom-0 bg-primary z-[45] xl:hidden
                     flex flex-col transition-all duration-300 overflow-y-auto overflow-x-hidden border-r border-primary-dark/30 ${
                       isOpen ? 'w-[125px]' : 'w-[40px]'
                     }`}
      >
        {/* Nav links - identical spacing in both states */}
        <nav className="flex-1 flex flex-col pt-3 px-0.5">
          {navLinks.map((link) => {
            const subItems = menuDropdowns[link.to];
            const isExpanded = expandedMobileRoute === link.to;

            return (
              <div key={link.to} className="flex flex-col w-full">
                <div
                  onClick={() => {
                    if (!isOpen) {
                      setIsOpen(true);
                    } else {
                      setIsOpen(false);
                      handleTopNavClick();
                      navigate(link.to);
                    }
                  }}
                  className={`relative flex items-center justify-between h-[42px] px-[8px] rounded-lg cursor-pointer transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-white font-bold bg-white/15'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-[24px] h-[24px] rounded-md flex items-center justify-center shrink-0">
                      <link.icon className="text-[15px]" />
                    </div>
                    <span className={`text-[12px] font-medium whitespace-nowrap ml-1.5 transition-opacity duration-300 ${
                      isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                    }`}>
                      {link.label}
                    </span>
                  </div>

                  {subItems && isOpen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMobileRoute(isExpanded ? null : link.to);
                      }}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-all shrink-0 ml-0.5 cursor-pointer flex items-center justify-center"
                    >
                      <FaChevronDown
                        className={`text-[10px] text-secondary font-bold transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Downward Accordion Expansion */}
                <AnimatePresence>
                  {subItems && isOpen && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden bg-black/20 rounded-md my-1 ml-3 mr-0.5 flex flex-col py-1 space-y-0.5 border-l border-white/40"
                    >
                      {subItems.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            setIsOpen(false);
                            handleSubNavigate(link.to, subItem);
                          }}
                          className="w-full text-left px-2 py-1 text-[11px] font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors truncate cursor-pointer"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          
          {/* Mobile Auth Links */}
          <div className="mt-2 pt-2 border-t border-white/20">
            {user ? (
              <>
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <NavLink
                    to="/dashboard"
                    onClick={(e) => { if(!isOpen){e.preventDefault(); setIsOpen(true);} else {setIsOpen(false);} }}
                    className={({ isActive }) => `relative flex items-center h-[42px] px-[11px] cursor-pointer transition-all duration-200 ${isActive ? 'text-white font-bold bg-white/10' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                  >
                    <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                      <FaTachometerAlt className="text-[15px]" />
                    </div>
                    <span className={`text-[13px] font-medium whitespace-nowrap ml-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Dashboard</span>
                  </NavLink>
                )}
                <NavLink
                  to="/my-tickets"
                  onClick={(e) => { if(!isOpen){e.preventDefault(); setIsOpen(true);} else {setIsOpen(false);} }}
                  className={({ isActive }) => `relative flex items-center h-[42px] px-[11px] cursor-pointer transition-all duration-200 ${isActive ? 'text-white font-bold bg-white/10' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                    <FaTicketAlt className="text-[15px]" />
                  </div>
                  <span className={`text-[13px] font-medium whitespace-nowrap ml-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>My Tickets</span>
                </NavLink>
                <button
                  onClick={() => { if(!isOpen){setIsOpen(true);} else {setIsOpen(false); logout();} }}
                  className="w-full relative flex items-center h-[42px] px-[11px] cursor-pointer transition-all duration-200 text-white/75 hover:bg-white/10 hover:text-white"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                    <FaSignOutAlt className="text-[15px]" />
                  </div>
                  <span className={`text-[13px] font-medium whitespace-nowrap ml-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Sign Out</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={(e) => { if(!isOpen){e.preventDefault(); setIsOpen(true);} else {setIsOpen(false);} }}
                className={({ isActive }) => `relative flex items-center h-[42px] px-[11px] cursor-pointer transition-all duration-200 ${isActive ? 'text-white font-bold bg-white/10' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
              >
                <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                  <FaUser className="text-[15px]" />
                </div>
                <span className={`text-[13px] font-medium whitespace-nowrap ml-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Sign In</span>
              </NavLink>
            )}
          </div>
        </nav>

        {/* Bottom contact */}
        <div className={`mb-4 flex flex-col items-center gap-3 ${isOpen ? 'items-start px-4' : ''}`}>
          <a href="tel:+254740881485" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors">
            <FaPhone className="text-xs shrink-0" />
            {isOpen && <span className="text-xs">0740881485</span>}
          </a>
          <a href="mailto:dominionsoftwares001@gmail.com" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors">
            <FaEnvelope className="text-xs shrink-0" />
            {isOpen && <span className="text-[11px]">dominionsoftwa...</span>}
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
            className="fixed inset-0 top-[115px] bg-black/30 z-[44] xl:hidden"
            onClick={() => {
              setIsOpen(false);
              setExpandedMobileRoute(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile layout: content beside sidebar, no overflow */}
      <style>{`
        @media (max-width: 1279px) {
          html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
            overscroll-behavior: none;
          }
          .app-content {
            margin-left: 40px;
            width: calc(100% - 40px);
            max-width: calc(100vw - 40px);
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
