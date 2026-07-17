import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaChurch, FaBuilding, FaRobot } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function ThreePillars() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-cream py-12 px-5 border-y border-border-light">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {/* Pillar 1 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <FaChurch className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Kingdom Technology</h3>
            <p className="text-body text-sm leading-relaxed">
              Technology that advances the Gospel and strengthens ministries with powerful administrative and engagement tools.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <FaBuilding className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Enterprise Solutions</h3>
            <p className="text-body text-sm leading-relaxed">
              Custom software that powers businesses, institutions, and governments to operate efficiently and scale seamlessly.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
              <FaRobot className="text-3xl text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Innovation & Digital Transformation</h3>
            <p className="text-body text-sm leading-relaxed">
              AI, automation, cloud solutions, integrations, and emerging technologies that prepare organizations for the future.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
