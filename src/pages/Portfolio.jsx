import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaMobileAlt, FaTicketAlt, FaExternalLinkAlt, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const projects = [
  {
    category: 'software',
    title: 'Custom Enterprise Resource Platforms',
    desc: 'Scalable web-based ERP systems built for financial integrity, member management, and real-time operational reporting.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    icon: FaLaptopCode,
    color: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-200'
  },
  {
    category: 'mobile',
    title: 'Mobile Applications & Portal Systems',
    desc: 'High-performance cross-platform mobile apps for iOS and Android, providing seamless user access, real-time push alerts, and secure authentication.',
    tags: ['React Native', 'REST API', 'Push Notifications', 'OAuth'],
    icon: FaMobileAlt,
    color: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-200'
  },
  {
    category: 'tickets',
    title: 'Event Ticketing & Verification Platform',
    desc: 'End-to-end event ticketing management featuring instant ticket issuance, dynamic QR scanning, check-in validation, and live sales dashboards.',
    tags: ['QR Scanner', 'Ticket Validation', 'Stripe/M-Pesa', 'Live Analytics'],
    icon: FaTicketAlt,
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-200'
  }
];

export default function Portfolio() {
  return (
    <div className="bg-cream min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-bold">
            Our Work & Impact
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold text-heading mt-3 mb-6">
            Featured <span className="text-primary">Portfolio</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-base sm:text-lg leading-relaxed">
            Explore our custom software solutions, mobile applications, and ticketing platforms engineered to drive real-world transformation.
          </motion.p>
        </motion.div>

        {/* Section 1: Software Solutions */}
        <section id="software" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FaLaptopCode className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading">Software Solutions</h2>
              <p className="text-xs text-body-light">Web platforms, ERPs, and custom enterprise systems</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-border-light shadow-md hover:shadow-xl transition-shadow">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Enterprise ERP</span>
              <h3 className="text-xl font-bold text-heading mt-4 mb-3">Custom Enterprise Resource Platforms</h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                Scalable web-based platforms for organization governance, financial tracking, member management, and automated workflow processing.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'Node.js', 'MongoDB', 'Tailwind'].map(t => (
                  <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">{t}</span>
                ))}
              </div>
              <Link to="/apply" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                Request Similar System <FaRocket className="text-xs" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/5 via-white to-cream p-8 rounded-3xl border border-primary/20 shadow-md flex flex-col justify-center">
              <h4 className="text-lg font-bold text-heading mb-4">Key Capabilities Delivered:</h4>
              <ul className="space-y-3">
                {['Multi-role admin dashboards', 'Real-time financial analytics', 'Secure JWT authentication', 'Automated email alerts'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-body">
                    <FaCheckCircle className="text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Mobile Applications */}
        <section id="mobile" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <FaMobileAlt className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading">Mobile Applications</h2>
              <p className="text-xs text-body-light">iOS and Android mobile portal solutions</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-border-light shadow-md hover:shadow-xl transition-shadow">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">Mobile Portal</span>
              <h3 className="text-xl font-bold text-heading mt-4 mb-3">Cross-Platform Mobile Apps</h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                Native-performance mobile applications offering member self-service portals, push notifications, offline syncing, and instant support ticketing.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React Native', 'REST API', 'Push Alerts', 'OAuth 2.0'].map(t => (
                  <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">{t}</span>
                ))}
              </div>
              <Link to="/apply" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                Get a Quote for App <FaRocket className="text-xs" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-amber-500/5 via-white to-cream p-8 rounded-3xl border border-amber-200 shadow-md flex flex-col justify-center">
              <h4 className="text-lg font-bold text-heading mb-4">Key Capabilities Delivered:</h4>
              <ul className="space-y-3">
                {['Seamless mobile biometric authentication', 'Instant push notification system', 'Offline data sync & cache', 'Integrated in-app tickets & support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-body">
                    <FaCheckCircle className="text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Ticketing System */}
        <section id="tickets" className="mb-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <FaTicketAlt className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading">Ticketing System</h2>
              <p className="text-xs text-body-light">Event ticketing, QR scanners, and attendee management</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-border-light shadow-md hover:shadow-xl transition-shadow">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Ticketing Platform</span>
              <h3 className="text-xl font-bold text-heading mt-4 mb-3">Dominion Event & Ticketing Engine</h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                Complete event booking and verification system enabling organizers to list events, issue instant QR tickets, and scan attendees at the door seamlessly.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['QR Code Engine', 'M-Pesa/Card Checkout', 'Scanner App', 'Live Check-in'].map(t => (
                  <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">{t}</span>
                ))}
              </div>
              <Link to="/tickets" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                Explore Event Tickets <FaExternalLinkAlt className="text-xs" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/5 via-white to-cream p-8 rounded-3xl border border-emerald-200 shadow-md flex flex-col justify-center">
              <h4 className="text-lg font-bold text-heading mb-4">Key Capabilities Delivered:</h4>
              <ul className="space-y-3">
                {['Instant QR code PDF ticket generation', 'High-speed camera scanner validation', 'Real-time check-in stats & fraud prevention', 'Organizer sales & commission dashboard'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-body">
                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
