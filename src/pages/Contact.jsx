import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const contactInfo = [
  { icon: FaMapMarkerAlt, title: 'Visit Us', lines: ['Nairobi, Kenya', 'East Africa'] },
  { icon: FaPhone, title: 'Call Us', lines: ['+254 700 000 000', '+254 711 000 000'] },
  { icon: FaEnvelope, title: 'Email Us', lines: ['info@dominionsoftwares.com', 'support@dominionsoftwares.com'] },
  { icon: FaClock, title: 'Working Hours', lines: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', phone: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
    setLoading(false);
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-cream-dark/50">
        <motion.div className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeInUp} className="text-primary text-sm uppercase tracking-widest">Get In Touch</motion.span>
          <motion.h1 variants={fadeInUp} className="text-heading text-5xl md:text-6xl font-bold mt-4 mb-6">
            Let&apos;s Start a <span className="text-primary">Conversation</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto">
            Have a question or want to discuss your project? We&apos;d love to hear from you.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {contactInfo.map((info) => (
              <motion.div key={info.title} variants={fadeInUp}
                className="bg-white rounded-2xl p-7 border border-border-light text-center
                           hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4
                                group-hover:bg-primary/20 transition-colors">
                  <info.icon className="text-primary text-xl" />
                </div>
                <h3 className="text-heading font-semibold mb-2">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-body text-sm">{line}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div className="max-w-3xl mx-auto" initial="hidden"
            whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeInUp}
              className="bg-white rounded-2xl p-8 md:p-10 border border-border-light shadow-sm">
              <h2 className="text-heading text-3xl font-bold mb-8 text-center">
                Send Us a <span className="text-primary">Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-body mb-2">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                      placeholder="Ken Mutuku"
                      className="w-full px-4 py-3 bg-cream border border-border-light rounded-xl
                                 text-heading placeholder-body-light/50 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      placeholder="ken@example.com"
                      className="w-full px-4 py-3 bg-cream border border-border-light rounded-xl
                                 text-heading placeholder-body-light/50 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-body mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 bg-cream border border-border-light rounded-xl
                               text-heading placeholder-body-light/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-body mb-2">Your Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows="5"
                    placeholder="Tell us about your project or question..."
                    className="w-full px-4 py-3 bg-cream border border-border-light rounded-xl
                               text-heading placeholder-body-light/50 focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><FaPaperPlane /> Send Message</>}
                </button>

                {status === 'success' && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-green-600 text-center font-medium">
                    Message sent successfully! We&apos;ll get back to you soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center font-medium">
                    Something went wrong. Please try again later.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
