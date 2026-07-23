import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaCheckCircle, FaPaperPlane, FaArrowRight, FaArrowLeft, 
  FaChurch, FaBriefcase, FaInfoCircle, FaCloudUploadAlt, FaFileAlt, 
  FaTrash, FaSave, FaVideo, FaLink, FaShieldAlt, FaUsers, FaPlug, 
  FaQuestionCircle, FaRedo, FaExternalLinkAlt, FaFilePdf, FaImage
} from 'react-icons/fa';
import api from '../utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

const STEPS = [
  { id: 1, title: 'Organization Type', icon: FaInfoCircle },
  { id: 2, title: 'Basic Information', icon: FaInfoCircle },
  { id: 3, title: 'Project Requirements', icon: FaInfoCircle },
  { id: 4, title: 'Technical Details', icon: FaInfoCircle },
  { id: 5, title: 'Budget & Timeline', icon: FaInfoCircle },
  { id: 6, title: 'Review Summary', icon: FaCheckCircle },
];

const LOCAL_STORAGE_KEY = 'dominion_apply_draft_v2';

// Kingdom Features for Churches / Ministries
const KINGDOM_FEATURES = [
  { id: 'sermons', label: 'Sermon Audio / Video Archives', desc: 'Searchable media library for audio and video messages' },
  { id: 'livestream', label: 'Live Streaming Integration', desc: 'Embed YouTube, Vimeo or Facebook Live streams' },
  { id: 'giving', label: 'Tithing & Giving Gateway', desc: 'M-Pesa STK Push and card options for tithes and offerings' },
  { id: 'prayer', label: 'Prayer Request & Testimonial Board', desc: 'Private or public prayer submission portal' },
  { id: 'roster', label: 'Member & Volunteer Roster Management', desc: 'Directory, department rosters and attendance tracking' },
  { id: 'bible', label: 'Bible Reading Plans & Devotionals', desc: 'Daily devotional articles, Bible reading trackers' },
  { id: 'groups', label: 'Department & Fellowship Group Hubs', desc: 'Sub-group portals for Youth, Men, Women, Choir' },
];

// Commercial Features for Businesses
const COMMERCIAL_FEATURES = [
  { id: 'ecommerce', label: 'E-Commerce & Product Catalog', desc: 'Online store front, shopping cart and payment checkout' },
  { id: 'inventory', label: 'Inventory Control & Stock Tracking', desc: 'Stock alerts, product variants and warehouse management' },
  { id: 'crm', label: 'Customer Relationship Management (CRM)', desc: 'Lead tracking, customer communications and history' },
  { id: 'invoicing', label: 'Invoice & Automated Billing System', desc: 'PDF generation, recurring billing and receipt tracking' },
  { id: 'portal', label: 'Client / Customer Self-Service Portal', desc: 'User dashboards for orders, subscriptions and support' },
  { id: 'analytics', label: 'Executive Analytics & Reports', desc: 'Real-time sales charts, revenue reporting and metrics' },
  { id: 'booking', label: 'Booking & Appointment Scheduler', desc: 'Calendar reservation system with SMS confirmations' },
];

