import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  FaCode, FaMobileAlt, FaCloud, FaShieldAlt, FaChartLine, FaCogs,
  FaDatabase, FaPaintBrush, FaHeadset, FaCheckCircle
} from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const services = [
  {
    icon: FaCode, title: 'Custom Software Development',
    desc: 'We design and build bespoke software solutions tailored to your organization\'s unique workflows and requirements.',
    features: ['Church Management Systems', 'School Administration Platforms', 'Mission Coordination Tools', 'Inventory & Asset Management']
  },
  {
    icon: FaMobileAlt, title: 'Mobile Application Development',
    desc: 'Native and cross-platform mobile apps that keep your community connected and engaged wherever they are.',
    features: ['iOS & Android Apps', 'Community & Engagement Apps', 'Giving & Donation Platforms', 'Event Management Apps']
  },
  {
    icon: FaCloud, title: 'Cloud Solutions & Hosting',
    desc: 'Scalable, secure cloud infrastructure that ensures your systems are always available and performing at their best.',
    features: ['Cloud Migration', 'Managed Hosting', 'Auto-scaling Infrastructure', 'Backup & Disaster Recovery']
  },
  {
    icon: FaPaintBrush, title: 'UI/UX Design',
    desc: 'Beautiful, intuitive interfaces that make complex systems easy to use for everyone in your organization.',
    features: ['User Research', 'Wireframing & Prototyping', 'Visual Design Systems', 'Accessibility Compliance']
  },
  {
    icon: FaDatabase, title: 'Database & API Development',
    desc: 'Robust data architecture and API development that powers your applications with reliability and speed.',
    features: ['Database Design', 'RESTful & GraphQL APIs', 'Data Migration', 'Performance Optimization']
  },
  {
    icon: FaShieldAlt, title: 'Cybersecurity Solutions',
    desc: 'Protect your organization\'s sensitive data with enterprise-grade security measures and best practices.',
    features: ['Security Audits', 'Data Encryption', 'Access Control Systems', 'Compliance Management']
  },
  {
    icon: FaChartLine, title: 'Digital Transformation Consulting',
    desc: 'Strategic guidance to help your organization leverage technology for maximum impact and efficiency.',
    features: ['Technology Roadmapping', 'Process Automation', 'Digital Strategy', 'Change Management']
  },
  {
    icon: FaCogs, title: 'System Integration',
    desc: 'Connect your existing tools and platforms into a unified ecosystem that works seamlessly together.',
    features: ['Payment Gateway Integration', 'Third-party API Integration', 'Legacy System Modernization', 'Workflow Automation']
  },
  {
    icon: FaHeadset, title: 'IT Support & Maintenance',
    desc: 'Ongoing technical support and system maintenance to keep your operations running smoothly 24/7.',
    features: ['24/7 Technical Support', 'System Monitoring', 'Regular Updates & Patches', 'Performance Tuning']
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: 'We learn about your organization, goals, and challenges through in-depth consultation.' },
  { step: '02', title: 'Planning', desc: 'Our team creates a detailed project roadmap with timelines, milestones, and deliverables.' },
  { step: '03', title: 'Development', desc: 'We build your solution using agile methodology with regular progress updates.' },
  { step: '04', title: 'Testing', desc: 'Rigorous quality assurance ensures your software is reliable, secure, and performant.' },
  { step: '05', title: 'Deployment', desc: 'Smooth launch with training and documentation for your team.' },
  { step: '06', title: 'Support', desc: 'Ongoing maintenance, updates, and support to keep your systems running perfectly.' },
];

export default function Services() {
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [processRef, processInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-cream-dark/50">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="visible" variants={stagger}
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">Our Services</motion.span>
          <motion.h1 variants={fadeInUp} className="text-heading text-5xl md:text-6xl font-bold mt-4 mb-6">
            Solutions That <span className="text-primary">Empower</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto">
            From custom software to IT consulting, we provide comprehensive technology services
            that help organizations operate smarter and grow faster.
          </motion.p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="section-padding bg-cream">
        <motion.div
          className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden" animate={servicesInView ? 'visible' : 'hidden'} variants={stagger}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeInUp}
              className="bg-white rounded-2xl p-7 border border-border-light
                         hover:shadow-lg hover:shadow-primary/8 hover:border-primary/25
                         hover:-translate-y-1 transition-all duration-400 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6
                              group-hover:bg-primary group-hover:shadow-[0_4px_15px_rgba(232,130,12,0.3)] transition-all duration-300">
                <service.icon className="text-primary text-2xl group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-heading text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-body mb-4">{service.desc}</p>
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-body">
                    <FaCheckCircle className="text-primary text-xs shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Process */}
      <section ref={processRef} className="section-padding bg-cream-dark/40">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden"
            animate={processInView ? 'visible' : 'hidden'} variants={stagger}>
            <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">Our Process</motion.span>
            <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mt-4">
              How We <span className="text-primary">Work</span>
            </motion.h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden"
            animate={processInView ? 'visible' : 'hidden'} variants={stagger}>
            {process.map((p) => (
              <motion.div key={p.step} variants={fadeInUp}
                className="bg-white rounded-2xl p-7 border border-border-light
                           hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 group"
              >
                <span className="text-5xl font-bold text-primary/15 group-hover:text-primary/30 transition-colors">{p.step}</span>
                <h3 className="text-heading text-xl font-semibold mt-4 mb-3">{p.title}</h3>
                <p className="text-body">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden"
          whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mb-6">
            Let&apos;s Build Something <span className="text-primary">Amazing</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body text-lg mb-8">
            Ready to take your organization to the next level? Apply for a custom software project today.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/apply" className="btn-primary">Apply Now</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
