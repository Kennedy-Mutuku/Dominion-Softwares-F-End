import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function IntroHeader() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white pt-16 pb-10 px-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
          className="text-primary text-sm uppercase tracking-[0.2em] font-bold mb-4"
        >
          Tailored Software Solutions for Every Mission
        </motion.h2>
        
        <motion.h3 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-heading leading-tight mb-8"
        >
          Building Digital Solutions for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
            Kingdom Advancement, Business Growth & National Transformation
          </span>
        </motion.h3>
        
        <motion.p 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
          className="text-body text-lg md:text-xl max-w-4xl mx-auto mb-10 leading-relaxed"
        >
          Whether you're a church, ministry, NGO, startup, school, hospital, corporation, 
          government agency or enterprise - we transform your ideas into powerful digital solutions 
          that solve real-world problems.
        </motion.p>
        
        <motion.div 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
          className="inline-block relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <p className="relative text-2xl md:text-3xl font-bold text-heading italic px-8 py-4 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-xl">
            "If you can imagine it, we can build it."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
