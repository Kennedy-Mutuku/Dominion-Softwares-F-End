import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaCheckCircle, FaPaperPlane, FaArrowRight, FaArrowLeft, FaChurch, FaBriefcase, FaInfoCircle, FaPaperclip } from 'react-icons/fa';
import api from '../utils/api';
import DynamicAssetUploader from '../components/DynamicAssetUploader';
import MediaPreviewGrid from '../components/MediaPreviewGrid';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Form sections configuration
const STEPS = [
  { id: 1, title: 'Organization Type', icon: FaInfoCircle },
  { id: 2, title: 'Basic Information', icon: FaInfoCircle },
  { id: 3, title: 'Project Requirements', icon: FaInfoCircle },
  { id: 4, title: 'Technical Details', icon: FaInfoCircle },
  { id: 5, title: 'Budget & Timeline', icon: FaInfoCircle },
  { id: 6, title: 'Review Summary', icon: FaCheckCircle },
];

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientType, setClientType] = useState(''); // 'ministry' or 'business'
  const [form, setForm] = useState({
    // Step 1: Organization Type
    organizationType: '',
    organizationTypeOther: '',
    
    // Step 2: Basic Information
    organizationName: '',
    targetAudience: '',
    contactPerson: '',
    email: '',
    phone: '',
    
    // Step 3: Project Requirements
    projectDescription: '',
    primaryGoal: '',
    contentManagement: '',
    
    // Step 4: Technical Details
    needAccounts: '',
    accountTypes: [],
    paymentIntegration: '',
    specificFeatures: '',
    
    // Step 5: Budget & Timeline
    budget: '',
    timeline: '',
    additionalNotes: '',

    // Media & Production Assets
    attachedFiles: []
  });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentValues = form.accountTypes || [];
      setForm({
        ...form,
        accountTypes: checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value)
      });
    } else if (name === 'phone') {
      const cleaned = value.replace(/[^\d+]/g, '').slice(0, 15);
      setForm({ ...form, [name]: cleaned });
    } else if (name === 'contactPerson') {
      const cleaned = value.replace(/[^a-zA-Z\s-]/g, '');
      setForm({ ...form, [name]: cleaned });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFilesChanged = (newFiles) => {
    setForm(prev => ({ ...prev, attachedFiles: newFiles }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/applications', { ...form, clientType });
      if (res.status === 200 || res.status === 201) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setStatus('error');
    }
    setLoading(false);
  };

  const scrollToForm = () => {
    const el = document.getElementById('form-section');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      scrollToForm();
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToForm();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.organizationType !== '' && (form.organizationType !== 'Other' || form.organizationTypeOther !== '');
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(form.email);
        const isValidPhone = form.phone.length >= 10;
        return form.organizationName && form.contactPerson && isValidEmail && isValidPhone;
      case 3:
        return form.projectDescription && form.primaryGoal;
      case 4:
        return form.needAccounts !== '';
      case 5:
        return true; // Budget and timeline are optional
      default:
        return true;
    }
  };

  if (status === 'success') {
    return (
      <div className="py-12 md:py-20 flex justify-center px-4 bg-cream min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-10 border border-border-light shadow-xl max-w-lg text-center w-full">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-heading text-3xl font-bold mb-3">Application Submitted!</h2>
          <p className="text-body mb-6 leading-relaxed">
            Thank you for choosing Dominion Softwares Ltd. Our team will review your requirements
            and attached media, then get back to you within <span className="font-semibold text-primary">24–48 hours</span>.
          </p>

          {form.attachedFiles && form.attachedFiles.length > 0 && (
            <div className="bg-cream-dark/30 border border-orange-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaPaperclip /> {form.attachedFiles.length} Media & Asset File(s) Received
              </p>
              <ul className="text-xs text-body space-y-1">
                {form.attachedFiles.map(file => (
                  <li key={file.id} className="truncate">• {file.name} ({file.category || 'General'})</li>
                ))}
              </ul>
            </div>
          )}

          {/* Credentials Card */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 text-left">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">📋 Your Client Portal Access</p>
            <p className="text-sm text-body mb-3 text-center">
              Sign in anytime to track your project and give feedback. These credentials have also been <strong>emailed to you</strong>.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2.5 border border-orange-100">
                <span className="text-xs text-body-light font-semibold uppercase">Username</span>
                <span className="text-sm font-bold text-heading">{form.email}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2.5 border border-orange-100">
                <span className="text-xs text-body-light font-semibold uppercase">Password</span>
                <span className="text-sm font-bold text-primary tracking-widest">happyclient</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
              <FaRocket /> Sign In to Portal
            </Link>
            <Link to="/" className="btn-outline">Go to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3.5 bg-cream border border-border-light rounded-xl text-heading placeholder-body-light/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const selectClass = "w-full px-4 py-3.5 bg-cream border border-border-light rounded-xl text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer";
  const radioClass = "w-5 h-5 text-primary border-border-light focus:ring-2 focus:ring-primary/20 cursor-pointer";
  const checkboxClass = "w-4 h-4 text-primary border-border-light rounded focus:ring-2 focus:ring-primary/20 cursor-pointer";

  return (
    <div>
      {/* Hero */}
      <section className="pt-8 md:pt-12 pb-6 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-cream to-cream-dark/30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" 
          animate="visible" 
          variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest mb-2 font-semibold">
            <FaRocket /> Software Development Application
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-heading text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 mb-3 leading-tight">
            Let's Build Something <span className="text-primary">Amazing Together</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Answer a few questions and share your vision or brand assets so we can craft the perfect solution for your ministry or business.
          </motion.p>
        </motion.div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white border-b border-border-light py-3">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-cream text-body-light border-2 border-border-light'
                  }`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <p className={`text-[10px] mt-1 font-medium hidden md:block ${
                    currentStep >= step.id ? 'text-primary' : 'text-body-light'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-1 md:mx-2 rounded transition-all duration-300 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border-light'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="py-6 px-4 md:px-8 bg-cream min-h-[40vh]">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-5 md:p-8 border border-border-light shadow-sm"
            >
              {renderStep(
                currentStep, 
                form, 
                handleChange, 
                handleFilesChanged,
                clientType, 
                setClientType, 
                inputClass, 
                selectClass, 
                radioClass, 
                checkboxClass
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-border-light">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn-outline flex items-center gap-2 ${
                    currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <FaArrowLeft className="text-sm" /> Previous
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || loading}
                  className={`btn-primary flex items-center gap-2 ${
                    !canProceed() || loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : currentStep === STEPS.length ? (
                    <>
                      <FaPaperPlane /> Submit Application
                    </>
                  ) : (
                    <>
                      Next <FaArrowRight className="text-sm" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center font-medium mt-4">
                  Something went wrong. Please try again or contact us directly.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// Helper function to render each step
function renderStep(step, form, handleChange, handleFilesChanged, clientType, setClientType, inputClass, selectClass, radioClass, checkboxClass) {

  switch (step) {
    case 1:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">What type of organization are you?</h2>
          <p className="text-sm text-body mb-4">This helps us tailor the questions and media requirements to your specific needs.</p>
          
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                setClientType('ministry');
                handleChange({ target: { name: 'organizationType', value: '' }});
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                clientType === 'ministry'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border-light hover:border-primary/30'
              }`}
            >
              <FaChurch className="text-2xl text-primary mb-2" />
              <h3 className="font-bold text-base text-heading mb-1">Church / Ministry</h3>
              <p className="text-xs text-body">
                Local churches, multi-branch ministries, parachurch organizations, faith-based NGOs
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setClientType('business');
                handleChange({ target: { name: 'organizationType', value: '' }});
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                clientType === 'business'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border-light hover:border-primary/30'
              }`}
            >
              <FaBriefcase className="text-2xl text-primary mb-2" />
              <h3 className="font-bold text-base text-heading mb-1">Business / Organization</h3>
              <p className="text-xs text-body">
                Businesses, schools, hospitals, hotels, retail, professional services
              </p>
            </button>
          </div>

          {clientType && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <label className="block text-sm font-medium text-body mb-2">
                {clientType === 'ministry' ? 'Select your ministry type:' : 'Select your industry:'}
              </label>
              
              {clientType === 'ministry' ? (
                <div className="space-y-3">
                  {[
                    { value: 'Local Church / Single Congregation', label: 'Local Church / Single Congregation' },
                    { value: 'Multi-Branch Ministry / Fellowship', label: 'Multi-Branch Ministry / Fellowship' },
                    { value: 'Parachurch Organization', label: 'Parachurch Organization (Evangelistic, youth, choir groups)' },
                    { value: 'Faith-Based NGO / Outreach', label: 'Community Outreach / Faith-Based NGO' },
                    { value: 'Other', label: 'Other' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                      <input
                        type="radio"
                        name="organizationType"
                        value={option.value}
                        checked={form.organizationType === option.value}
                        onChange={handleChange}
                        className={radioClass}
                      />
                      <span className="text-sm text-heading">{option.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { value: 'Hospitality & Tourism', label: 'Hospitality & Tourism (Resorts, Hotels, Restaurants)' },
                    { value: 'Healthcare & Medical', label: 'Healthcare & Medical Services (Hospitals, Clinics, Pharmacies)' },
                    { value: 'Retail & E-commerce', label: 'Retail & E-commerce (Selling products online or physical stores)' },
                    { value: 'Professional Services', label: 'Professional Services (Law, Consulting, Real Estate, Finance)' },
                    { value: 'Education & Training', label: 'Education & Non-Profit (Schools, Training centers)' },
                    { value: 'Creative & Media', label: 'Creative & Media (Photography, Videography, Entertainment)' },
                    { value: 'Other', label: 'Other' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                      <input
                        type="radio"
                        name="organizationType"
                        value={option.value}
                        checked={form.organizationType === option.value}
                        onChange={handleChange}
                        className={radioClass}
                      />
                      <span className="text-sm text-heading">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {form.organizationType === 'Other' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <input
                    type="text"
                    name="organizationTypeOther"
                    value={form.organizationTypeOther}
                    onChange={handleChange}
                    placeholder="Please specify your organization type"
                    className={inputClass}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      );

    case 2:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Tell us about your organization</h2>
          <p className="text-sm text-body mb-4">Basic information to help us understand who you are.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body mb-2">
                {clientType === 'ministry' ? 'Ministry / Church Name *' : 'Business / Organization Name *'}
              </label>
              <input
                type="text"
                name="organizationName"
                value={form.organizationName}
                onChange={handleChange}
                placeholder={clientType === 'ministry' ? 'e.g., Grace Community Church' : 'e.g., Savannah Hotels Ltd'}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">
                Who is your primary target audience? *
              </label>
              <input
                type="text"
                name="targetAudience"
                value={form.targetAudience}
                onChange={handleChange}
                placeholder={
                  clientType === 'ministry' 
                    ? 'e.g., Local congregation aged 18-65, families with children'
                    : 'e.g., Corporate clients, international tourists, university students'
                }
                className={inputClass}
                required
              />
              <p className="text-xs text-body-light mt-1.5">Help us understand who will use this system.</p>
            </div>

            <div className="border-t border-border-light pt-4 mt-4">
              <h3 className="text-lg font-semibold text-primary mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="dominionsoftwares001@gmail.com"
                    className={`${inputClass} ${form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    required
                  />
                  {form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    className={`${inputClass} ${form.phone && form.phone.length < 10 ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    required
                  />
                  {form.phone && form.phone.length < 10 && (
                    <p className="text-xs text-red-500 mt-1">Must be at least 10 digits.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 3:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">What do you want to build?</h2>
          <p className="text-sm text-body mb-4">Describe your project requirements, goals, and optional vision media.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body mb-2">Project Description *</label>
              <textarea
                name="projectDescription"
                value={form.projectDescription}
                onChange={handleChange}
                rows="3"
                placeholder={
                  clientType === 'ministry'
                    ? 'e.g., We need a member management system to track attendance, tithes/offerings, departments, and send SMS notifications to our 500+ members...'
                    : 'e.g., We need an online booking system for our hotel with payment integration, room management, and guest check-in features...'
                }
                className={`${inputClass} resize-none`}
                required
              />
              <p className="text-xs text-body-light mt-1.5">
                Be as detailed as possible: What problems are you solving? What features do you need?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">Primary Goal *</label>
              <input
                type="text"
                name="primaryGoal"
                value={form.primaryGoal}
                onChange={handleChange}
                placeholder={
                  clientType === 'ministry'
                    ? 'e.g., Automate member record-keeping and improve communication'
                    : 'e.g., Increase online bookings by 50% and reduce manual work'
                }
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">
                {clientType === 'ministry' ? 'How will sermons and events be managed?' : 'How will your content be managed?'}
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="contentManagement"
                    value="static"
                    checked={form.contentManagement === 'static'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">Static Content</span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Basic page showing location, service times, and contact info (rarely changes)'
                        : 'Information rarely changes, developer updates required'
                      }
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="contentManagement"
                    value="dynamic"
                    checked={form.contentManagement === 'dynamic'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">Dynamic Content</span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Dashboard for media team to upload sermons, update events calendar, post notices'
                        : 'Admin dashboard to update products, services, blog posts without code'
                      }
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic Vision Media Uploader */}
            <DynamicAssetUploader
              clientType={clientType}
              mode="vision"
              attachedFiles={form.attachedFiles || []}
              onFilesChanged={handleFilesChanged}
            />
          </div>
        </motion.div>
      );

    case 4:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Technical & Brand Assets</h2>
          <p className="text-sm text-body mb-4">Specify technical features and upload existing organization assets.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body mb-2">
                {clientType === 'ministry' 
                  ? 'Do your members or church leaders need accounts?' 
                  : 'Do users need accounts to access your system?'}
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="needAccounts"
                    value="no"
                    checked={form.needAccounts === 'no'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">No user accounts needed</span>
                    <span className="text-xs text-body-light">Anyone can view the same public information</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="needAccounts"
                    value="members"
                    checked={form.needAccounts === 'members'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">
                      {clientType === 'ministry' ? 'Member accounts only' : 'Customer/user accounts only'}
                    </span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Members log in to track tithes/offerings, join groups, view member-only content'
                        : 'Users log in to view orders, bookings, or personalized content'
                      }
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="needAccounts"
                    value="both"
                    checked={form.needAccounts === 'both'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">
                      {clientType === 'ministry' ? 'Both members and leadership accounts' : 'Both users and admin accounts'}
                    </span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Pastors, treasurers, department heads manage backend, members access their info'
                        : 'Admins manage the system, users/customers access their accounts'
                      }
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {(form.needAccounts === 'members' || form.needAccounts === 'both') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-sm font-medium text-body mb-2">
                  What specific account types do you need? (Check all that apply)
                </label>
                <div className="space-y-2">
                  {clientType === 'ministry' ? (
                    <>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Regular Members" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Regular Members</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Pastors/Leaders" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Pastors / Church Leaders</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Department Heads" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Department Heads (Youth, Media, Treasury, etc.)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Volunteers" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Volunteers</span>
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Customers/Clients" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Customers / Clients</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Admin/Staff" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Admin / Staff</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                        <input type="checkbox" value="Vendors/Partners" onChange={handleChange} className={checkboxClass} />
                        <span className="text-sm text-heading">Vendors / Partners</span>
                      </label>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-body mb-2">
                {clientType === 'ministry' 
                  ? 'How will the ministry collect tithes, offerings, or donations?' 
                  : 'Do you need payment integration?'}
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="paymentIntegration"
                    value="none"
                    checked={form.paymentIntegration === 'none'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">No online payments</span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Physical offerings only or display Paybill number'
                        : 'No payment processing needed'
                      }
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="paymentIntegration"
                    value="mobile"
                    checked={form.paymentIntegration === 'mobile'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">Mobile Money (M-Pesa STK Push)</span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Members input phone number for instant M-Pesa prompt to tithe/donate'
                        : 'Accept M-Pesa payments with instant confirmation'
                      }
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
                  <input
                    type="radio"
                    name="paymentIntegration"
                    value="global"
                    checked={form.paymentIntegration === 'global'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-medium text-heading block">Global Payments</span>
                    <span className="text-xs text-body-light">
                      {clientType === 'ministry'
                        ? 'Mobile money + international credit cards for global partners'
                        : 'Mobile money + credit/debit cards for international customers'
                      }
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">
                Any other specific features or integrations you need?
              </label>
              <textarea
                name="specificFeatures"
                value={form.specificFeatures}
                onChange={handleChange}
                rows="4"
                placeholder={
                  clientType === 'ministry'
                    ? 'e.g., SMS notifications, mobile app, live streaming integration, attendance tracking with QR codes...'
                    : 'e.g., SMS notifications, mobile app, inventory management, CRM integration, analytics dashboard...'
                }
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Dynamic Site & Production Brand Assets Uploader */}
            <DynamicAssetUploader
              clientType={clientType}
              mode="assets"
              attachedFiles={form.attachedFiles || []}
              onFilesChanged={handleFilesChanged}
            />
          </div>
        </motion.div>
      );

    case 5:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Budget & Timeline</h2>
          <p className="text-sm text-body mb-4">Help us plan the project scope and delivery.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body mb-2">Estimated Budget (Optional)</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                <option value="">Select budget range...</option>
                <option value="Under KES 50,000">Under KES 50,000</option>
                <option value="KES 50,000 - 150,000">KES 50,000 - 150,000</option>
                <option value="KES 150,000 - 500,000">KES 150,000 - 500,000</option>
                <option value="KES 500,000 - 1,000,000">KES 500,000 - 1,000,000</option>
                <option value="Above KES 1,000,000">Above KES 1,000,000</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
              <p className="text-xs text-body-light mt-1.5">This helps us recommend the right solution for your needs.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">Expected Timeline (Optional)</label>
              <select name="timeline" value={form.timeline} onChange={handleChange} className={selectClass}>
                <option value="">Select timeline...</option>
                <option value="1 - 2 Weeks">1 - 2 Weeks (Urgent)</option>
                <option value="1 - 3 Months">1 - 3 Months (Standard)</option>
                <option value="3 - 6 Months">3 - 6 Months (Complex project)</option>
                <option value="6+ Months">6+ Months (Enterprise solution)</option>
                <option value="Flexible / Ongoing">Flexible / Ongoing development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-2">Additional Notes or Questions</label>
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                rows="5"
                placeholder="Is there anything else we should know? Any specific concerns or questions?"
                className={`${inputClass} resize-none`}
              />
            </div>

          </div>
        </motion.div>
      );

    case 6:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Review Your Application</h2>
          <p className="text-sm text-body mb-4">Please verify the details below before submitting.</p>

          <div className="bg-white border border-border-light rounded-xl p-4 md:p-6 mb-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-body-light text-xs font-semibold uppercase tracking-wider mb-1">Organization</p>
                <p className="text-heading font-medium">{form.organizationName}</p>
                <p className="text-body">{form.organizationType === 'Other' ? form.organizationTypeOther : form.organizationType}</p>
              </div>
              <div>
                <p className="text-body-light text-xs font-semibold uppercase tracking-wider mb-1">Contact Details</p>
                <p className="text-heading font-medium">{form.contactPerson}</p>
                <p className="text-body">{form.email} &bull; {form.phone}</p>
              </div>
              <div className="md:col-span-2 pt-2 border-t border-border-light">
                <p className="text-body-light text-xs font-semibold uppercase tracking-wider mb-1">Project Goals</p>
                <p className="text-body mb-2"><span className="font-medium text-heading">Target Audience:</span> {form.targetAudience}</p>
                <p className="text-body mb-2"><span className="font-medium text-heading">Primary Goal:</span> {form.primaryGoal}</p>
                <p className="text-body"><span className="font-medium text-heading">Description:</span> {form.projectDescription}</p>
              </div>
              <div className="md:col-span-2 pt-2 border-t border-border-light">
                <p className="text-body-light text-xs font-semibold uppercase tracking-wider mb-1">Technical & Budget</p>
                <p className="text-body mb-1">Accounts needed: {form.needAccounts}</p>
                <p className="text-body mb-1">Budget: {form.budget || 'Not specified'}</p>
                <p className="text-body">Timeline: {form.timeline || 'Not specified'}</p>
              </div>

              {/* Attached Media Files Summary */}
              {form.attachedFiles && form.attachedFiles.length > 0 && (
                <div className="md:col-span-2 pt-3 border-t border-border-light">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-body-light text-xs font-semibold uppercase tracking-wider">
                      Attached Media & Assets ({form.attachedFiles.length})
                    </p>
                    <span className="text-[11px] text-primary font-bold">
                      {form.attachedFiles.filter(f => f.category === 'Explain Your Vision' || f.category === 'Vision Media').length} Vision File(s), {' '}
                      {form.attachedFiles.filter(f => f.category !== 'Explain Your Vision' && f.category !== 'Vision Media').length} Brand Asset(s)
                    </span>
                  </div>
                  
                  <MediaPreviewGrid
                    compact={true}
                    files={form.attachedFiles}
                    onRemoveFile={(fileId) => {
                      handleFilesChanged(form.attachedFiles.filter(f => f.id !== fileId));
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-cream-dark/30 border border-primary/20 rounded-xl p-5">
            <h3 className="font-semibold text-heading mb-2 flex items-center gap-2">
              <FaCheckCircle className="text-primary" />
              Ready to submit your application?
            </h3>
            <p className="text-sm text-body leading-relaxed">
              Our team will review your requirements and attached assets, then get back to you within <span className="font-semibold text-primary">24-48 hours</span> with a detailed proposal and accurate cost estimate.
            </p>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}