import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FaCode, FaMobileAlt, FaCloud, FaShieldAlt, FaChartLine, FaCogs,
  FaArrowRight, FaChurch, FaSchool, FaGlobeAfrica, FaBuilding,
  FaCheckCircle, FaQuoteLeft, FaTicketAlt
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
  'Quality Software, Delivered with Excellence',
  'Empowering Churches & Transforming Communities',
  'Automate. Optimize. Dominate.',
  'Your Vision Brought to Life, Beautifully',
  'Technology That Serves with Purpose',
  'Building What Organizations Dream Of',
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

export default function Home() {
  const [sphereSize, setSphereSize] = useState(420);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const updateSize = () => setSphereSize(window.innerWidth < 768 ? 250 : 420);
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
      <section className="flex items-center relative overflow-hidden bg-cream py-8 lg:min-h-[85vh]">
        <div className="relative z-10 section-padding !py-12 lg:!py-16 w-full">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

            {/* Left - Content */}
            <motion.div
              className="flex-1 text-center lg:text-left order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* ---- ROTATING HEADLINE (only this changes) ---- */}
              <div className="mb-2 overflow-hidden" style={{ minHeight: '3.6em' }}>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={slideIndex}
                    className="text-4xl sm:text-5xl md:text-[3.2rem] lg:text-[3.5rem] font-extrabold leading-[1.15] text-heading"
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
              <p className="text-primary font-bold text-base md:text-lg tracking-wider mb-4">
                Dominion Softwares &mdash; Where Purpose Meets Innovation
              </p>

              <p className="text-body text-base md:text-lg max-w-lg mb-4 leading-relaxed lg:mx-0 mx-auto">
                Custom software &bull; Church systems &bull; School platforms
                &bull; Mission tools &bull; M-Pesa integration
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
              className="flex-1 flex justify-center lg:justify-end relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <AnimatedSphere size={sphereSize} variant="light" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== DIVIDER - warm gradient bar ========== */}
      <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      {/* ========== SECTION TITLE like GraceDishes "Discover Amazing Flavors" ========== */}
      <section ref={clientsRef} className="py-16 bg-cream-dark/50">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial="hidden"
          animate={clientsInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-12">
            Trusted by Organizations Across East Africa
          </motion.h2>

          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {clientTypes.map((client) => (
              <div key={client.label}
                className="flex flex-col items-center gap-3 py-7 px-4 rounded-2xl bg-white border border-border-light
                           hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-default"
              >
                <client.icon className="text-3xl text-primary/50 group-hover:text-primary transition-colors" />
                <span className="text-2xl font-extrabold text-heading">{client.count}</span>
                <span className="text-body-light text-sm">{client.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SERVICES ========== */}
      <section ref={servicesRef} className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            animate={servicesInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
              What We Offer
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold mt-3 mb-4 text-heading">
              Our Services
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-body max-w-2xl mx-auto text-base md:text-lg">
              From concept to deployment, we deliver end-to-end technology solutions
              tailored for organizations making a difference.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate={servicesInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-7 border border-border-light
                           hover:shadow-xl hover:shadow-primary/8 hover:border-primary/25
                           hover:-translate-y-1 transition-all duration-400 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5
                                group-hover:bg-primary group-hover:shadow-[0_4px_15px_rgba(232,130,12,0.3)] transition-all duration-300">
                  <service.icon className="text-primary text-lg group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-heading group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-body text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial="hidden"
            animate={servicesInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
          >
            <Link to="/services" className="btn-outline inline-flex items-center gap-2">
              View All Services <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== DOMINION TICKETS - Featured Events ========== */}
      <DominionTicketsSection />

      {/* ========== WHY CHOOSE US ========== */}
      <section ref={whyUsRef} className="section-padding bg-cream-dark/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate={whyUsInView ? 'visible' : 'hidden'}
              variants={stagger}
            >
              <motion.span variants={fadeInLeft} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
                Why Dominion Softwares
              </motion.span>
              <motion.h2 variants={fadeInLeft} className="text-3xl md:text-4xl font-extrabold mt-3 mb-5 text-heading">
                Why Organizations Choose Us
              </motion.h2>
              <motion.p variants={fadeInLeft} className="text-body text-base md:text-lg mb-8 leading-relaxed">
                We understand the unique needs of churches, missions, and community organizations.
                Our solutions are built with purpose, delivering real value from day one.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-4">
                {whyUs.map((item) => (
                  <motion.li key={item} variants={fadeInLeft} className="flex items-start gap-3">
                    <FaCheckCircle className="text-primary mt-1 shrink-0" />
                    <span className="text-body text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeInLeft} className="mt-8">
                <Link to="/about" className="btn-primary inline-flex items-center gap-2 group">
                  About Our Team
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={whyUsInView ? 'visible' : 'hidden'}
              variants={fadeInRight}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-border-light shadow-sm">
                    <div className="text-3xl font-extrabold text-primary mb-1">5+</div>
                    <div className="text-sm text-body">Years of Experience</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-border-light shadow-sm">
                    <div className="text-3xl font-extrabold text-primary mb-1">24/7</div>
                    <div className="text-sm text-body">Technical Support</div>
                  </div>
                </div>
                <div className="space-y-5 mt-8">
                  <div className="bg-white rounded-2xl p-6 border border-border-light shadow-sm">
                    <div className="text-3xl font-extrabold text-primary mb-1">100%</div>
                    <div className="text-sm text-body">Project Completion</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-border-light shadow-sm">
                    <div className="text-3xl font-extrabold text-primary mb-1">50+</div>
                    <div className="text-sm text-body">Projects Delivered</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="relative overflow-hidden">
        <div className="bg-primary py-16 px-6 md:px-12">
          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold mb-4 text-white">
              Ready to Transform Your Organization?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Tell us about your project and let our team craft the perfect software solution
              for your church, mission, or organization.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply"
                className="bg-white text-primary px-8 py-3.5 rounded-full font-bold
                           hover:bg-heading hover:text-white transition-all duration-300
                           shadow-lg text-center cursor-pointer">
                Apply for Software Development
              </Link>
              <Link to="/contact"
                className="border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold
                           hover:bg-white hover:text-primary transition-all duration-300 text-center cursor-pointer">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
