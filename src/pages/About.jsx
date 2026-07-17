import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHeart, FaLightbulb, FaHandsHelping, FaAward, FaTasks } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const values = [
  { icon: FaHeart, title: 'Kingdom Impact', desc: 'We build technology that serves a higher purpose, empowering ministries to reach further.' },
  { icon: FaLightbulb, title: 'Innovation', desc: 'We bring modern, cutting-edge solutions to organizations that need them the most.' },
  { icon: FaHandsHelping, title: 'Partnership', desc: 'We do not just build software; we partner with you to ensure your mission succeeds.' },
  { icon: FaAward, title: 'Excellence', desc: 'Heavenly inspired means delivering the highest quality in every line of code we write.' },
];

export default function About() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-gradient-to-br from-cream to-cream-dark/30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" 
          animate="visible" 
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-[0.2em] font-semibold">
            About Us
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-heading text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 mb-6 leading-tight">
            Heavenly Inspired <span className="text-primary">Software Solutions</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto leading-relaxed">
            Dominion Softwares Ltd is dedicated to bridging the gap between faith and innovation. 
            We build custom software systems for ministries, churches, and businesses to empower 
            their mission with technology that works.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="section-padding bg-white relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {/* Mission Card */}
            <motion.div 
              variants={fadeInUp}
              className="bg-cream rounded-2xl p-8 border border-border-light 
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 
                              group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <FaBullseye className="text-primary text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-4 group-hover:text-primary transition-colors">Our Mission</h2>
              <p className="text-body leading-relaxed flex-1">
                To empower ministries, churches, and businesses with custom, heavenly-inspired software solutions 
                that amplify their impact, streamline their operations, and help them reach their goals effectively.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              variants={fadeInUp}
              className="bg-cream rounded-2xl p-8 border border-border-light 
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 
                              group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <FaEye className="text-primary text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-4 group-hover:text-primary transition-colors">Our Vision</h2>
              <p className="text-body leading-relaxed flex-1">
                To be the leading global provider of kingdom-focused technology, fostering a world where 
                faith and innovation seamlessly intersect to drive unprecedented growth and transformation.
              </p>
            </motion.div>

            {/* Objectives Card */}
            <motion.div 
              variants={fadeInUp}
              className="bg-cream rounded-2xl p-8 border border-border-light 
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 
                              group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <FaTasks className="text-primary text-2xl group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-4 group-hover:text-primary transition-colors">Our Objectives</h2>
              <p className="text-body leading-relaxed flex-1">
                To continuously deliver robust, scalable, and secure systems while prioritizing client satisfaction, 
                maintaining affordability, and offering unparalleled support to organizations at every stage.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
              What Drives Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold mt-3 text-heading">
              Our Core Values
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {values.map((value, i) => (
              <motion.div 
                key={value.title}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 border border-border-light text-center
                           hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5
                                group-hover:bg-primary transition-colors duration-300">
                  <value.icon className="text-primary text-xl group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-heading font-bold mb-3">{value.title}</h3>
                <p className="text-body text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
