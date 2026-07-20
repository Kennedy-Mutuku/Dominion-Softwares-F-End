import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEye, FaBullseye, FaHeart, FaLightbulb, FaHandsHelping, FaAward, FaTasks, FaLinkedin } from 'react-icons/fa';

import imgKennedy from '../assets/Kennedy mutuku.JPG';
import imgFancy from '../assets/Fancy Megiri.jpeg';
import imgLewis from '../assets/Lewis Muriu.jpeg';
import imgBlessing from '../assets/Blessing Temba.jpeg';
import imgRaymond from '../assets/Ray.jpeg';
import imgJoyce from '../assets/Joyce Ruchuu.jpeg';
import imgRuth from '../assets/Ruth Pendo (2).jpeg';
import imgOmbogo from '../assets/Ombogo.jpeg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const values = [
  { icon: FaHeart, title: 'Kingdom Impact', desc: 'We build technology that serves a higher purpose, empowering ministries to reach further.' },
  { icon: FaLightbulb, title: 'Innovation', desc: 'We bring modern, cutting-edge solutions to organizations that need them the most.' },
  { icon: FaHandsHelping, title: 'Partnership', desc: 'We do not just build software; we partner with you to ensure your mission succeeds.' },
  { icon: FaAward, title: 'Excellence', desc: 'Heavenly inspired means delivering the highest quality in every line of code we write.' },
];

const team = [
  { name: 'Kennedy Mutuku', role: 'Chief Executive Officer (CEO) & Founder', quote: '"Driving faith-based innovation and visionary leadership."', image: imgKennedy, objectPosition: 'top' },
  { name: 'Fancy Megiri', role: 'General Manager', quote: '"Ensuring operational excellence across every project."', image: imgFancy, objectPosition: 'center', scale: 2, origin: 'top center' },
  { name: 'Ruchuu Joyce', role: 'Accounts and Finance Officer', quote: '"Upholding strict financial integrity and transparency."', image: imgJoyce, objectPosition: 'top' },
  { name: 'Lewis Muriu', role: 'Secretary General', quote: '"Streamlining our strategic alignment and corporate governance."', image: imgLewis, objectPosition: 'center 15%', scale: 2.4, origin: 'center 15%' },
  { name: 'Blessings Temba Odilia', role: 'Public Relations Officer', quote: '"Building meaningful relationships and absolute brand trust."', image: imgBlessing, objectPosition: 'top' },
  { name: 'Ruth Pendo', role: 'Human Resource Administrator', quote: '"Fostering a nurturing culture of growth and excellence."', image: imgRuth, objectPosition: 'center 5%', scale: 1.9, origin: 'center 5%' },
  { name: 'Emmanuel Ombogo', role: 'Communications and Media', quote: '"Crafting compelling narratives to amplify our mission."', image: imgOmbogo, objectPosition: 'top' },
  { name: 'Raymond Ewoi', role: 'Corporate Chaplain', quote: '"Providing spiritual guidance and maintaining corporate wellness."', image: imgRaymond, objectPosition: 'top', scale: 1.15, origin: 'top center' },
];

export default function About() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 md:pt-16 pb-16 px-6 md:px-12 lg:px-24 relative overflow-hidden bg-gradient-to-br from-cream to-cream-dark/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-60" />
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
          <motion.h1 variants={fadeInUp} className="text-heading text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 mb-6 leading-tight max-w-[800px] mx-auto">
            Heavenly Inspired Software <span className="text-primary whitespace-nowrap">Solutions</span>
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
              className="bg-cream rounded-2xl p-8 pb-10 border border-border-light shadow-[0_4px_25px_rgba(0,0,0,0.04)]
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full text-left items-start"
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
              className="bg-cream rounded-2xl p-8 pb-10 border border-border-light shadow-[0_4px_25px_rgba(0,0,0,0.04)]
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full text-left items-start"
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
              className="bg-cream rounded-2xl p-8 pb-10 border border-border-light shadow-[0_4px_25px_rgba(0,0,0,0.04)]
                         hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 
                         hover:-translate-y-2 transition-all duration-400 group flex flex-col h-full text-left items-start"
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
      <section className="section-padding bg-[#1B1B1B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[30%_70%] gap-12 lg:gap-8 items-start">
            <motion.div 
              className="lg:sticky lg:top-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold block mb-3">
                What Drives Us
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-white">
                Our Core Values
              </motion.h2>
            </motion.div>

            <motion.div 
              className="grid sm:grid-cols-2 gap-x-10 gap-y-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {values.map((value) => (
                <motion.div 
                  key={value.title}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5
                                  group-hover:bg-primary transition-colors duration-300">
                    <value.icon className="text-primary text-xl group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
              The Brains Behind The Code
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold mt-3 text-heading">
              Our Leadership Team
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={fadeInUp} className="group">
                <div className="relative rounded-2xl overflow-hidden mb-5 bg-cream-dark aspect-[4/5] border border-border-light shadow-sm flex flex-col items-center justify-center">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      style={{ 
                        objectPosition: member.objectPosition || 'top',
                        '--base-scale': member.scale || 1,
                        '--offset-y': member.offsetY || '0%',
                        transformOrigin: member.origin || 'center'
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 hover-scale-custom"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-body-light/50 bg-gradient-to-b from-cream to-cream-dark group-hover:bg-cream transition-colors duration-500">
                      <svg className="w-20 h-20 mb-3 opacity-40 group-hover:opacity-60 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Photo Pending</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-center">
                    <p className="text-white/90 text-sm font-medium italic mb-4 leading-snug drop-shadow-md">
                      {member.quote}
                    </p>
                    <div className="flex justify-center">
                      <a href="#" className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors cursor-pointer shadow-lg">
                        <FaLinkedin className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-heading text-center">{member.name}</h3>
                <p className="text-primary font-medium text-[13px] mt-1 text-center">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white"
          >
            Ready to build something <span className="text-primary">impactful?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Let's collaborate to bring custom, robust, and heavenly-inspired software solutions to your organization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/apply" className="btn-primary inline-flex shadow-[0_4px_20px_rgba(255,95,0,0.35)] hover:shadow-[0_4px_25px_rgba(255,95,0,0.5)]">
              Start Your Application
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
