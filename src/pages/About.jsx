import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEye, FaBullseye, FaHeart, FaLightbulb, FaHandsHelping, FaAward, FaTasks, FaLinkedin } from 'react-icons/fa';

import mockup1 from '../assets/mockup 1.jpeg';
import mockup2 from '../assets/mockup 2.jpeg';

import imgKennedy from '../assets/Kennedy mutuku.JPG';
import imgFancy from '../assets/Fancy Megiri.jpeg';
import imgLewis from '../assets/Lewis Muriu.jpeg';
import imgBlessing from '../assets/Blessing Temba.jpeg';
import imgRaymond from '../assets/Ray.jpeg';
import imgJoyce from '../assets/Joyce Ruchuu.jpeg';
import imgRuth from '../assets/Ruth Pendo (2).jpeg';
import imgOmbogo from '../assets/Emmanuel.jpeg';
import imgSam from '../assets/Sam.jpeg';
import logo from '../assets/dominion softwares main logo.png';
import favicon from '../assets/dominion_favicon.png';

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
  { name: 'Samuel Odera', role: 'The Legal Aid', quote: '"Protecting corporate integrity, legal compliance, and governance."', image: imgSam, objectPosition: 'top' },
  { name: 'Blessings Temba Odilia', role: 'Public Relations Officer', quote: '"Building meaningful relationships and absolute brand trust."', image: imgBlessing, objectPosition: 'top' },
  { name: 'Ruth Pendo', role: 'Human Resource Administrator', quote: '"Fostering a nurturing culture of growth and excellence."', image: imgRuth, objectPosition: 'center 5%', scale: 1.9, origin: 'center 5%' },
  { name: 'Emmanuel Ombogo', role: 'Communications and Media', quote: '"Crafting compelling narratives to amplify our mission."', image: imgOmbogo, objectPosition: 'top' },
  { name: 'Raymond Ewoi', role: 'Corporate Chaplain', quote: '"Providing spiritual guidance and maintaining corporate wellness."', image: imgRaymond, objectPosition: 'top', scale: 1.15, origin: 'top center' },
];

