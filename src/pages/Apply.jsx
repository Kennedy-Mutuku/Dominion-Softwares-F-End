import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaRocket, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const orgTypes = ['Church', 'Mission Organization', 'School / Educational Institution', 'NGO / Non-Profit', 'Business / Enterprise', 'Other'];
const budgetRanges = ['Under KES 50,000', 'KES 50,000 - 150,000', 'KES 150,000 - 500,000', 'KES 500,000 - 1,000,000', 'Above KES 1,000,000', 'Not sure yet'];
const timelines = ['1 - 2 Weeks', '1 - 3 Months', '3 - 6 Months', '6+ Months', 'Flexible / Ongoing'];

export default function Apply() {
  const [form, setForm] = useState({
    organizationName: '', organizationType: '', contactPerson: '',
    email: '', phone: '', projectDescription: '', budget: '', timeline: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success');
        setForm({ organizationName: '', organizationType: '', contactPerson: '',
          email: '', phone: '', projectDescription: '', budget: '', timeline: '' });
      } else setStatus('error');
    } catch { setStatus('error'); }
    setLoading(false);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding bg-cream">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-10 border border-border-light shadow-lg max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-heading text-3xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-body mb-6">
            Thank you for choosing Dominion Softwares. Our team will review your application
            and get back to you within 24-48 hours.
          </p>
          <button onClick={() => setStatus(null)} className="btn-primary">Submit Another Application</button>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-cream border border-border-light rounded-xl text-heading placeholder-body-light/50 focus:outline-none focus:border-primary transition-colors";
  const selectClass = "w-full px-4 py-3 bg-cream border border-border-light rounded-xl text-heading focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer";

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 section-padding relative overflow-hidden bg-cream-dark/50">
        <div className="absolute top-32 right-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
        <motion.div className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-primary text-sm uppercase tracking-widest mb-4">
            <FaRocket /> Apply for Software Development
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-heading text-5xl md:text-6xl font-bold mt-4 mb-6">
            Tell Us About <span className="text-primary">Your Project</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-lg max-w-2xl mx-auto">
            Fill out the form below and our team will reach out to discuss how we can
            bring your vision to life with custom software solutions.
          </motion.p>
        </motion.div>
      </section>

      {/* Application Form */}
      <section className="section-padding bg-cream">
        <motion.div className="max-w-3xl mx-auto" initial="hidden"
          whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeInUp}
            className="bg-white rounded-2xl p-8 md:p-10 border border-border-light shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Details */}
              <div className="border-b border-border-light pb-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Organization Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-body mb-2">Organization Name *</label>
                    <input type="text" name="organizationName" value={form.organizationName}
                      onChange={handleChange} required placeholder="e.g., Grace Community Church"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Organization Type *</label>
                    <select name="organizationType" value={form.organizationType}
                      onChange={handleChange} required className={selectClass}>
                      <option value="" className="bg-white">Select type...</option>
                      {orgTypes.map((t) => <option key={t} value={t} className="bg-white">{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-b border-border-light pb-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Contact Information</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-body mb-2">Contact Person *</label>
                    <input type="text" name="contactPerson" value={form.contactPerson}
                      onChange={handleChange} required placeholder="Full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Email *</label>
                    <input type="email" name="email" value={form.email}
                      onChange={handleChange} required placeholder="email@org.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Phone *</label>
                    <input type="tel" name="phone" value={form.phone}
                      onChange={handleChange} required placeholder="+254 7XX XXX XXX" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Project Details</h3>
                <div className="mb-6">
                  <label className="block text-sm text-body mb-2">Project Description *</label>
                  <textarea name="projectDescription" value={form.projectDescription}
                    onChange={handleChange} required rows="5"
                    placeholder="Describe what you need: What problem are you solving? Who will use the software? What features do you need?"
                    className={`${inputClass} resize-none`} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-body mb-2">Budget Range</label>
                    <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                      <option value="" className="bg-white">Select budget...</option>
                      {budgetRanges.map((b) => <option key={b} value={b} className="bg-white">{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-body mb-2">Expected Timeline</label>
                    <select name="timeline" value={form.timeline} onChange={handleChange} className={selectClass}>
                      <option value="" className="bg-white">Select timeline...</option>
                      {timelines.map((t) => <option key={t} value={t} className="bg-white">{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-8">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><FaPaperPlane /> Submit Application</>}
              </button>

              {status === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-500 text-center font-medium">
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
