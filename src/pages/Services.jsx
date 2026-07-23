import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaCheckCircle, FaArrowRight, FaRocket, FaShieldAlt } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const servicesData = [
  {
    num: '01',
    id: 'dominion-tickets',
    anchor: 'tickets',
    category: 'flagship',
    title: 'Dominion Tickets',
    shortDesc: 'Digital event ticketing, instant SMS/Email QR pass generation, seat registration, and mobile gate scanning.',
    tags: ['QR Gate Verification', 'SMS & Email Passes', 'M-Pesa Auto-Pay', 'Attendance Analytics'],
    fullDesc: 'Dominion Tickets is our proprietary digital event ticketing platform. It empowers organizers to list events, handle paid and free registrations, issue instant QR tickets directly via SMS and email, verify badges at entry gates using mobile scanners, and monitor real-time revenue analytics.',
    features: [
      'Instant SMS & Email QR Code Pass Delivery',
      'Mobile App Gate Scanner & Instant Ticket Validation',
      'M-Pesa Express (STK Push) & Paybill Auto-Reconciliation',
      'Real-Time Attendance Reports & Financial Analytics'
    ],
    badge: 'Proprietary SaaS Platform',
    isFlagship: true,
    actionText: 'Explore Dominion Tickets',
    actionLink: '/events'
  },
  {
    num: '02',
    id: 'dominion-votes',
    anchor: 'votes',
    category: 'flagship',
    title: 'Dominion Votes',
    shortDesc: 'Tamper-proof digital elections and voting platform with encrypted ballots, real-time audit trails, and instant tallies.',
    tags: ['OTP Voter Authentication', 'Encrypted Ballots', 'Live Result Tallies', 'AGM & Church Elections'],
    fullDesc: 'Dominion Votes provides secure, transparent digital voting for AGM elections, church leadership polls, SACCO ballots, and organizational voting. Features OTP voter verification, end-to-end ballot encryption, and instant automated result tallies.',
    features: [
      'SMS & Email OTP Voter Authentication System',
      'Tamper-Proof Encrypted Ballot Transmission',
      'Live Real-Time Election Audit Trails & Result Tallies',
      'Multi-Position Candidate Balloting & Voter Quotas'
    ],
    badge: 'Proprietary SaaS Platform',
    isFlagship: true,
    actionText: 'Request Voting System',
    actionLink: '/apply'
  },
  {
    num: '03',
    id: 'church-management',
    anchor: 'kingdom-tech',
    category: 'faith',
    title: 'Church & Ministry Management',
    shortDesc: 'Manage members, attendance, tithes, cell groups, communication, and ministry operations from a central platform.',
    tags: ['Member Directory', 'Cell Group Tracking', 'M-Pesa Tithes & Giving', 'Follow-Up SMS'],
    fullDesc: 'Our church management systems help churches organize membership directories, attendance tracking, tithes and offerings, events, cell groups, volunteer rosters, sermon archives, online giving, communication, and financial reporting from one platform.',
    features: [
      'Member & Family Directory with Cell Group Mapping',
      'Attendance Tracking & Automated Follow-Up SMS/Email',
      'Tithes, Offerings & Online M-Pesa Giving Integration',
      'Sermon Media Archive & Live Stream Embeds'
    ],
    badge: 'Faith-Based Platform'
  },
  {
    num: '04',
    id: 'payment-integration',
    anchor: 'enterprise',
    category: 'enterprise',
    title: 'Dominion Pay & Payment Engine',
    shortDesc: 'M-Pesa, STK Push, Paybill, subscriptions, and online donation gateways for automated collection.',
    tags: ['M-Pesa STK Push', 'Paybill Auto-Reconciliation', 'Card Checkout', 'Instant SMS Receipts'],
    fullDesc: 'Seamless financial gateway integrations connecting your software to local and international payment rails. Automate M-Pesa STK Push checkout, auto-match Paybill transaction IDs to client accounts, and issue digital SMS receipts instantly.',
    features: [
      'M-Pesa Express (STK Push) & Till Auto-Reconciliation',
      'Visa / Mastercard Credit & Debit Card Checkout',
      'Recurring Monthly Tithe & Partner Subscriptions',
      'Instant SMS & Email Payment Confirmation Receipts'
    ],
    badge: 'Fintech & Payment Engine'
  },
  {
    num: '05',
    id: 'mobile-apps',
    anchor: 'what-we-build',
    category: 'apps',
    title: 'Mobile App Development',
    shortDesc: 'Custom Android and iOS applications tailored specifically around your organization’s user workflow.',
    tags: ['iOS & Android Native', 'Push Notifications', 'Offline Sermon Caching', 'In-App Giving'],
    fullDesc: 'High-performance cross-platform mobile applications for churches, NGOs, and enterprise businesses featuring member self-service portals, real-time push notification alerts, offline sermon/data access, integrated mobile giving, and live support.',
    features: [
      'Cross-Platform iOS & Android Native Architecture',
      'Real-Time Push Notification Alert System',
      'Offline Data Access & Sermon Caching',
      'In-App Giving, Ticket Scanning & Biometric Security'
    ],
    badge: 'Mobile Engineering'
  },
  {
    num: '06',
    id: 'website-dev',
    anchor: 'what-we-build',
    category: 'apps',
    title: 'Website & Digital Portals',
    shortDesc: 'Modern, responsive websites and client portals designed to strengthen your digital presence.',
    tags: ['Responsive Modern UI', 'SEO & Analytics', 'Live Stream Player', 'Donation Portals'],
    fullDesc: 'Beautiful, high-converting websites optimized for lightning-fast speeds, search engines, mobile responsiveness, live stream integration, donation portals, and intuitive content management that empowers your team.',
    features: [
      'Responsive Mobile-First Modern Design',
      'Search Engine Optimization (SEO) & Analytics',
      'Live Streaming & Media Player Embeds',
      'Online Donation & Client Portal Integration'
    ],
    badge: 'Web Systems'
  },
  {
    num: '07',
    id: 'process-automation',
    anchor: 'enterprise',
    category: 'enterprise',
    title: 'Business Process Automation',
    shortDesc: 'Replace manual administrative work with efficient digital workflows that save time and eliminate errors.',
    tags: ['Approval Workflows', 'Task Escalation', 'Asset Automation', 'Triggered SMS Alerts'],
    fullDesc: 'Transform repetitive manual processes into streamlined digital workflows. We automate document processing, task assignments, approval routing, inventory tracking, and client notifications so your team can focus on impact.',
    features: [
      'Automated Approval & Document Workflows',
      'Role-Based Task Routing & Escalation',
      'Inventory, Expense & Asset Automation',
      'Instant Email & SMS Triggered Alerts'
    ],
    badge: 'Workflow Engineering'
  },
  {
    num: '08',
    id: 'cloud-it',
    anchor: 'cloud',
    category: 'cloud',
    title: 'Cloud & Managed IT Solutions',
    shortDesc: 'Cloud hosting, automated backups, SSL security, system integration, and technical support.',
    tags: ['Cloud Hosting', 'Automated Daily Backups', 'SSL & Firewall', '24/7 Monitoring'],
    fullDesc: 'Reliable cloud infrastructure setup, automated database backups, SSL security, system integration, domain management, and 24/7 technical support to ensure your platforms remain online and secure at all times with 99.9% uptime.',
    features: [
      'Cloud Server Hosting & Domain Management',
      'Automated Daily Encrypted Database Backups',
      'SSL Security, Firewall & Anti-DDoS Protection',
      '24/7 Ongoing System Monitoring & Tech Support'
    ],
    badge: 'Cloud & IT Support'
  }
];