export default function About() {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      {/* Page Breadcrumb Strip */}
      <div className="w-full bg-gradient-to-r from-black via-[#111111] to-[#1a1a1a] py-3 px-4 md:px-8 lg:px-12 relative z-30 shadow-lg border-b border-white/10 overflow-hidden">
        {/* Subtle glow effect behind logo */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 blur-xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <img src={favicon} alt="Dominion Softwares" className="h-6 md:h-7 object-contain drop-shadow-[0_0_8px_rgba(255,95,0,0.4)]" />
          </Link>
          <nav className="flex items-center text-[10px] md:text-xs font-bold text-white/60 gap-2.5 uppercase tracking-[0.15em]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-white drop-shadow-sm">Who We Are</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section id="story" className="pt-8 md:pt-12 pb-12 md:pb-24 px-4 md:px-8 lg:px-12 relative overflow-hidden bg-cream">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div 
              className="text-left mt-4 md:mt-0"
              initial="hidden" 
              animate="visible" 
              variants={stagger}
            >
              <motion.h1 variants={fadeInUp} className="text-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-1 md:mt-2 mb-5 md:mb-8 leading-snug">
                Heavenly Inspired <br className="hidden sm:block" /> Software{' '}
                <span className="text-primary relative inline-block">
                  Solutions
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,15 Q50,25 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-body text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed mb-4 font-normal opacity-90 text-gray-700">
                At <strong className="text-heading font-bold">Dominion Softwares</strong>, we deliver innovative technology solutions that help organizations streamline operations, automate processes, and maximize their impact. Our core specialization is serving <strong className="text-primary font-bold">churches, ministries, mission organizations, Christian institutions, charities, and NGOs</strong>, equipping them with digital solutions that advance their mission and improve operational excellence.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-body text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed mb-4 font-normal opacity-90 text-gray-700">
                While faith-based organizations are at the heart of what we do, our expertise extends far beyond them. We proudly partner with <strong className="text-heading font-bold">businesses, educational institutions, healthcare providers, government agencies, startups, and organizations across every industry</strong>, delivering tailored software solutions that solve real-world challenges and drive sustainable growth.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-body text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed mb-6 md:mb-8 font-normal opacity-90 text-gray-700">
                From custom software development and business process automation to websites, mobile applications, payment integrations, and cloud-based systems, we design solutions that are secure, scalable, and built around your organization&apos;s unique goals. Whatever your vision, Dominion Softwares is committed to turning it into reliable, impactful technology.
              </motion.p>
            </motion.div>

            {/* Mockups Collage */}
            <motion.div 
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] perspective-1000 -mt-2 md:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
              
              {/* Back Mockup */}
              <motion.div 
                className="absolute top-[10%] right-[5%] w-[70%] h-auto rounded-xl shadow-2xl border border-white/40 overflow-hidden transform rotate-6"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={mockup2} alt="Software Mockup 2" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
              </motion.div>

              {/* Front Mockup */}
              <motion.div 
                className="absolute bottom-[10%] left-[0%] w-[80%] h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white overflow-hidden -rotate-3"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <img src={mockup1} alt="Software Mockup 1" className="w-full h-auto object-cover" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-white relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-8 md:mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-heading leading-tight">
              Our <span className="text-primary">Guiding Principles</span>
            </motion.h2>
          </motion.div>
          <motion.div 
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {/* Mission Section */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col text-left items-start py-2"
            >
              <h2 className="text-xl md:text-2xl font-bold text-heading mb-3">Our Mission</h2>
              <p className="text-body text-sm md:text-base leading-relaxed">
                To empower ministries, churches, and businesses with custom, heavenly-inspired software solutions 
                that amplify their impact, streamline their operations, and help them reach their goals effectively.
              </p>
            </motion.div>

            {/* Vision Section */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col text-left items-start py-2"
            >
              <h2 className="text-xl md:text-2xl font-bold text-heading mb-3">Our Vision</h2>
              <p className="text-body text-sm md:text-base leading-relaxed">
                To be the leading global provider of kingdom-focused technology, fostering a world where 
                faith and innovation seamlessly intersect to drive unprecedented growth and transformation.
              </p>
            </motion.div>

            {/* Objectives Section */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col text-left items-start py-2"
            >
              <h2 className="text-xl md:text-2xl font-bold text-heading mb-3">Our Objectives</h2>
              <p className="text-body text-sm md:text-base leading-relaxed">
                To continuously deliver robust, scalable, and secure systems while prioritizing client satisfaction, 
                maintaining affordability, and offering unparalleled support to organizations at every stage.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="pt-8 md:pt-12 relative overflow-hidden bg-gradient-to-b from-white to-cream pb-12 md:pb-16">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col max-w-4xl mx-auto items-center">
            <motion.div 
              className="mb-10 md:mb-14 text-center flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeInUp} className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.15em] font-bold mb-6">
                What Drives Us
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-heading leading-tight mb-6">
                Our <span className="text-primary">Core Values</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-body text-lg leading-relaxed max-w-2xl mx-auto">
                These foundational principles guide every decision we make, ensuring our solutions align with your mission and our shared vision for excellence.
              </motion.p>
            </motion.div>

            <motion.ul 
              className="flex flex-col space-y-6 md:space-y-8 w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {values.map((value) => (
                <motion.li 
                  key={value.title}
                  variants={fadeInUp}
                  className="flex items-start group"
                >
                  <div className="flex-shrink-0 w-2.5 h-2.5 mt-2 rounded-full bg-primary mr-4 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                    <h3 className="text-heading text-lg md:text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-body text-sm md:text-base leading-relaxed">{value.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section id="leadership" className="pt-10 md:pt-14 pb-16 md:pb-24 bg-cream">
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
                      loading="lazy"
                      decoding="async"
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
