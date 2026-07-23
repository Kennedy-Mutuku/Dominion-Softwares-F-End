import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaChurch, FaUsers, FaSchool, FaGlobeAfrica, FaBookOpen, FaCheck } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const kingdomCards = [
  {
    icon: FaChurch,
    title: 'Churches',
    color: 'bg-blue-500',
    features: ['Membership Management', 'Attendance Tracking', 'Giving & Tithes', 'Small Groups', 'Prayer Requests', 'Visitor Management', 'SMS Notifications']
  },
  {
    icon: FaUsers,
    title: 'Ministries & Networks',
    color: 'bg-purple-500',
    features: ['Multi-Branch Management', 'Pastor Dashboard', 'Regional Oversight', 'Events', 'Conferences', 'Volunteer Management']
  },
  {
    icon: FaSchool,
    title: 'Christian Schools',
    color: 'bg-yellow-500',
    features: ['Student Information Systems', 'Fee Management', 'Parent Portal', 'Learning Management', 'Attendance']
  },
  {
    icon: FaGlobeAfrica,
    title: 'Missions & NGOs',
    color: 'bg-green-500',
    features: ['Donor Management', 'Grant Tracking', 'Outreach', 'Beneficiary Management', 'Impact Reports']
  },
  {
    icon: FaBookOpen,
    title: 'Bible Colleges',
    color: 'bg-indigo-500',
    features: ['Student Portal', 'Academic Management', 'Finance', 'Library', 'Certificates']
  }
];

export default function KingdomTech() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white py-12 px-5 border-b border-border-light">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Kingdom Technology</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-heading mb-6">Empowering the Gospel through Technology</h3>
          <p className="text-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We partner with churches, ministries and Christian organizations to build systems that strengthen administration, discipleship and Kingdom impact.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-20"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {kingdomCards.map((card, idx) => (
            <motion.div 
              key={card.title} variants={fadeInUp}
              className="relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col pt-12 px-8 pb-8 group"
            >
              {/* Overlapping Icon */}
              <div className={`absolute -top-8 left-8 w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg shadow-${card.color.replace('bg-', '')}/30 group-hover:scale-110 transition-transform duration-500`}>
                <card.icon className="text-2xl" />
              </div>
              
              <h4 className="text-2xl font-extrabold text-heading mb-6 tracking-tight">{card.title}</h4>
              
              <ul className="space-y-4 flex-1">
                {card.features.map(feature => (
                  <li key={feature} className="text-[15px] font-medium text-gray-600 flex items-start gap-3 group/item">
                    <div className={`w-5 h-5 rounded-full ${card.color.replace('bg-', 'bg-').replace('500', '100')} flex items-center justify-center shrink-0 mt-0.5`}>
                      <FaCheck className={`${card.color.replace('bg-', 'text-')} text-[10px]`} />
                    </div>
                    <span className="group-hover/item:text-heading transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
