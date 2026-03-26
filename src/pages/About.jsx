import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBullseye, FaEye, FaHandshake, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const values = [
  { icon: FaLightbulb, title: 'Innovation', desc: 'We push boundaries with modern technologies to deliver forward-thinking solutions.' },
  { icon: FaHandshake, title: 'Reliability', desc: 'Our clients trust us to deliver quality, on time, every time.' },
  { icon: FaUsers, title: 'Customer Focus', desc: 'Every solution is crafted around your unique needs and goals.' },
  { icon: FaRocket, title: 'Excellence', desc: 'We hold ourselves to the highest standards in every line of code.' },
];

const timeline = [
  { year: '2019', title: 'Founded', desc: 'Dominion Softwares was established with a vision to serve organizations with technology.' },
  { year: '2020', title: 'First Major Project', desc: 'Delivered our first church management system serving 2,000+ members.' },
  { year: '2021', title: 'Expansion', desc: 'Expanded services to include mobile app development and cloud solutions.' },
  { year: '2022', title: 'Growing Impact', desc: 'Reached 20+ clients across churches, schools, and mission organizations.' },
  { year: '2023', title: 'Innovation Hub', desc: 'Launched our digital transformation consulting services for larger institutions.' },
  { year: '2024', title: 'New Horizons', desc: 'Expanding into general trading and integrated payment solutions.' },
];

export default function About() {
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-cream-dark/50">
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">
            About Us
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-heading text-5xl md:text-6xl font-bold mt-4 mb-6">
            Building the <span className="text-primary">Future</span> of
            <br />Organization Technology
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto">
            Dominion Softwares is a technology-focused enterprise delivering practical,
            reliable technology tools that improve efficiency and accessibility of digital services.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section ref={missionRef} className="section-padding bg-cream">
        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12"
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-border-light hover:shadow-lg hover:shadow-primary/8 transition-all duration-400">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <FaBullseye className="text-primary text-3xl" />
            </div>
            <h2 className="text-heading text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-body text-lg">
              To deliver practical and reliable technology tools that improve efficiency,
              productivity, and accessibility of digital services for individuals, businesses,
              and institutions committed to making a difference.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-border-light hover:shadow-lg hover:shadow-primary/8 transition-all duration-400">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <FaEye className="text-primary text-3xl" />
            </div>
            <h2 className="text-heading text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-body text-lg">
              To be the leading software development partner for organizations across Africa,
              empowering them with world-class digital solutions that automate, optimize,
              and help them dominate in their respective fields.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="section-padding bg-cream-dark/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">
              Our Values
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mt-4">
              What <span className="text-primary">Drives</span> Us
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}
                className="bg-white rounded-2xl p-8 border border-border-light hover:shadow-lg hover:shadow-primary/8
                           transition-all duration-400 text-center group hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6
                                group-hover:bg-primary/20 transition-colors">
                  <value.icon className="text-primary text-2xl" />
                </div>
                <h3 className="text-heading text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-body">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={timelineInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">
              Our Journey
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-heading text-4xl md:text-5xl font-bold mt-4">
              The <span className="text-primary">Story</span> So Far
            </motion.h2>
          </motion.div>

          <motion.div
            className="relative"
            initial="hidden"
            animate={timelineInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                variants={fadeInUp}
                className={`flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-20 md:pl-0`}>
                  <span className="text-primary font-bold text-lg">{item.year}</span>
                  <h3 className="text-heading text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-body">{item.desc}</p>
                </div>
                <div className="absolute left-8 md:relative md:left-0 w-4 h-4 bg-primary rounded-full
                                border-4 border-cream z-10 shrink-0" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
