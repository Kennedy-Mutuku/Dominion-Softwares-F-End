import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FaCode, FaMobileAlt, FaCloud, FaShieldAlt, FaChartLine, FaCogs,
  FaArrowRight, FaChurch, FaSchool, FaGlobeAfrica, FaBuilding,
  FaCheckCircle, FaQuoteLeft, FaTicketAlt, FaUsers, FaHeart, FaBriefcase
} from 'react-icons/fa';
import AnimatedSphere from '../components/AnimatedSphere';
import EventCard from '../components/tickets/EventCard';
import api from '../utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

function AnimatedCounter({ target, suffix = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const displayRef = useRef(null);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, parseInt(target), { duration: 2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (displayRef.current) displayRef.current.textContent = v + suffix;
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={(el) => { ref(el); displayRef.current = el; }}>0{suffix}</span>;
}

// Only the headline rotates. Everything below it stays perfectly still.
const heroLines = [
  'Empowering Kingdoms Through Technology',
  'Building Systems That Amplify Your Mission',
  'Where Faith Meets Innovation',
  'Software Crafted for Kingdom Impact',
  'Technology That Serves with Purpose',
];

const services = [
  { icon: FaCode, title: 'Custom Software', desc: 'Tailored solutions for churches, missions, and organizations that streamline operations.' },
  { icon: FaMobileAlt, title: 'Mobile Apps', desc: 'Cross-platform mobile applications that keep your community connected on the go.' },
  { icon: FaCloud, title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and hosting for reliable, always-on service.' },
  { icon: FaShieldAlt, title: 'IT Security', desc: 'Protect your organization\'s data with enterprise-grade security solutions.' },
  { icon: FaChartLine, title: 'Digital Strategy', desc: 'Data-driven digital transformation consulting to optimize your operations.' },
  { icon: FaCogs, title: 'System Integration', desc: 'Seamlessly connect your existing tools and platforms for unified workflows.' },
];

const clientTypes = [
  { icon: FaChurch, label: 'Churches', count: '15+' },
  { icon: FaGlobeAfrica, label: 'Missions', count: '8+' },
  { icon: FaSchool, label: 'Schools', count: '5+' },
  { icon: FaBuilding, label: 'Businesses', count: '10+' },
];

const testimonials = [
  { name: 'Pastor James K.', org: 'Grace Community Church', text: 'Dominion Softwares transformed our church management. Member tracking, giving reports, and communication—all in one place.', avatar: 'JK' },
  { name: 'Sarah M.', org: 'Hope Missions International', text: 'Their mission management system has made coordinating our field teams across 5 countries effortless.', avatar: 'SM' },
  { name: 'David O.', org: 'Victory Schools Network', text: 'The school management system they built handles admissions, grading, and parent communication beautifully.', avatar: 'DO' },
];

const whyUs = [
  'Specialized in organization software (churches, missions, schools)',
  'End-to-end development from design to deployment',
  'M-Pesa & mobile payment integration expertise',
  'Ongoing support and maintenance included',
  'Agile development with regular progress updates',
  'Affordable pricing tailored for organizations',
];

function DominionTicketsSection() {
  const [events, setEvents] = useState([]);
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/events/featured');
        setEvents(data.data || []);
      } catch (_) {}
    };
    fetchFeatured();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-3">
            <FaTicketAlt className="text-primary text-xl" />
            <span className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
              Dominion Tickets
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold mt-2 mb-4 text-heading">
            Discover Upcoming Events
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body max-w-2xl mx-auto text-base md:text-lg">
            Browse amazing events and get your tickets instantly. Professional e-tickets with QR code validation.
          </motion.p>
        </motion.div>

        {events.length > 0 ? (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate={sectionInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {events.slice(0, 4).map((event) => (
              <motion.div key={event._id} variants={fadeInUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate={sectionInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="text-center py-10"
          >
            <p className="text-body-light mb-4">No upcoming events right now. Check back soon!</p>
          </motion.div>
        )}

        <motion.div
          className="text-center mt-10"
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <Link to="/tickets" className="btn-outline inline-flex items-center gap-2">
            View All Events <FaArrowRight className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function WhoWeServeSection() {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const audiences = [
    {
      icon: FaChurch,
      label: 'Local Church / Single Congregation',
      desc: 'Member management, giving tracking, event planning, communication tools, and worship scheduling for individual churches.',
      color: 'bg-blue-500',
    },
    {
      icon: FaUsers,
      label: 'Multi-Branch Ministry / Fellowship',
      desc: 'Centralized systems for denominations and church networks managing multiple locations, pastors, and congregations.',
      color: 'bg-purple-500',
    },
    {
      icon: FaHeart,
      label: 'Parachurch Organizations',
      desc: 'Custom platforms for evangelistic ministries, youth movements, choir groups, and specialized Kingdom work.',
      color: 'bg-pink-500',
    },
    {
      icon: FaGlobeAfrica,
      label: 'Faith-Based NGOs & Outreach',
      desc: 'Project management, donor tracking, field coordination, and impact reporting for community outreach organizations.',
      color: 'bg-green-500',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
            Who We Build For
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold mt-3 mb-4 text-heading">
            Empowering <span className="text-primary">Kingdom</span> Organizations
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Whether you're a local church, a multi-branch ministry, a parachurch organization, 
            or a faith-based NGO — we build custom software that amplifies your mission.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-10"
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.label}
              variants={fadeInUp}
              className="bg-cream rounded-2xl p-7 border border-border-light
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30
                         hover:-translate-y-1 transition-all duration-400 group"
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-xl ${audience.color} flex items-center justify-center shrink-0
                                 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <audience.icon className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-heading mb-2 group-hover:text-primary transition-colors">
                    {audience.label}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">
                    {audience.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <div className="inline-block bg-cream-dark/50 rounded-2xl px-8 py-5 border border-primary/20">
            <p className="text-body text-sm md:text-base flex items-center gap-2 flex-wrap justify-center">
              <FaBriefcase className="text-primary" />
              <span>We also build <span className="font-semibold text-heading">custom software for businesses</span> across various industries.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [sphereSize, setSphereSize] = useState(420);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const updateSize = () => setSphereSize(window.innerWidth < 768 ? 160 : 420);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [whyUsRef, whyUsInView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [clientsRef, clientsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cream">
      {/* ========== HERO - GraceDishes style ========== */}
      <section className="flex items-center relative overflow-hidden bg-cream py-2 lg:py-8 lg:min-h-[85vh]">
        <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto !py-4 lg:!py-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">

            {/* Left - Content */}
            <motion.div
              className="flex-1 text-center lg:text-left order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* ---- ROTATING HEADLINE (only this changes) ---- */}
              <div className="mb-2 overflow-hidden" style={{ minHeight: '2.8em' }}>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={slideIndex}
                    className="text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3rem] font-extrabold leading-[1.15] text-heading"
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {heroLines[slideIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* ---- EVERYTHING BELOW IS FIXED (never moves) ---- */}
              <p className="text-primary font-bold text-base md:text-lg tracking-wide mb-4">
                Dominion Softwares Ltd &mdash; Professional Software Solutions
              </p>

              <p className="text-body text-base md:text-lg max-w-2xl mb-4 leading-relaxed lg:mx-0 mx-auto">
                We build <span className="text-primary font-semibold">custom software systems</span> for ministries, churches of all kinds, 
                faith-based organizations, and businesses — empowering your mission with technology that works.
              </p>

              {/* Slide indicators */}
              <div className="flex gap-2 mb-6 justify-center lg:justify-start">
                {heroLines.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      i === slideIndex ? 'w-8 bg-primary' : 'w-3 bg-primary/25'
                    }`}
                  />
                ))}
              </div>

              {/* Stats - exactly like GraceDishes: bold dark numbers in a row */}
              <motion.div variants={fadeInUp} className="flex items-center gap-10 md:gap-14 mb-8 justify-center lg:justify-start">
                {[
                  { value: '50', suffix: '+', label: 'Projects' },
                  { value: '99', suffix: '%', label: 'Satisfaction' },
                  { value: '30', suffix: '+', label: 'Clients' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-extrabold text-heading">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-body-light text-xs md:text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons - GraceDishes style: solid + outline rounded */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/apply" className="btn-primary text-center flex items-center justify-center gap-2">
                  Start Your Project
                </Link>
                <Link to="/services" className="btn-outline text-center">
                  Browse Services
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Sphere */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end relative order-1 lg:order-2 mb-2 lg:mb-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <AnimatedSphere size={sphereSize} variant="light" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      {/* ========== WHO WE BUILD FOR ========== */}
      <WhoWeServeSection />

      <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      {/* ========== DOMINION TICKETS - Featured Events ========== */}
      <DominionTicketsSection />

      <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      {/* ========== TESTIMONIALS ========== */}
      <section ref={testimonialsRef} className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
              Testimonials
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold mt-3 text-heading">
              What Our Clients Say
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp}
                className="bg-white rounded-2xl p-8 border border-border-light
                           hover:shadow-lg hover:shadow-primary/8 transition-all duration-400"
              >
                <FaQuoteLeft className="text-primary/20 text-2xl mb-3" />
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-body mb-6 text-sm leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-heading">{t.name}</p>
                    <p className="text-primary text-xs">{t.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section className="section-padding bg-cream-dark/40">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold mb-4 text-heading">
            Have a Project in Mind?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body text-base md:text-lg mb-8">
            Let&apos;s discuss how Dominion Softwares can help your organization
            achieve its digital goals.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply" className="btn-primary flex items-center justify-center gap-2 group">
              Get Started <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="btn-outline">View Our Work</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