// Glossary / Tooltip Tooltips Definitions
const TOOLTIPS = {
  nfr: "Non-Functional Requirements (NFRs) define how a system operates rather than specific behaviors (e.g. security, performance, scalability, and uptime).",
  stkPush: "M-Pesa STK Push sends an instant PIN prompt directly to the user's phone for quick payment authorization without manual Paybill dialing.",
  crm: "Customer Relationship Management (CRM) helps manage client interactions, sales pipelines, and customer support history.",
  rbac: "Role-Based Access Control (RBAC) restricts system access based on user roles (e.g., Pastor vs Treasurer, Admin vs Staff).",
  encryption: "SSL/TLS & AES Encryption ensures data in transit and at rest remains private, safe, and secure from unauthorized access.",
  parachurch: "Parachurch organizations are faith-based Christian organizations that work outside of church leadership and denomination bounds to fulfill a specific ministry vision.",
};

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
    contentManagement: 'dynamic',
    selectedFeatures: [],
    
    // Category A: Scope Materials
    designInspirations: {
      images: [], // array of { url, filename }
      videoUrl: ''
    },

    // Step 4: Technical Details
    needAccounts: 'no',
    accountTypes: [],
    paymentIntegration: 'none',
    specificFeatures: '',

    // Category B: Ready-to-Use Brand Assets
    brandAssets: {
      files: [], // array of { url, filename, fileType }
      externalDriveUrl: ''
    },

    // Requirements Engineering NFRs
    nfr: {
      expectedUserCapacity: 'Under 1,000 active users',
      securityRequirements: ['SSL/TLS Encryption', 'Role-Based Access Control (RBAC)'],
      thirdPartyIntegrations: ['M-Pesa STK Push'],
      additionalNfrNotes: ''
    },
    
    // Step 5: Budget & Timeline
    budget: '',
    timeline: '',
    additionalNotes: ''
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingA, setUploadingA] = useState(false);
  const [uploadingB, setUploadingB] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [draftSavedTime, setDraftSavedTime] = useState(null);

  // Restore draft from local storage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.clientType) setClientType(parsed.clientType);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.timestamp) setDraftSavedTime(parsed.timestamp);
      }
    } catch (err) {
      console.error('Failed to load draft from local storage:', err);
    }
  }, []);

  // Save draft whenever state updates
  const saveDraft = (updatedForm = form, updatedClientType = clientType, step = currentStep) => {
    try {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        form: updatedForm,
        clientType: updatedClientType,
        currentStep: step,
        timestamp: now
      }));
      setDraftSavedTime(now);
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDraftSavedTime(null);
    setClientType('');
    setCurrentStep(1);
    setForm({
      organizationType: '',
      organizationTypeOther: '',
      organizationName: '',
      targetAudience: '',
      contactPerson: '',
      email: '',
      phone: '',
      projectDescription: '',
      primaryGoal: '',
      contentManagement: 'dynamic',
      selectedFeatures: [],
      designInspirations: { images: [], videoUrl: '' },
      needAccounts: 'no',
      accountTypes: [],
      paymentIntegration: 'none',
      specificFeatures: '',
      brandAssets: { files: [], externalDriveUrl: '' },
      nfr: {
        expectedUserCapacity: 'Under 1,000 active users',
        securityRequirements: ['SSL/TLS Encryption', 'Role-Based Access Control (RBAC)'],
        thirdPartyIntegrations: ['M-Pesa STK Push'],
        additionalNfrNotes: ''
      },
      budget: '',
      timeline: '',
      additionalNotes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedForm = { ...form };

    if (type === 'checkbox') {
      if (name === 'accountTypes') {
        const currentValues = form.accountTypes || [];
        updatedForm.accountTypes = checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value);
      } else if (name === 'selectedFeatures') {
        const currentValues = form.selectedFeatures || [];
        updatedForm.selectedFeatures = checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value);
      } else if (name === 'nfrSecurity') {
        const currentValues = form.nfr?.securityRequirements || [];
        updatedForm.nfr = {
          ...form.nfr,
          securityRequirements: checked 
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value)
        };
      } else if (name === 'nfrIntegrations') {
        const currentValues = form.nfr?.thirdPartyIntegrations || [];
        updatedForm.nfr = {
          ...form.nfr,
          thirdPartyIntegrations: checked 
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value)
        };
      }
    } else if (name === 'phone') {
      const cleaned = value.replace(/[^\d+]/g, '').slice(0, 15);
      updatedForm.phone = cleaned;
    } else if (name === 'contactPerson') {
      const cleaned = value.replace(/[^a-zA-Z\s-]/g, '');
      updatedForm.contactPerson = cleaned;
    } else if (name.startsWith('designInspirations.')) {
      const field = name.split('.')[1];
      updatedForm.designInspirations = { ...form.designInspirations, [field]: value };
    } else if (name.startsWith('brandAssets.')) {
      const field = name.split('.')[1];
      updatedForm.brandAssets = { ...form.brandAssets, [field]: value };
    } else if (name.startsWith('nfr.')) {
      const field = name.split('.')[1];
      updatedForm.nfr = { ...form.nfr, [field]: value };
    } else {
      updatedForm[name] = value;
    }

    setForm(updatedForm);
    saveDraft(updatedForm, clientType, currentStep);
  };

  // Upload handler for Category A (Design Scope Images)
  const handleUploadCategoryA = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingA(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const res = await api.post('/uploads/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        const uploaded = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        const newImages = uploaded.map(item => ({ url: item.url, filename: item.originalName || item.filename }));
        const updatedForm = {
          ...form,
          designInspirations: {
            ...form.designInspirations,
            images: [...(form.designInspirations?.images || []), ...newImages]
          }
        };
        setForm(updatedForm);
        saveDraft(updatedForm);
      }
    } catch (err) {
      console.error('Error uploading Category A media:', err);
    }
    setUploadingA(false);
  };

  // Upload handler for Category B (Ready Brand Assets / PDFs / Logos)
  const handleUploadCategoryB = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingB(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const res = await api.post('/uploads/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        const uploaded = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        const newFiles = uploaded.map(item => ({ 
          url: item.url, 
          filename: item.originalName || item.filename,
          fileType: item.fileType || 'file'
        }));
        const updatedForm = {
          ...form,
          brandAssets: {
            ...form.brandAssets,
            files: [...(form.brandAssets?.files || []), ...newFiles]
          }
        };
        setForm(updatedForm);
        saveDraft(updatedForm);
      }
    } catch (err) {
      console.error('Error uploading Category B assets:', err);
    }
    setUploadingB(false);
  };

  const removeCategoryAImage = (index) => {
    const updatedImages = [...(form.designInspirations?.images || [])];
    updatedImages.splice(index, 1);
    const updatedForm = {
      ...form,
      designInspirations: { ...form.designInspirations, images: updatedImages }
    };
    setForm(updatedForm);
    saveDraft(updatedForm);
  };

  const removeCategoryBFile = (index) => {
    const updatedFiles = [...(form.brandAssets?.files || [])];
    updatedFiles.splice(index, 1);
    const updatedForm = {
      ...form,
      brandAssets: { ...form.brandAssets, files: updatedFiles }
    };
    setForm(updatedForm);
    saveDraft(updatedForm);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/applications', { ...form, clientType });
      if (res.status === 200 || res.status === 201) {
        setStatus('success');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
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
      const next = currentStep + 1;
      setCurrentStep(next);
      saveDraft(form, clientType, next);
      scrollToForm();
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      saveDraft(form, clientType, prev);
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
        return true;
      default:
        return true;
    }
  };

  // Helper tooltip toggle
  const renderTooltip = (key, text) => {
    const isVisible = activeTooltip === key;
    return (
      <span className="relative inline-block ml-1.5 align-middle">
        <button
          type="button"
          onClick={() => setActiveTooltip(isVisible ? null : key)}
          onMouseEnter={() => setActiveTooltip(key)}
          onMouseLeave={() => setActiveTooltip(null)}
          className="text-primary/70 hover:text-primary transition-colors focus:outline-none"
          title="Click or hover for guidance"
        >
          <FaQuestionCircle className="text-xs" />
        </button>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-heading text-white text-xs rounded-xl shadow-xl z-50 pointer-events-none"
          >
            <p className="leading-snug">{text}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-heading" />
          </motion.div>
        )}
      </span>
    );
  };

  if (status === 'success') {
    return (
      <div className="py-12 md:py-20 flex justify-center px-4 bg-cream min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 md:p-10 border border-border-light shadow-xl max-w-lg text-center w-full">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-heading text-3xl font-bold mb-3">Requirements Intake Submitted!</h2>
          <p className="text-body mb-6 leading-relaxed">
            Thank you for choosing Dominion Softwares Ltd. Our engineering team will review your 
            Software Requirements Specification (SRS) brief and contact you within <span className="font-semibold text-primary">24–48 hours</span>.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 text-left">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">📋 Your Client Portal Access</p>
            <p className="text-sm text-body mb-3 text-center">
              Sign in anytime to track your SRS analysis, review milestones, and give feedback.
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

  const inputClass = "w-full px-4 py-3.5 bg-cream border border-border-light rounded-xl text-heading placeholder-body-light/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm";
  const selectClass = "w-full px-4 py-3.5 bg-cream border border-border-light rounded-xl text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer text-sm";
  const radioClass = "w-5 h-5 text-primary border-border-light focus:ring-2 focus:ring-primary/20 cursor-pointer accent-primary";
  const checkboxClass = "w-4 h-4 text-primary border-border-light rounded focus:ring-2 focus:ring-primary/20 cursor-pointer accent-primary";

  return (
    <div>
      {/* Hero Header */}
      <section className="pt-8 md:pt-12 pb-6 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-cream to-cream-dark/30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" 
          animate="visible" 
          variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest mb-2 font-semibold">
            <FaRocket /> Requirements Intake & Application Wizard
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-heading text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 mb-3 leading-tight">
            Let's Build Something <span className="text-primary">Heavenly Inspired</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Formulate your Software Requirements Specification (SRS) step-by-step. We guide you through 
            features, design inspirations, and technical constraints for your ministry or enterprise.
          </motion.p>

          {/* Draft indicator */}
          {draftSavedTime && (
            <motion.div variants={fadeInUp} className="mt-4 inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-xs text-orange-800 font-medium">
              <span className="flex items-center gap-1.5">
                <FaSave className="text-primary" /> Draft Auto-Saved ({draftSavedTime})
              </span>
              <button 
                type="button" 
                onClick={clearDraft} 
                className="text-orange-900 underline hover:text-primary transition-colors text-[11px]"
              >
                Reset Form
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Progress Bar Header */}
      <section className="bg-white border-b border-border-light py-3 sticky top-0 z-30 shadow-xs">
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
              {renderStepContent(
                currentStep, 
                form, 
                handleChange, 
                clientType, 
                setClientType, 
                inputClass, 
                selectClass, 
                radioClass, 
                checkboxClass,
                handleUploadCategoryA,
                uploadingA,
                removeCategoryAImage,
                handleUploadCategoryB,
                uploadingB,
                removeCategoryBFile,
                renderTooltip
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-border-light">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn-outline flex items-center gap-2 text-sm ${
                    currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <FaArrowLeft className="text-xs" /> Previous
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || loading}
                  className={`btn-primary flex items-center gap-2 text-sm ${
                    !canProceed() || loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting SRS...
                    </>
                  ) : currentStep === STEPS.length ? (
                    <>
                      <FaPaperPlane /> Submit Application
                    </>
                  ) : (
                    <>
                      Next Step <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center font-medium mt-4 text-sm">
                  Something went wrong submitting your application. Please verify internet connection and try again.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// Step content renderer
function renderStepContent(
  step, 
  form, 
  handleChange, 
  clientType, 
  setClientType, 
  inputClass, 
  selectClass, 
  radioClass, 
  checkboxClass,
  handleUploadCategoryA,
  uploadingA,
  removeCategoryAImage,
  handleUploadCategoryB,
  uploadingB,
  removeCategoryBFile,
  renderTooltip
) {
  switch (step) {
    case 1:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">What type of organization are you?</h2>
          <p className="text-sm text-body mb-5">This dynamically tailors our Kingdom vs Commercial feature options for your intake.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setClientType('ministry');
                handleChange({ target: { name: 'organizationType', value: '' }});
              }}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg relative overflow-hidden ${
                clientType === 'ministry'
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border-light hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FaChurch className="text-3xl text-primary" />
                {clientType === 'ministry' && <FaCheckCircle className="text-primary text-lg" />}
              </div>
              <h3 className="font-bold text-base text-heading mb-1">Church / Ministry</h3>
              <p className="text-xs text-body leading-relaxed">
                Local churches, multi-branch fellowships, parachurch NGOs {renderTooltip('parachurch', TOOLTIPS.parachurch)}, youth ministries & evangelistic outreaches.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setClientType('business');
                handleChange({ target: { name: 'organizationType', value: '' }});
              }}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg relative overflow-hidden ${
                clientType === 'business'
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border-light hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FaBriefcase className="text-3xl text-primary" />
                {clientType === 'business' && <FaCheckCircle className="text-primary text-lg" />}
              </div>
              <h3 className="font-bold text-base text-heading mb-1">Business / Organization</h3>
              <p className="text-xs text-body leading-relaxed">
                Commercial enterprises, schools, healthcare clinics, hotels, retail stores, professional & financial services.
              </p>
            </button>
          </div>

          {clientType && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2 border-t border-border-light">
              <label className="block text-sm font-semibold text-heading mb-2">
                {clientType === 'ministry' ? 'Select your ministry structure:' : 'Select your industry sector:'}
              </label>
              
              {clientType === 'ministry' ? (
                <div className="space-y-2.5">
                  {[
                    { value: 'Local Church / Single Congregation', label: 'Local Church / Single Congregation' },
                    { value: 'Multi-Branch Ministry / Fellowship', label: 'Multi-Branch Ministry / Fellowship' },
                    { value: 'Parachurch Organization', label: 'Parachurch Organization (Evangelistic, youth, choir groups)' },
                    { value: 'Faith-Based NGO / Outreach', label: 'Community Outreach / Faith-Based NGO' },
                    { value: 'Other', label: 'Other' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-cream transition-colors border border-transparent hover:border-border-light">
                      <input
                        type="radio"
                        name="organizationType"
                        value={option.value}
                        checked={form.organizationType === option.value}
                        onChange={handleChange}
                        className={radioClass}
                      />
                      <span className="text-sm text-heading font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { value: 'Hospitality & Tourism', label: 'Hospitality & Tourism (Resorts, Hotels, Restaurants)' },
                    { value: 'Healthcare & Medical', label: 'Healthcare & Medical Services (Hospitals, Clinics, Pharmacies)' },
                    { value: 'Retail & E-commerce', label: 'Retail & E-commerce (Online store or physical retail chain)' },
                    { value: 'Professional Services', label: 'Professional Services (Law, Consulting, Real Estate, Finance)' },
                    { value: 'Education & Training', label: 'Education & Non-Profit (Schools, Training institutes)' },
                    { value: 'Creative & Media', label: 'Creative & Media (Production studios, Digital agency)' },
                    { value: 'Other', label: 'Other' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-cream transition-colors border border-transparent hover:border-border-light">
                      <input
                        type="radio"
                        name="organizationType"
                        value={option.value}
                        checked={form.organizationType === option.value}
                        onChange={handleChange}
                        className={radioClass}
                      />
                      <span className="text-sm text-heading font-medium">{option.label}</span>
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
          <p className="text-sm text-body mb-5">Basic information to create your SRS profile and client portal.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">
                {clientType === 'ministry' ? 'Ministry / Church Name *' : 'Business / Organization Name *'}
              </label>
              <input
                type="text"
                name="organizationName"
                value={form.organizationName}
                onChange={handleChange}
                placeholder={clientType === 'ministry' ? 'e.g., Grace Community Church International' : 'e.g., Dominion Global Enterprises Ltd'}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">
                Primary Target Audience / End Users *
              </label>
              <input
                type="text"
                name="targetAudience"
                value={form.targetAudience}
                onChange={handleChange}
                placeholder={
                  clientType === 'ministry' 
                    ? 'e.g., 500+ Local church members, youth fellowship, online live stream partners'
                    : 'e.g., B2B enterprise clients, online shoppers, hotel guests, hospital staff'
                }
                className={inputClass}
                required
              />
              <p className="text-xs text-body-light mt-1">Helps our UX engineers design the right interfaces for your end users.</p>
            </div>

            <div className="border-t border-border-light pt-5 mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Key Contact Person</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-body mb-1">Full Name *</label>
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
                  <label className="block text-xs font-semibold text-body mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className={`${inputClass} ${form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    required
                  />
                  {form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                    <p className="text-xs text-red-500 mt-1">Enter a valid email address.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body mb-1">Phone Number *</label>
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
      const featureOptions = clientType === 'ministry' ? KINGDOM_FEATURES : COMMERCIAL_FEATURES;
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Project Requirements & Design Scope</h2>
          <p className="text-sm text-body mb-5">Select core features and provide visual design inspiration.</p>

          <div className="space-y-6">
            {/* Dynamic Kingdom vs Commercial Feature Checkboxes */}
            <div className="bg-cream/50 p-4 rounded-xl border border-border-light">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center justify-between">
                <span>{clientType === 'ministry' ? 'Kingdom & Ministry Features' : 'Commercial & Business Features'}</span>
                <span className="text-[11px] font-normal text-body-light">Select all that apply</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {featureOptions.map((feat) => {
                  const isChecked = (form.selectedFeatures || []).includes(feat.label);
                  return (
                    <label 
                      key={feat.id} 
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked 
                          ? 'border-primary bg-primary/5 shadow-2xs' 
                          : 'border-border-light bg-white hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="selectedFeatures"
                        value={feat.label}
                        checked={isChecked}
                        onChange={handleChange}
                        className={`${checkboxClass} mt-0.5`}
                      />
                      <div>
                        <span className="text-sm font-semibold text-heading block leading-snug">{feat.label}</span>
                        <span className="text-xs text-body-light leading-snug block mt-0.5">{feat.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">
                Detailed Project Description *
              </label>
              <textarea
                name="projectDescription"
                value={form.projectDescription}
                onChange={handleChange}
                rows="3"
                placeholder={
                  clientType === 'ministry'
                    ? 'e.g., We need a complete member management system, online sermon archives, live streaming gateway, and M-Pesa tithes integration...'
                    : 'e.g., We need an online store with real-time stock sync, STK push payment checkout, customer account portal and automated invoice generation...'
                }
                className={`${inputClass} resize-none`}
                required
              />
              <p className="text-xs text-body-light mt-1">Be specific about key user journeys and workflows.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">
                Primary Goal / Key Outcome *
              </label>
              <input
                type="text"
                name="primaryGoal"
                value={form.primaryGoal}
                onChange={handleChange}
                placeholder={
                  clientType === 'ministry'
                    ? 'e.g., Automate tithe recording and expand global outreach through online sermon media'
                    : 'e.g., Boost online direct sales by 60% and reduce manual inventory work'
                }
                className={inputClass}
                required
              />
            </div>

            {/* Content Management Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-2">
                Content Management Preference
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${form.contentManagement === 'static' ? 'border-primary bg-primary/5' : 'border-border-light hover:bg-cream'}`}>
                  <input
                    type="radio"
                    name="contentManagement"
                    value="static"
                    checked={form.contentManagement === 'static'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-semibold text-heading block">Static Content</span>
                    <span className="text-xs text-body-light">Standard informative page; infrequent updates managed by engineering team.</span>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${form.contentManagement === 'dynamic' ? 'border-primary bg-primary/5' : 'border-border-light hover:bg-cream'}`}>
                  <input
                    type="radio"
                    name="contentManagement"
                    value="dynamic"
                    checked={form.contentManagement === 'dynamic'}
                    onChange={handleChange}
                    className={radioClass}
                  />
                  <div>
                    <span className="text-sm font-semibold text-heading block">Dynamic Content (CMS Admin Dashboard)</span>
                    <span className="text-xs text-body-light">Self-serve dashboard to update sermons, products, blog posts, and notices without writing code.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* CATEGORY A: DESIGN SCOPE MATERIALS */}
            <div className="border-t border-border-light pt-5 mt-5">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-heading">Category A: Design & Layout Inspirations (Scope Discovery)</h3>
                {renderTooltip('scopeMaterials', 'Upload wireframes, design mockups, or screenshots of websites/apps you admire to guide UI style.')}
              </div>
              <p className="text-xs text-body-light mb-3">Optional sketches, wireframe screenshots, or vision recordings to communicate your visual preferences.</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Image Dropzone */}
                <div className="border-2 border-dashed border-border-light rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-cream/30">
                  <FaCloudUploadAlt className="text-3xl text-primary/70 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-heading mb-1">Upload UI Mockups / Sketches</p>
                  <p className="text-[11px] text-body-light mb-3">PNG, JPG, WEBP (Max 10MB per file)</p>
                  <input
                    type="file"
                    id="catAInput"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUploadCategoryA(e.target.files)}
                  />
                  <label
                    htmlFor="catAInput"
                    className="btn-outline inline-flex items-center gap-2 py-1.5 px-3 text-xs cursor-pointer"
                  >
                    {uploadingA ? 'Uploading...' : 'Choose Files'}
                  </label>

                  {/* Uploaded thumbnails list */}
                  {form.designInspirations?.images?.length > 0 && (
                    <div className="mt-3 space-y-1.5 text-left">
                      {form.designInspirations.images.map((img, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-border-light text-xs">
                          <span className="truncate max-w-[170px] text-heading flex items-center gap-1.5">
                            <FaImage className="text-primary" /> {img.filename}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCategoryAImage(idx)}
                            className="text-red-400 hover:text-red-600 ml-2"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Vision URL */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-border-light flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-heading mb-1 flex items-center gap-1.5">
                      <FaVideo className="text-primary" /> Vision / Workflow Video Link (Optional)
                    </label>
                    <p className="text-xs text-body-light mb-2">Provide Loom, YouTube, or Google Drive link explaining your product vision or existing manual process.</p>
                    <input
                      type="url"
                      name="designInspirations.videoUrl"
                      value={form.designInspirations?.videoUrl || ''}
                      onChange={handleChange}
                      placeholder="https://www.loom.com/share/..."
                      className={inputClass}
                    />
                  </div>
                  {form.designInspirations?.videoUrl && (
                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                      <FaCheckCircle /> Video link attached
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 4:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Technical Details & Production Assets</h2>
          <p className="text-sm text-body mb-5">Define authentication, payment integrations, NFRs, and brand assets.</p>

          <div className="space-y-6">
            {/* User Accounts & Authentication */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-2">
                User Authentication & Role Requirements
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { value: 'no', label: 'No Accounts Needed', desc: 'Public static access for everyone' },
                  { value: 'members', label: 'Client / User Accounts', desc: 'Members/Customers log in' },
                  { value: 'both', label: 'Full RBAC Access', desc: 'Members + Leadership/Admin roles' },
                ].map((opt) => (
                  <label 
                    key={opt.value} 
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      form.needAccounts === opt.value 
                        ? 'border-primary bg-primary/5 font-semibold' 
                        : 'border-border-light hover:bg-cream'
                    }`}
                  >
                    <input
                      type="radio"
                      name="needAccounts"
                      value={opt.value}
                      checked={form.needAccounts === opt.value}
                      onChange={handleChange}
                      className={radioClass}
                    />
                    <div className="mt-2">
                      <span className="text-xs font-bold text-heading block">{opt.label}</span>
                      <span className="text-[11px] text-body-light block font-normal">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Account Specific Checkboxes */}
            {(form.needAccounts === 'members' || form.needAccounts === 'both') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-cream/40 rounded-xl border border-border-light">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Select User Roles Required:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(clientType === 'ministry' 
                    ? ['Regular Members', 'Pastors / Leaders', 'Department Heads', 'Volunteers']
                    : ['Customers / Clients', 'Admin / Staff', 'Vendors / Partners', 'Field Officers']
                  ).map((role) => (
                    <label key={role} className="flex items-center gap-2 text-xs text-heading p-2 rounded-lg bg-white border border-border-light cursor-pointer">
                      <input
                        type="checkbox"
                        name="accountTypes"
                        value={role}
                        checked={(form.accountTypes || []).includes(role)}
                        onChange={handleChange}
                        className={checkboxClass}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Payment Integration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-2 flex items-center">
                <span>Payment & Gateway Requirements</span>
                {renderTooltip('stkPush', TOOLTIPS.stkPush)}
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { value: 'none', label: 'No Online Payments', desc: 'No transaction processing' },
                  { value: 'mobile', label: 'Mobile Money (M-Pesa STK Push)', desc: 'Instant PIN prompt to member phone' },
                  { value: 'global', label: 'Global (M-Pesa + Cards)', desc: 'Visa, Mastercard, PayPal & Mobile money' },
                ].map((pay) => (
                  <label 
                    key={pay.value}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentIntegration === pay.value 
                        ? 'border-primary bg-primary/5 font-semibold' 
                        : 'border-border-light hover:bg-cream'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentIntegration"
                      value={pay.value}
                      checked={form.paymentIntegration === pay.value}
                      onChange={handleChange}
                      className={radioClass}
                    />
                    <div className="mt-2">
                      <span className="text-xs font-bold text-heading block">{pay.label}</span>
                      <span className="text-[11px] text-body-light block font-normal">{pay.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* REQUIREMENTS ENGINEERING GUIDANCE (NFRs) */}
            <div className="border-t border-border-light pt-5 mt-5 bg-cream/30 p-4 rounded-2xl border">
              <div className="flex items-center gap-2 mb-1">
                <FaShieldAlt className="text-primary text-base" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-heading">
                  Requirements Engineering Guidance (NFRs)
                </h3>
                {renderTooltip('nfr', TOOLTIPS.nfr)}
              </div>
              <p className="text-xs text-body-light mb-4">Specify non-functional parameters so we engineer a resilient architecture.</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* User Capacity Micro-Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-body mb-1 flex items-center">
                    <FaUsers className="text-primary/80 mr-1.5 text-xs" /> Expected Weekly Active Members / Users
                  </label>
                  <select
                    name="nfr.expectedUserCapacity"
                    value={form.nfr?.expectedUserCapacity || ''}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="Under 1,000 active users">Under 1,000 active users</option>
                    <option value="1,000 - 5,000 active users">1,000 - 5,000 active users</option>
                    <option value="5,000 - 25,000 active users">5,000 - 25,000 active users</option>
                    <option value="25,000+ High Concurrency Enterprise">25,000+ High Concurrency Enterprise</option>
                  </select>
                </div>

                {/* Third Party Integrations Micro-Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-body mb-1 flex items-center">
                    <FaPlug className="text-primary/80 mr-1.5 text-xs" /> Preferred Third-Party Integrations
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['M-Pesa STK Push', 'Stripe / Cards', 'SMS Gateways (Africa\'s Talking / Twilio)', 'Google Workspace / Zoom'].map((integ) => (
                      <label key={integ} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-border-light cursor-pointer">
                        <input
                          type="checkbox"
                          name="nfrIntegrations"
                          value={integ}
                          checked={(form.nfr?.thirdPartyIntegrations || []).includes(integ)}
                          onChange={handleChange}
                          className={checkboxClass}
                        />
                        <span className="truncate">{integ}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Needs */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-body mb-1.5">
                  Security & Compliance Needs:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {['SSL/TLS Encryption', 'Role-Based Access Control (RBAC)', 'Audit Logging', 'Data Protection / GDPR'].map((sec) => (
                    <label key={sec} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-border-light cursor-pointer">
                      <input
                        type="checkbox"
                        name="nfrSecurity"
                        value={sec}
                        checked={(form.nfr?.securityRequirements || []).includes(sec)}
                        onChange={handleChange}
                        className={checkboxClass}
                      />
                      <span>{sec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* CATEGORY B: READY-TO-USE BRAND ASSETS */}
            <div className="border-t border-border-light pt-5 mt-5">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-heading">Category B: Ready-to-Use Brand Assets (Production Content)</h3>
                {renderTooltip('brandAssets', 'Official high-res logos, brand color guidelines, staff lists, or detailed project briefs.')}
              </div>
              <p className="text-xs text-body-light mb-3">Upload your official brand assets, PDF briefs, or share a cloud storage folder link.</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* File Dropzone for PDF/Logos */}
                <div className="border-2 border-dashed border-border-light rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-cream/30">
                  <FaFilePdf className="text-3xl text-primary/70 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-heading mb-1">Upload Logos & PDF Briefs</p>
                  <p className="text-[11px] text-body-light mb-3">PDF, PNG, JPG (Max 10MB per file)</p>
                  <input
                    type="file"
                    id="catBInput"
                    accept="application/pdf, image/png, image/jpeg"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUploadCategoryB(e.target.files)}
                  />
                  <label
                    htmlFor="catBInput"
                    className="btn-outline inline-flex items-center gap-2 py-1.5 px-3 text-xs cursor-pointer"
                  >
                    {uploadingB ? 'Uploading...' : 'Choose Files'}
                  </label>

                  {/* Uploaded assets list */}
                  {form.brandAssets?.files?.length > 0 && (
                    <div className="mt-3 space-y-1.5 text-left">
                      {form.brandAssets.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-border-light text-xs">
                          <span className="truncate max-w-[170px] text-heading flex items-center gap-1.5">
                            <FaFileAlt className="text-primary" /> {file.filename}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCategoryBFile(idx)}
                            className="text-red-400 hover:text-red-600 ml-2"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* External Media Cloud Storage Link */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-border-light flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-heading mb-1 flex items-center gap-1.5">
                      <FaLink className="text-primary" /> External Media Storage Folder (Optional)
                    </label>
                    <p className="text-xs text-body-light mb-2">Google Drive, OneDrive, or Dropbox folder link containing high-resolution video/image dumps.</p>
                    <input
                      type="url"
                      name="brandAssets.externalDriveUrl"
                      value={form.brandAssets?.externalDriveUrl || ''}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className={inputClass}
                    />
                  </div>
                  {form.brandAssets?.externalDriveUrl && (
                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                      <FaCheckCircle /> External folder link attached
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 5:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Budget & Delivery Timeline</h2>
          <p className="text-sm text-body mb-5">Help us structure the implementation plan and delivery milestones.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">Estimated Budget Range</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                <option value="">Select budget range...</option>
                <option value="Under KES 50,000">Under KES 50,000</option>
                <option value="KES 50,000 - 150,000">KES 50,000 - 150,000</option>
                <option value="KES 150,000 - 500,000">KES 150,000 - 500,000</option>
                <option value="KES 500,000 - 1,000,000">KES 500,000 - 1,000,000</option>
                <option value="Above KES 1,000,000">Above KES 1,000,000 (Enterprise Solution)</option>
                <option value="Flexible / Needs Consultation">Flexible / Needs Consultation</option>
              </select>
              <p className="text-xs text-body-light mt-1">Allows our team to tailor tech stack recommendation to your resource budget.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">Expected Delivery Timeline</label>
              <select name="timeline" value={form.timeline} onChange={handleChange} className={selectClass}>
                <option value="">Select target delivery timeline...</option>
                <option value="1 - 2 Weeks">1 - 2 Weeks (Rapid Prototype / Urgent)</option>
                <option value="1 - 3 Months">1 - 3 Months (Standard Production Cycle)</option>
                <option value="3 - 6 Months">3 - 6 Months (Complex Multi-Module Platform)</option>
                <option value="6+ Months">6+ Months (Full Enterprise Digital Transformation)</option>
                <option value="Ongoing Retainer">Ongoing Agile Retainer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-body-light mb-1.5">Additional Notes & Specific Constraints</label>
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                rows="4"
                placeholder="Include any additional information, deadline constraints, hosting preferences, or existing systems we need to integrate with..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </motion.div>
      );

    case 6:
      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-2">Review Your Software Requirements Brief</h2>
          <p className="text-sm text-body mb-5">Please verify all captured SRS parameters prior to final submission.</p>

          <div className="bg-white border border-border-light rounded-2xl p-5 md:p-6 mb-6 shadow-xs space-y-5">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-border-light gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 inline-block mb-1">
                  {clientType === 'ministry' ? 'Kingdom / Ministry' : 'Commercial / Business'} Intake
                </span>
                <h3 className="text-lg font-bold text-heading">{form.organizationName}</h3>
                <p className="text-xs text-body">{form.organizationType === 'Other' ? form.organizationTypeOther : form.organizationType}</p>
              </div>
              <div className="text-left sm:text-right text-xs text-body">
                <p className="font-semibold text-heading">{form.contactPerson}</p>
                <p>{form.email}</p>
                <p>{form.phone}</p>
              </div>
            </div>

            {/* Grid breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-heading uppercase tracking-wider text-[11px] text-body-light">Project Scope & Features</p>
                <p className="text-body"><strong className="text-heading">Primary Goal:</strong> {form.primaryGoal}</p>
                <p className="text-body"><strong className="text-heading">Target Audience:</strong> {form.targetAudience}</p>
                <p className="text-body"><strong className="text-heading">CMS Mode:</strong> {form.contentManagement === 'dynamic' ? 'Dynamic Admin Dashboard' : 'Static Page'}</p>
                <div>
                  <strong className="text-heading block mb-1">Selected Features:</strong>
                  {form.selectedFeatures?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-body">
                      {form.selectedFeatures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  ) : <span className="text-body-light">No specific feature checkboxes selected</span>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-heading uppercase tracking-wider text-[11px] text-body-light">Technical & NFR Specifications</p>
                <p className="text-body"><strong className="text-heading">Accounts Needed:</strong> {form.needAccounts}</p>
                <p className="text-body"><strong className="text-heading">Payment Gateway:</strong> {form.paymentIntegration}</p>
                <p className="text-body"><strong className="text-heading">Expected Capacity:</strong> {form.nfr?.expectedUserCapacity}</p>
                <p className="text-body"><strong className="text-heading">Security:</strong> {form.nfr?.securityRequirements?.join(', ') || 'Standard'}</p>
                <p className="text-body"><strong className="text-heading">Integrations:</strong> {form.nfr?.thirdPartyIntegrations?.join(', ') || 'None'}</p>
              </div>

              {/* Media Breakdown */}
              <div className="md:col-span-2 pt-3 border-t border-border-light grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-heading uppercase tracking-wider text-[11px] text-body-light mb-1">Category A: Scope Materials</p>
                  <p className="text-body">
                    Images: {form.designInspirations?.images?.length || 0} file(s) attached
                  </p>
                  {form.designInspirations?.videoUrl && (
                    <p className="text-body truncate">
                      <strong className="text-heading">Vision Video:</strong> <a href={form.designInspirations.videoUrl} target="_blank" rel="noreferrer" className="text-primary underline">{form.designInspirations.videoUrl}</a>
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-bold text-heading uppercase tracking-wider text-[11px] text-body-light mb-1">Category B: Production Brand Assets</p>
                  <p className="text-body">
                    Brand Files: {form.brandAssets?.files?.length || 0} file(s) attached
                  </p>
                  {form.brandAssets?.externalDriveUrl && (
                    <p className="text-body truncate">
                      <strong className="text-heading">Cloud Folder:</strong> <a href={form.brandAssets.externalDriveUrl} target="_blank" rel="noreferrer" className="text-primary underline">{form.brandAssets.externalDriveUrl}</a>
                    </p>
                  )}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="md:col-span-2 pt-3 border-t border-border-light flex flex-col sm:flex-row justify-between text-xs gap-2">
                <div>
                  <strong className="text-heading">Estimated Budget:</strong> {form.budget || 'Not specified'}
                </div>
                <div>
                  <strong className="text-heading">Expected Timeline:</strong> {form.timeline || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream-dark/30 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <FaCheckCircle className="text-primary text-lg shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-heading text-sm">Ready to submit your Software Requirements Brief?</h3>
              <p className="text-xs text-body leading-relaxed mt-0.5">
                Our lead engineers will compile this specification into a formal proposal and schedule an intake call within 24–48 hours.
              </p>
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
}