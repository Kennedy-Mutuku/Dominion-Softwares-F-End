import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGlobe, FiLayers, FiCpu, FiTarget } from 'react-icons/fi';

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
    <section ref={ref} className="bg-[#f8fafc] py-16 px-5 border-y border-border-light relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}>
          {/* Tree Root Node */}
          <div className="flex justify-center mb-0">
            <div className="bg-white border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.05)] px-6 py-3 rounded-full flex items-center gap-3 relative z-20 hover:border-primary/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FiTarget className="text-primary text-sm" />
              </div>
              <span className="text-lg font-extrabold text-heading">Our Core Pillars</span>
            </div>
          </div>
          
          {/* Vertical Stem from Root (Desktop) */}
          <div className="hidden md:flex justify-center relative z-10">
            <div className="w-[2px] h-8 bg-gray-300"></div>
          </div>

          {/* Desktop Connections Grid - Uses exact same grid as cards to ensure perfect center alignment */}
          <div className="hidden md:grid grid-cols-3 gap-8 w-full relative z-10">
            {/* Col 1 Connection */}
            <div className="relative w-full h-8">
              <div className="absolute right-0 top-0 w-[50%] h-[2px] bg-gray-300"></div>
              <div className="absolute left-[50%] top-0 w-[2px] h-8 bg-gray-300 -translate-x-1/2"></div>
            </div>
            
            {/* Col 2 Connection */}
            <div className="relative w-full h-8">
              <div className="absolute left-0 top-0 w-full h-[2px] bg-gray-300"></div>
              <div className="absolute left-[50%] top-0 w-[2px] h-8 bg-gray-300 -translate-x-1/2"></div>
            </div>

            {/* Col 3 Connection */}
            <div className="relative w-full h-8">
              <div className="absolute left-0 top-0 w-[50%] h-[2px] bg-gray-300"></div>
              <div className="absolute left-[50%] top-0 w-[2px] h-8 bg-gray-300 -translate-x-1/2"></div>
            </div>
          </div>
        </motion.div>

        {/* The Grid / Tree Leaves */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 md:mt-0 relative z-20"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {/* Pillar 1 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiGlobe className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Kingdom Technology</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Technology that advances the Gospel and strengthens ministries with powerful administrative and engagement tools.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiLayers className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Enterprise Solutions</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Custom software that powers businesses, institutions, and governments to operate efficiently and scale seamlessly.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiCpu className="text-3xl text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-3">Innovation & Digital Transformation</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              AI, automation, cloud solutions, integrations, and emerging technologies that prepare organizations for the future.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
