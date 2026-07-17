import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function Philosophy() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-primary text-white py-16 px-5 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-sm font-bold text-white/80 uppercase tracking-[0.2em] mb-4">Our Philosophy</h2>
          
          <h3 className="text-4xl md:text-6xl font-extrabold mb-10 leading-tight">
            Heavenly Inspired. <br className="hidden md:block" />
            Professionally Engineered.
          </h3>
          
          <div className="space-y-6 text-lg md:text-xl text-white/90 leading-relaxed font-light">
            <p>
              At Dominion Softwares, we believe technology is a gift that can transform lives, organizations and communities.
            </p>
            <p>
              While our foundation is rooted in Christian values and Kingdom excellence, our solutions are built to serve organizations across every industry with professionalism, innovation and integrity.
            </p>
            <p>
              From local churches and international ministries to corporations, governments and global enterprises, we build software that creates lasting impact.
            </p>
          </div>
          
          <div className="mt-16 inline-block">
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-widest border-b-2 border-white/30 pb-2">
              Automation Our Ultimate Goal.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
