import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

import { 
  FiGlobe, FiHeart, FiBook, FiBriefcase, FiShield, 
  FiCoffee, FiShoppingCart, FiTruck, FiSun, FiUsers, 
  FiDollarSign, FiZap 
} from 'react-icons/fi';

const badges = [
  { icon: <FiGlobe />, label: 'Churches' },
  { icon: <FiHeart />, label: 'Hospitals' },
  { icon: <FiBook />, label: 'Schools' },
  { icon: <FiBriefcase />, label: 'Enterprises' },
  { icon: <FiShield />, label: 'Government' },
  { icon: <FiCoffee />, label: 'Hotels' },
  { icon: <FiShoppingCart />, label: 'Retail' },
  { icon: <FiTruck />, label: 'Logistics' },
  { icon: <FiSun />, label: 'Agriculture' },
  { icon: <FiUsers />, label: 'NGOs' },
  { icon: <FiDollarSign />, label: 'Finance' },
  { icon: <FiZap />, label: 'Startups' }
];

export default function FinalCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white py-16 px-5 text-center overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-heading mb-8">
            Whatever You Can Imagine, <br className="hidden md:block" />
            <span className="text-primary">We Can Build.</span>
          </h2>
          
          <p className="text-body text-xl md:text-2xl max-w-4xl mx-auto mb-16 leading-relaxed">
            We don't just develop software—we engineer digital ecosystems that empower ministries, businesses, institutions and governments to thrive in a rapidly changing world.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {badges.map((badge) => (
            <motion.div 
              key={badge.label} variants={fadeInUp}
              className="px-5 py-3 bg-cream rounded-full border border-border-light text-heading font-medium text-sm md:text-base flex items-center gap-2 hover:bg-white hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <span className="text-xl text-primary">{badge.icon}</span> {badge.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
