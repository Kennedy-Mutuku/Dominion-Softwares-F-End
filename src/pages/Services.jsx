import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  FaChurch, FaMobileAlt, FaGlobe, FaCogs, FaCreditCard,
  FaLaptopCode, FaPalette, FaCloud, FaChevronDown, FaCheckCircle,
  FaArrowRight, FaRocket, FaShieldAlt
} from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const servicesData = [
  {
    id: 'church-management',
    anchor: 'kingdom-tech',
    emoji: '💒',
    icon: FaChurch,
    category: 'faith',
    title: 'Church Management Systems',
    shortDesc: 'Manage members, attendance, giving, events, communication, and ministry operations from one platform.',
    fullDesc: 'Our church management systems help churches organize membership, attendance, tithes and offerings, events, cell groups, volunteer coordination, sermon archives, online giving, communication, and reporting—all from a centralized platform designed specifically for ministry excellence.',
    features: [
      'Member & Family Directory with Cell Group Tracking',
      'Attendance Tracking & Automated Follow-up SMS/Email',
      'Tithes, Offerings & Online M-Pesa Giving Integration',
      'Volunteer Roster & Event Ministry Scheduling',
      'Sermon Media Archive & Live Stream Integration'
    ],
    color: 'from-amber-500/10 to-orange-500/10',
    badge: 'Faith-Based Solution'
  },
  {
    id: 'mobile-apps',
    anchor: 'what-we-build',
    emoji: '📱',
    icon: FaMobileAlt,
    category: 'apps',
    title: 'Mobile App Development',
    shortDesc: 'Custom Android and iOS applications tailored to your organization’s unique user experience.',
    fullDesc: 'High-performance cross-platform mobile apps for churches, NGOs, and businesses featuring member self-service portals, push notification alerts, offline sermon/data access, integrated mobile giving, and real-time support.',
    features: [
      'Cross-Platform iOS & Android Native Build',
      'Real-Time Push Notification Alert System',
      'Offline Data Access & Sermon Caching',
      'In-App Giving, Ticket Scanning & Biometric Auth'
    ],
    color: 'from-blue-500/10 to-indigo-500/10',
    badge: 'Mobile & iOS/Android'
  },
  {
    id: 'website-dev',
    anchor: 'what-we-build',
    emoji: '🌐',
    icon: FaGlobe,
    category: 'apps',
    title: 'Website Development',
    shortDesc: 'Modern, responsive websites designed to strengthen your digital presence and drive engagement.',
    fullDesc: 'Beautiful, high-converting websites optimized for lightning-fast speeds, search engines, mobile responsiveness, live stream integration, donation portals, and intuitive content management that empowers your team.',
    features: [
      'Responsive Mobile-First Modern Design',
      'Search Engine Optimization (SEO) & Analytics',
      'Live Streaming & Media Player Embeds',
      'Online Donation & Contact Form Integration'
    ],
    color: 'from-emerald-500/10 to-teal-500/10',
    badge: 'Web & Digital'
  },
  {
    id: 'process-automation',
    anchor: 'enterprise',
    emoji: '⚙️',
    icon: FaCogs,
    category: 'enterprise',
    title: 'Business Process Automation',
    shortDesc: 'Replace manual work with efficient digital workflows that save time and eliminate human error.',
    fullDesc: 'Transform repetitive manual processes into streamlined digital workflows. We automate document processing, task assignments, approval routing, inventory tracking, and client notifications so your team can focus on impact.',
    features: [
      'Automated Approval & Document Workflows',
      'Role-Based Task Routing & Escalation',
      'Inventory, Expense & Asset Automation',
      'Instant Email & SMS Triggered Alerts'
    ],
    color: 'from-purple-500/10 to-violet-500/10',
    badge: 'Workflow & Productivity'
  },
  {
    id: 'payment-integration',
    anchor: 'enterprise',
    emoji: '💳',
    icon: FaCreditCard,
    category: 'enterprise',
    title: 'Payment Integration',
    shortDesc: 'M-Pesa, STK Push, Paybill, subscriptions, and online donation gateways for automated collection.',
    fullDesc: 'Seamless local and international payment gateway integrations including M-Pesa STK Push, Till/Paybill reconciliation, credit card processing, recurring partner tithes/donations, and instant SMS receipts for donor transparency.',
    features: [
      'M-Pesa Express (STK Push) & Paybill Auto-Reconciliation',
      'Visa / Mastercard Credit & Debit Card Checkout',
      'Recurring Subscriptions & Monthly Partner Giving',
      'Instant SMS & Email Payment Confirmation Receipts'
    ],
    color: 'from-emerald-500/10 to-green-500/10',
    badge: 'Fintech & Payments'
  },
  {
    id: 'custom-software',
    anchor: 'what-we-build',
    emoji: '🖥️',
    icon: FaLaptopCode,
    category: 'apps',
    title: 'Custom Software Development',
    shortDesc: 'Tailor-made software solutions built specifically around your organization’s exact needs.',
    fullDesc: 'Tailor-made web applications, ERPs, member portals, and database management systems engineered to fit your exact operational workflows and scale seamlessly as your organization expands.',
    features: [
      'Custom ERP & Enterprise Resource Systems',
      'Bespoke Database Schema & API Architecture',
      'High-Security JWT Authentication & Encryption',
      'Comprehensive Reporting & PDF Export Engines'
    ],
    color: 'from-cyan-500/10 to-blue-500/10',
    badge: 'Custom Engineering'
  },
  {
    id: 'branding-media',
    anchor: 'creative',
    emoji: '🎨',
    icon: FaPalette,
    category: 'creative',
    title: 'Branding & Creative Media',
    shortDesc: 'Graphics, video, photography, branding, and digital content that amplify your message.',
    fullDesc: 'Complete visual identity and media solutions including logo design, brand identity systems, sermon graphics, social media templates, event banners, and promotional video production that communicate excellence.',
    features: [
      'Logo & Complete Brand Identity Guidelines',
      'Social Media Flyer & Sermon Graphics Packages',
      'Event Video Editing & Motion Graphics',
      'High-Resolution Photography & Digital Banners'
    ],
    color: 'from-rose-500/10 to-pink-500/10',
    badge: 'Creative & Identity'
  },
  {
    id: 'cloud-it',
    anchor: 'cloud',
    emoji: '☁️',
    icon: FaCloud,
    category: 'cloud',
    title: 'Cloud & IT Solutions',
    shortDesc: 'Hosting, security, backups, system integration, and technical support for 99.9% reliability.',
    fullDesc: 'Reliable cloud infrastructure setup, automated database backups, SSL security, system integration, domain management, and 24/7 technical support to ensure your platforms remain online and secure at all times.',
    features: [
      'Cloud Server Hosting & Domain Management',
      'Automated Daily Encrypted Database Backups',
      'SSL Security, Firewall & Anti-DDoS Protection',
      '24/7 Ongoing System Monitoring & Tech Support'
    ],
    color: 'from-sky-500/10 to-indigo-500/10',
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
            Our <span className="text-primary">Services</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-body text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto mb-6">
            Technology solutions that help churches, ministries, NGOs, charities, businesses, and organizations operate smarter, serve better, and grow faster.
          </motion.p>

          <motion.p variants={fadeInUp} className="text-body-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We design software, automate workflows, build websites and mobile apps, integrate payment systems, and provide digital solutions that transform how organizations operate.
          </motion.p>
        </motion.div>
      </section>

      {/* ===== SECTION ANCHORS FOR NAVBAR DEEP LINKING ===== */}
      <div id="kingdom-tech" className="scroll-mt-28" />
      <div id="enterprise" className="scroll-mt-28" />
      <div id="what-we-build" className="scroll-mt-28" />

      {/* ===== SERVICES GRID (QUICK OVERVIEW + EXPAND FOR MORE) ===== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {servicesData.map((service) => {
            const isExpanded = expandedId === service.id;
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                id={service.anchor || service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${isExpanded ? 'border-primary ring-2 ring-primary/20 shadow-xl' : 'border-border-light hover:border-primary/40'
                  }`}
              >
                {/* Card Header (Quick Overview) */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl shrink-0" role="img" aria-label={service.title}>
                        {service.emoji}
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cream-dark text-primary border border-primary/20">
                          {service.badge}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-heading mt-1 leading-snug">
                          {service.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Short 1-sentence description (Quick Glance) */}
                  <p className="text-body text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {service.shortDesc}
                  </p>

                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${isExpanded
                        ? 'bg-secondary text-white shadow-sm'
                        : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? 'Show Less Overview' : 'Learn More & Key Features'}
                    </span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
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
                      className="border-t border-border-light bg-gradient-to-b from-cream/40 via-white to-white p-6 sm:p-7"
                    >
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-2">
                        Detailed System Capability
                      </h3>
                      <p className="text-body text-sm leading-relaxed mb-6">
                        {service.fullDesc}
                      </p>

                      <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">
                        Included Key Modules & Capabilities:
                      </h4>
                      <ul className="space-y-2.5 mb-6">
                        {service.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-heading">
                            <FaCheckCircle className="text-primary text-sm shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-border-light/60 flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-body-light flex items-center gap-1.5">
                          <FaShieldAlt className="text-secondary" /> Guaranteed 99.9% Uptime
                        </span>
                        <Link
                          to="/apply"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-md hover:shadow-primary/20"
                        >
                          Request Solution <FaArrowRight className="text-xs" />
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
            Whether you need a church management platform, payment integration, mobile app, or enterprise custom software, our team is ready to deliver.
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
