import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaHotel, FaShoppingCart, FaHospital, FaGraduationCap, 
  FaPiggyBank, FaUserTie, FaIndustry, FaTractor, 
  FaLandmark, FaBuilding, FaHome, FaGlobeAfrica, FaRocket, FaCheck 
} from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

const enterpriseCards = [
  { icon: FaHotel, title: 'Hospitality', color: 'text-orange-400', features: ['Hotel Booking', 'Resort Management', 'Restaurant POS', 'Housekeeping'] },
  { icon: FaShoppingCart, title: 'Retail & Supermarkets', color: 'text-blue-400', features: ['POS', 'Inventory', 'Suppliers', 'Multi-Branch', 'Reports'] },
  { icon: FaHospital, title: 'Healthcare', color: 'text-red-400', features: ['Hospital Management', 'Patient Records', 'Pharmacy', 'Billing', 'Appointments'] },
  { icon: FaGraduationCap, title: 'Education', color: 'text-yellow-400', features: ['School ERP', 'Online Learning', 'Student Portal', 'Exams', 'Finance'] },
  { icon: FaPiggyBank, title: 'SACCO Systems', color: 'text-green-400', features: ['Loan Management', 'Accounting', 'Payroll'] },
  { icon: FaUserTie, title: 'Human Resource', color: 'text-purple-400', features: ['Leave', 'Payroll', 'Recruitment', 'Performance'] },
  { icon: FaIndustry, title: 'Manufacturing', color: 'text-gray-300', features: ['Production Tracking', 'Inventory', 'Procurement', 'Logistics'] },
  { icon: FaTractor, title: 'Agriculture', color: 'text-emerald-400', features: ['Farm Management', 'Livestock', 'Produce Tracking'] },
  { icon: FaLandmark, title: 'Government', color: 'text-indigo-400', features: ['Citizen Portals', 'Revenue Collection', 'Case Management'] },
  { icon: FaBuilding, title: 'Corporate', color: 'text-cyan-400', features: ['CRM', 'ERP', 'Workflow Automation', 'Dashboards'] },
  { icon: FaHome, title: 'Real Estate', color: 'text-teal-400', features: ['Property Management', 'Tenant Portal', 'Rent Collection'] },
  { icon: FaGlobeAfrica, title: 'NGOs', color: 'text-lime-400', features: ['Beneficiary Tracking', 'Monitoring & Evaluation', 'Donor Management'] },
  { icon: FaRocket, title: 'Startups', color: 'text-pink-400', features: ['MVP Development', 'SaaS Platforms', 'APIs', 'Mobile Apps'] }
];

export default function EnterpriseSolutions() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-secondary py-12 px-5 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-3">Business & Enterprise Solutions</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">Technology that powers organizations of every size.</h3>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From sleek startups to complex government agencies, we engineer digital ecosystems that drive efficiency, scalability, and growth.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        >
          {enterpriseCards.map((card, idx) => (
            <motion.div 
              key={card.title} variants={fadeInUp}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle hover glow effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-700 bg-current ${card.color}`} />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  <card.icon className={`text-2xl ${card.color}`} />
                </div>
                <h4 className="font-extrabold text-[17px] text-white tracking-wide">{card.title}</h4>
              </div>
              
              <ul className="space-y-3 relative z-10">
                {card.features.map(feature => (
                  <li key={feature} className="text-[14px] text-slate-300 flex items-start gap-3 font-light">
                    <FaCheck className={`${card.color} mt-[3px] text-[10px]`} />
                    <span className="group-hover:text-white transition-colors">{feature}</span>
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
