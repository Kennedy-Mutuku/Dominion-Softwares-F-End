import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChurch, FaSchool, FaGlobeAfrica, FaBuilding } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const categories = ['All', 'Church', 'Education', 'Mission', 'Business'];

const projects = [
  {
    title: 'Grace Church Manager', category: 'Church', icon: FaChurch,
    desc: 'A comprehensive church management system with member tracking, event scheduling, giving management, and SMS notifications.',
    tech: ['React', 'Node.js', 'MongoDB', 'M-Pesa']
  },
  {
    title: 'EduTrack Pro', category: 'Education', icon: FaSchool,
    desc: 'School administration platform handling admissions, grading, timetabling, fee management, and parent-teacher communication.',
    tech: ['React', 'Express', 'PostgreSQL', 'PWA']
  },
  {
    title: 'MissionLink', category: 'Mission', icon: FaGlobeAfrica,
    desc: 'Field team coordination system for mission organizations with real-time reporting, resource tracking, and donor management.',
    tech: ['React Native', 'Firebase', 'Maps API']
  },
  {
    title: 'Worship Flow', category: 'Church', icon: FaChurch,
    desc: 'Worship service planning tool with setlist management, volunteer scheduling, and live presentation display.',
    tech: ['Next.js', 'Supabase', 'WebSocket']
  },
  {
    title: 'Impact Analytics', category: 'Mission', icon: FaGlobeAfrica,
    desc: 'Data analytics dashboard for NGOs to track program outcomes, generate donor reports, and visualize impact metrics.',
    tech: ['React', 'Python', 'D3.js', 'AWS']
  },
  {
    title: 'BizFlow CRM', category: 'Business', icon: FaBuilding,
    desc: 'Customer relationship management system for SMEs with sales pipeline, invoicing, and automated follow-ups.',
    tech: ['React', 'Node.js', 'MySQL', 'Stripe']
  },
];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-cream-dark/50">
        <motion.div className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">Our Portfolio</motion.span>
          <motion.h1 variants={fadeInUp} className="text-heading text-5xl md:text-6xl font-bold mt-4 mb-6">
            Projects That <span className="text-primary">Inspire</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects delivered for organizations across various sectors.
          </motion.p>
        </motion.div>
      </section>

      {/* Filter & Grid */}
      <section ref={ref} className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex flex-wrap justify-center gap-3 mb-12"
            initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
            {categories.map((cat) => (
              <motion.button key={cat} variants={fadeInUp} onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                  ${filter === cat
                    ? 'bg-primary text-white shadow-[0_4px_16px_rgba(232,130,12,0.3)]'
                    : 'bg-white text-body border border-border-light hover:border-primary/30'
                  }`}>
                {cat}
              </motion.button>
            ))}
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
            {filtered.map((project) => (
              <motion.div key={project.title} variants={fadeInUp} layout
                className="bg-white rounded-2xl border border-border-light overflow-hidden
                           hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 group"
              >
                <div className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <project.icon className="text-primary text-2xl" />
                    <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-body mb-4 text-sm">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 bg-cream rounded-full text-body border border-border-light">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream-dark/40">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden"
          whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mb-6">
            Your Project Could Be <span className="text-primary">Next</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body text-lg mb-8">
            Join our growing list of satisfied organizations. Let&apos;s build something remarkable together.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/apply" className="btn-primary">Start Your Project</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
