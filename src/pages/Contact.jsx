import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill out all fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: 'Contact Form Message',
        message: form.message.trim()
      });
      toast.success('Message sent successfully!');
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-heading pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
          >
            Contact Us
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-base leading-relaxed">
            Have a question or a project in mind? Send us a message and we'll get back to you.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          className="grid lg:grid-cols-5 gap-8 items-start"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Left: Contact Info (2 / 5) */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-4">
            {[
              {
                icon: <FaMapMarkerAlt />,
                label: 'Location',
                line1: 'Nairobi, Kenya',
                line2: 'East Africa'
              },
              {
                icon: <FaPhone />,
                label: 'Phone',
                line1: '0740 881 485',
                href: 'tel:0740881485',
                cta: 'Tap to call'
              },
              {
                icon: <FaEnvelope />,
                label: 'Email',
                line1: 'info@dominionsoftwares.com',
                href: 'mailto:info@dominionsoftwares.com',
                cta: 'Send email'
              },
              {
                icon: <FaClock />,
                label: 'Hours',
                line1: 'Mon – Fri: 8 AM – 6 PM',
                line2: 'Sat: 9 AM – 1 PM'
              }
            ].map((item, i) => {
              const inner = (
                <>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-body-light">{item.label}</p>
                    <p className="text-sm font-semibold text-heading mt-0.5">{item.line1}</p>
                    {item.line2 && <p className="text-xs text-body-light">{item.line2}</p>}
                    {item.cta && (
                      <span className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                        {item.cta} <FaArrowRight className="text-[9px]" />
                      </span>
                    )}
                  </div>
                </>
              );

              const cls = "flex items-start gap-4 bg-white p-5 rounded-2xl border border-border-light hover:border-primary/30 hover:shadow-sm transition-all duration-200 group";

              return item.href ? (
                <a key={i} href={item.href} className={cls}>{inner}</a>
              ) : (
                <div key={i} className={cls}>{inner}</div>
              );
            })}
          </motion.div>

          {/* Right: Contact Form (3 / 5) */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-border-light shadow-sm">

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl border border-emerald-100">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-heading">Message Sent!</h3>
                    <p className="text-sm text-body-light mt-1">We'll respond to your inquiry shortly.</p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-body-light text-sm">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Kennedy"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-body-light text-sm">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="dominionsoftwares001@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full p-4 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaPaperPlane className="text-xs" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
