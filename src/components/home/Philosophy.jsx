import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function Philosophy() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-primary text-white py-10 md:py-14 px-5 relative overflow-hidden border-l-4 border-white/20 ml-px">
      {/* Subtle left edge to separate from sidebar */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-white/30 pointer-events-none" />
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-white/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}
        >
          <h2 className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-3">Our Philosophy</h2>
          
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-snug">
            Heavenly Inspired. <br className="hidden md:block" />
            Professionally Engineered.
          </h3>
          
          <div className="space-y-3 text-sm md:text-base text-white/85 leading-relaxed font-light max-w-2xl mx-auto">
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
          
          <div className="mt-8 inline-block">
            <p className="text-base md:text-lg font-bold uppercase tracking-widest border-b border-white/30 pb-1.5">
              Automation Our Ultimate Goal.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