const processSteps = [
  { step: '01', title: 'Discovery', desc: 'We learn about your organization, goals, and challenges through in-depth consultation.' },
  { step: '02', title: 'Planning', desc: 'Our team creates a detailed project roadmap with timelines, milestones, and deliverables.' },
  { step: '03', title: 'Development', desc: 'We build your solution using agile methodology with regular progress updates.' },
  { step: '04', title: 'Testing', desc: 'Rigorous quality assurance ensures your software is reliable, secure, and performant.' },
  { step: '05', title: 'Deployment', desc: 'Smooth launch with training and documentation for your team.' },
  { step: '06', title: 'Support', desc: 'Ongoing maintenance, updates, and support to keep your systems running perfectly.' }
];

export default function Services() {
  const [expandedId, setExpandedId] = useState(null);
  const [processRef, processInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-cream min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-cream-dark/60 via-cream to-cream">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs uppercase tracking-widest font-bold">
              Faith-Driven & Enterprise Technology
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Our <span className="text-primary">Services</span> & Digital Ecosystem
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-body text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-4 font-normal text-gray-700">
            At <strong className="text-heading font-bold">Dominion Softwares</strong>, we deliver innovative technology solutions that help organizations streamline operations, automate processes, and maximize their impact. Our core specialization is serving <strong className="text-primary font-bold">churches, ministries, mission organizations, Christian institutions, charities, and NGOs</strong>, equipping them with digital solutions that advance their mission and improve operational excellence.
          </motion.p>

          <motion.p variants={fadeInUp} className="text-body text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-4 font-normal text-gray-700">
            While faith-based organizations are at the heart of what we do, our expertise extends far beyond them. We proudly partner with <strong className="text-heading font-bold">businesses, educational institutions, healthcare providers, government agencies, startups, and organizations across every industry</strong>, delivering tailored software solutions that solve real-world challenges and drive sustainable growth.
          </motion.p>

          <motion.p variants={fadeInUp} className="text-body-light text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-gray-600">
            From custom software development and business process automation to websites, mobile applications, payment integrations, and cloud-based systems, we design solutions that are secure, scalable, and built around your organization&apos;s unique goals. Whatever your vision, Dominion Softwares is committed to turning it into reliable, impactful technology.
          </motion.p>
        </motion.div>
      </section>

      {/* ===== SECTION ANCHORS FOR NAVBAR DEEP LINKING ===== */}
      <div id="kingdom-tech" className="scroll-mt-28" />
      <div id="enterprise" className="scroll-mt-28" />
      <div id="what-we-build" className="scroll-mt-28" />
      <div id="tickets" className="scroll-mt-28" />
      <div id="votes" className="scroll-mt-28" />

      {/* ===== CLEAN EXECUTIVE SERVICES GRID (ICON-FREE & SCANNABLE AT A GLANCE) ===== */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {servicesData.map((service) => {
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                id={service.anchor || service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg ${
                  isExpanded ? 'border-primary ring-2 ring-primary/15 shadow-md' : 'border-border-light hover:border-primary/40'
                }`}
              >
                {/* Card Top Section (Scannable At A Glance) */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black tracking-widest text-primary/40 bg-cream-dark px-2 py-0.5 rounded-md font-mono">
                        {service.num}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        service.isFlagship 
                          ? 'bg-primary/10 text-primary border-primary/30 font-extrabold' 
                          : 'bg-cream text-heading/80 border-border-light'
                      }`}>
                        {service.badge}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-heading mb-2 leading-snug">
                    {service.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-body text-xs sm:text-sm leading-relaxed mb-4 font-normal text-gray-700">
                    {service.shortDesc}
                  </p>

                  {/* At-a-glance feature pills (Scannable immediately without clicking) */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] font-semibold text-heading/90 bg-cream-dark/60 border border-border-light/70 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expand / Collapse Toggle Link */}
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                      isExpanded
                        ? 'bg-secondary text-white shadow-xs'
                        : 'bg-cream text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    <span>
                      {isExpanded ? 'Hide Detailed Overview' : 'View Full System Capabilities'}
                    </span>
                    <FaChevronDown className={`text-[11px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                  </button>
                </div>

                {/* Expanded Detailed Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="border-t border-border-light bg-gradient-to-b from-cream/30 via-white to-white p-6 sm:p-7"
                    >
                      <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-primary mb-2">
                        System Architecture & Purpose
                      </h3>
                      <p className="text-body text-xs sm:text-sm leading-relaxed mb-5 text-gray-700">
                        {service.fullDesc}
                      </p>

                      <h4 className="text-[11px] font-bold text-heading uppercase tracking-wider mb-3">
                        Included Key Modules & Capabilities:
                      </h4>
                      <ul className="space-y-2 mb-5">
                        {service.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-heading font-medium">
                            <FaCheckCircle className="text-primary text-xs shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-border-light/60 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold text-body-light flex items-center gap-1">
                          <FaShieldAlt className="text-secondary" /> Enterprise Reliability
                        </span>
                        <Link
                          to={service.actionLink || '/apply'}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-sm hover:shadow-primary/20"
                        >
                          {service.actionText || 'Request Solution'} <FaArrowRight className="text-[10px]" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== OUR 6-STEP PROCESS ===== */}
      <section id="process" ref={processRef} className="section-padding bg-cream-dark/40 border-t border-border-light">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden"
            animate={processInView ? 'visible' : 'hidden'} variants={stagger}>
            <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-widest font-bold">Our Methodology</motion.span>
            <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mt-2">
              Our <span className="text-primary">6-Step Process</span>
            </motion.h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden"
            animate={processInView ? 'visible' : 'hidden'} variants={stagger}>
            {processSteps.map((p) => (
              <motion.div key={p.step} variants={fadeInUp}
                className="bg-white rounded-2xl p-7 border border-border-light
                           hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 group"
              >
                <span className="text-5xl font-bold text-primary/15 group-hover:text-primary/30 transition-colors">{p.step}</span>
                <h3 className="text-heading text-xl font-semibold mt-4 mb-3">{p.title}</h3>
                <p className="text-body text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="section-padding bg-cream">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden"
          whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-primary">Transform</span> Your Organization?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body text-lg mb-8 max-w-2xl mx-auto">
            Whether you need Dominion Tickets, Dominion Votes, a church management platform, payment integration, or custom software, our team is ready to deliver.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
              Apply for Software Project <FaRocket />
            </Link>
            <Link to="/contact" className="btn-outline inline-flex items-center gap-2">
              Talk to Our Engineers
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
