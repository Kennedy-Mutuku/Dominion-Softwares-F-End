import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaLaptopCode, FaMobileAlt, FaCloud, FaRobot, FaChartBar, FaCodeBranch,
  FaCreditCard, FaBoxes, FaUsersCog, FaCogs, FaHotel, FaCashRegister,
  FaGraduationCap, FaHospitalAlt, FaChurch, FaBuilding, FaShoppingBag,
  FaWifi, FaShieldAlt, FaDatabase, FaServer
} from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.03 } }
};

const buildItems = [
  { icon: FaLaptopCode, label: 'Web Applications' },
  { icon: FaMobileAlt, label: 'Mobile Applications' },
  { icon: FaCloud, label: 'Cloud Systems' },
  { icon: FaRobot, label: 'AI Powered Solutions' },
  { icon: FaChartBar, label: 'Business Intelligence Dashboards' },
  { icon: FaCodeBranch, label: 'API Development' },
  { icon: FaCreditCard, label: 'Payment Integrations' },
  { icon: FaBoxes, label: 'Inventory Systems' },
  { icon: FaUsersCog, label: 'HR Systems' },
  { icon: FaCogs, label: 'ERP Systems' },
  { icon: FaHotel, label: 'Hotel Systems' },
  { icon: FaCashRegister, label: 'POS Systems' },
  { icon: FaGraduationCap, label: 'School Systems' },
  { icon: FaHospitalAlt, label: 'Hospital Systems' },
  { icon: FaChurch, label: 'Church Management Systems' },
  { icon: FaBuilding, label: 'Enterprise Software' },
  { icon: FaShoppingBag, label: 'E-Commerce Platforms' },
  { icon: FaWifi, label: 'IoT Solutions' },
  { icon: FaShieldAlt, label: 'Cybersecurity Solutions' },
  { icon: FaDatabase, label: 'Database Design' },
  { icon: FaServer, label: 'Cloud Migration' }
];

export default function WhatWeBuild() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-cream py-12 px-5 border-b border-border-light">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-heading mb-6">What We Build</h2>
          <p className="text-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We deliver state-of-the-art technological solutions tailored to your unique requirements.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {buildItems.map((item, idx) => (
            <motion.div 
              key={item.label} variants={fadeInUp}
              className="group bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 px-7 py-4 flex items-center gap-3 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="text-primary text-sm" />
              </div>
              <span className="font-bold text-[15px] text-gray-700 group-hover:text-heading transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
