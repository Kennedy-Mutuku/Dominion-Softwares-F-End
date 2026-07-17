import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheckCircle } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

const expertiseList = [
  'Custom Software Development', 'Enterprise Resource Planning (ERP)', 
  'Artificial Intelligence Solutions', 'Mobile App Development', 
  'Web Application Development', 'Cloud Infrastructure', 
  'API Development', 'Business Automation', 
  'Digital Transformation', 'UI/UX Design', 
  'Database Architecture', 'Software Maintenance', 
  'System Integration', 'IT Consultancy', 'Technical Support'
];

export default function CoreExpertise() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-slate-50 py-12 px-5 border-b border-border-light relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div 
          className="mb-12"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Our Core Expertise</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-heading mb-6">World-Class Technical Capabilities</h3>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {expertiseList.map((item, idx) => (
            <motion.div 
              key={item} variants={fadeInUp} 
              className="flex items-center gap-4 bg-white/50 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FaCheckCircle className="text-primary text-lg" />
              </div>
              <span className="text-heading font-bold text-[15px]">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
