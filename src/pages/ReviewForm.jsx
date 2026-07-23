import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ReviewForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    rating: 0,
    text: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError('Please select a rating out of 5 stars.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/reviews', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', org: '', rating: 0, text: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream pt-6 sm:pt-8 pb-8 sm:pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.span variants={fadeInUp} className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
            Share Your Experience
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold mt-3 text-heading leading-tight">
            Write a Review
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-light mt-4 max-w-2xl mx-auto">
            We highly value your feedback. Let us know how Dominion Softwares has impacted your mission or organization.
          </motion.p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-border-light overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Creative Visuals */}
          <div className="md:w-5/12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-heading mb-4">Your Voice Matters</h3>
              <p className="text-body-light leading-relaxed mb-8 text-sm">
                Reviews from our beloved clients are instantly featured on our homepage to help others make informed decisions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-body">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FaCheckCircle />
                  </div>
                  <span>Published directly to our homepage</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-body">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FaCheckCircle />
                  </div>
                  <span>Your email address remains strictly private</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-7/12 p-8 md:p-12 relative">
            <AnimatePresence>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white z-10 rounded-r-3xl"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-3">Thank You!</h3>
                  <p className="text-body-light max-w-sm">
                    Your review has been successfully submitted and will now appear on our platform. We deeply appreciate your support!
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-primary font-semibold hover:underline"
                  >
                    Submit another review
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                  {error}
                </div>
              )}

              {/* Star Rating Section */}
              <div className="flex flex-col items-center justify-center py-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-sm font-semibold text-body-light mb-3">How would you rate our services?</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                        (hoveredRating || formData.rating) >= star 
                          ? 'text-[#FF8C00]' 
                          : 'text-gray-200'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Pastor James K."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Role / Organization</label>
                  <input
                    type="text"
                    name="org"
                    value={formData.org}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Grace Community Church"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Email Address <span className="text-body-light font-normal">(Kept private)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="dominionsoftwares001@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-heading mb-2">Your Review</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Tell us about your experience..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Publish Review <FaPaperPlane className="text-sm" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-body-light">
            Have a general inquiry or need a custom solution?{' '}
            <Link to="/contact" className="text-primary font-bold hover:underline">
              Contact Us Here &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
