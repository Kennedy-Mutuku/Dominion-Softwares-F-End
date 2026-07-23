import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaBuilding,
  FaLock
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('message'); // 'message' | 'review'

  useEffect(() => {
    if (location.hash === '#review' || location.hash === '#reviews' || location.search.includes('tab=review')) {
      setActiveTab('review');
    }
  }, [location]);

  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', org: '', rating: 5, text: '' });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReviewChange = (e) =>
    setReviewForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.email.trim() || !reviewForm.text.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }
    if (reviewForm.rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    setReviewLoading(true);
    try {
      await api.post('/reviews', {
        name: reviewForm.name.trim(),
        email: reviewForm.email.trim(),
        org: reviewForm.org.trim() || 'Valued Client',
        rating: reviewForm.rating,
        text: reviewForm.text.trim()
      });
      toast.success('Thank you for your review!');
      setReviewSubmitted(true);
      setReviewForm({ name: '', email: '', org: '', rating: 5, text: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-heading pt-6 sm:pt-8 pb-8 sm:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-8"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
          >
            Contact Us
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-base leading-relaxed">
            Have a question or a project in mind? Send us a message or leave a client review.
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
          <motion.div id="info" variants={fadeInUp} className="lg:col-span-2 space-y-4">
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
                line1: 'dominionsoftwares001@gmail.com',
                href: 'mailto:dominionsoftwares001@gmail.com',
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

          {/* Right: Interactive Form Box (3 / 5) */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border-light shadow-sm">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-xl mb-6 border border-border-light/70">
                <button
                  type="button"
                  onClick={() => setActiveTab('message')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'message'
                      ? 'bg-white text-heading shadow-sm border border-border-light/80'
                      : 'text-body-light hover:text-heading'
                  }`}
                >
                  <FaEnvelope className={activeTab === 'message' ? 'text-primary' : ''} /> Send a Message
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'review'
                      ? 'bg-white text-heading shadow-sm border border-border-light/80'
                      : 'text-body-light hover:text-heading'
                  }`}
                >
                  <FaStar className={activeTab === 'review' ? 'text-[#FF8C00]' : ''} /> Leave a Review
                </button>
              </div>

              {/* TAB 1: MESSAGE FORM */}
              {activeTab === 'message' && (
                submitted ? (
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
                )
              )}

              {/* TAB 2: REVIEW FORM */}
              {activeTab === 'review' && (
                reviewSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-50 text-[#FF8C00] flex items-center justify-center text-2xl border border-amber-100">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-heading">Thank You for Your Review!</h3>
                      <p className="text-sm text-body-light mt-1">Your feedback has been published and will now appear on our home page.</p>
                    </div>
                    <button
                      onClick={() => setReviewSubmitted(false)}
                      className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Submit another review
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5" autoComplete="off">
                    <div>
                      <h3 className="text-base font-bold text-heading mb-1">Share Your Experience</h3>
                      <p className="text-xs text-body-light">Rate our software and services. Public reviews help other organizations know what we do.</p>
                    </div>

                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-heading mb-1.5">
                        Your Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                          >
                            <FaStar
                              className={
                                star <= (hoveredRating || reviewForm.rating)
                                  ? 'text-[#FF8C00]'
                                  : 'text-gray-200'
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-heading ml-2">
                          {reviewForm.rating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-heading mb-1.5">
                        Your Name / Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-body-light text-sm">
                          <FaUser />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={reviewForm.name}
                          onChange={handleReviewChange}
                          required
                          placeholder="e.g. Pastor James K. or Sarah M."
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Organization / Ministry */}
                    <div>
                      <label className="block text-xs font-semibold text-heading mb-1.5">
                        Organization / Ministry / Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-body-light text-sm">
                          <FaBuilding />
                        </div>
                        <input
                          type="text"
                          name="org"
                          value={reviewForm.org}
                          onChange={handleReviewChange}
                          required
                          placeholder="e.g. Grace Community Church or Hope Missions"
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
                          value={reviewForm.email}
                          onChange={handleReviewChange}
                          required
                          placeholder="dominionsoftwares001@gmail.com"
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-body-light mt-1.5 flex items-center gap-1.5">
                        <FaLock className="text-[10px] text-emerald-600 shrink-0" />
                        <span>Your email address remains strictly private and is only visible to site administrators.</span>
                      </p>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-xs font-semibold text-heading mb-1.5">
                        Your Review <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="text"
                        value={reviewForm.text}
                        onChange={handleReviewChange}
                        required
                        rows="4"
                        placeholder="Write your experience with Dominion Softwares..."
                        className="w-full p-4 bg-[#FAF8F5] border border-border-light rounded-xl text-sm text-heading placeholder:text-body-light/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Review */}
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="w-full py-3.5 px-6 bg-[#FF8C00] text-white font-bold rounded-xl hover:bg-[#e07b00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm"
                    >
                      {reviewLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaStar className="text-xs" /> Submit Review
                        </>
                      )}
                    </button>
                  </form>
                )
              )}

            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
