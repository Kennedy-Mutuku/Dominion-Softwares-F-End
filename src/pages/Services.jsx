import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import KingdomTech from '../components/home/KingdomTech';
import EnterpriseSolutions from '../components/home/EnterpriseSolutions';
import WhatWeBuild from '../components/home/WhatWeBuild';
import CoreExpertise from '../components/home/CoreExpertise';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Old services array removed

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
      <section className="pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cream-dark/50">
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

      {/* Deep Industry Focus & Capabilities */}
      <div id="kingdom-tech"><KingdomTech /></div>
      <div id="enterprise"><EnterpriseSolutions /></div>
      <div id="what-we-build"><WhatWeBuild /></div>
      <div id="expertise"><CoreExpertise /></div>

      {/* Process */}
      <section id="process" ref={processRef} className="section-padding bg-cream-dark/40">
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
