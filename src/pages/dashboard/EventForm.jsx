import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaPlus, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt,
  FaClipboardList, FaPaintBrush, FaInfoCircle, FaCheck, FaTimes
} from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = [
  { value: 'conference', label: 'Conference' },
  { value: 'concert', label: 'Concert' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'church-event', label: 'Church Event' },
  { value: 'sports', label: 'Sports' },
  { value: 'charity', label: 'Charity' },
  { value: 'festival', label: 'Festival' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'textarea', label: 'Text Area' },
];

function SectionHeader({ icon: Icon, number, title, subtitle }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-md">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-bold text-heading flex items-center gap-2">
          <Icon className="text-primary text-base" /> {title}
        </h2>
        <p className="text-xs text-body-light mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [submitting, setSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'conference',
    venue: { name: '', address: '', city: '' },
    date: { start: '', end: '', doorsOpen: '' },
    tags: '',
    registrationFields: [
      { fieldName: 'Full Name', fieldType: 'text', required: true, order: 0, options: [] },
      { fieldName: 'Email', fieldType: 'email', required: true, order: 1, options: [] },
      { fieldName: 'Phone', fieldType: 'phone', required: true, order: 2, options: [] },
    ],
    ticketTypes: [
      { name: 'Regular', description: '', price: 0, quantity: 100, maxPerOrder: 10 },
    ],
    ticketTemplate: {
      headerColor: '#E8820C',
      showFields: [],
      requirePhoto: false,
      customMessage: '',
      showVenue: true,
      showDate: true,
      showPrice: true,
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const { data } = await api.get('/dashboard/events');
          const event = data.data.find(e => e._id === id);
          if (event) {
            setFormData({
              title: event.title,
              description: event.description,
              category: event.category,
              venue: event.venue || { name: '', address: '', city: '' },
              date: {
                start: event.date?.start ? new Date(event.date.start).toISOString().slice(0, 16) : '',
                end: event.date?.end ? new Date(event.date.end).toISOString().slice(0, 16) : '',
                doorsOpen: event.date?.doorsOpen ? new Date(event.date.doorsOpen).toISOString().slice(0, 16) : '',
              },
              tags: (event.tags || []).join(', '),
              registrationFields: event.registrationFields?.length > 0 ? event.registrationFields : formData.registrationFields,
              ticketTypes: event.ticketTypes?.length > 0 ? event.ticketTypes : formData.ticketTypes,
              ticketTemplate: { ...formData.ticketTemplate, ...event.ticketTemplate },
            });
            if (event.images?.cover) setCoverPreview(event.images.cover);
          }
        } catch (error) {
          toast.error('Failed to load event');
          navigate('/dashboard/events');
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Registration field handlers
  const addField = () => {
    setFormData(prev => ({
      ...prev,
      registrationFields: [...prev.registrationFields, {
        fieldName: '', fieldType: 'text', required: false, order: prev.registrationFields.length, options: [],
      }],
    }));
  };

  const updateField = (index, key, value) => {
    setFormData(prev => {
      const fields = [...prev.registrationFields];
      fields[index] = { ...fields[index], [key]: value };
      return { ...prev, registrationFields: fields };
    });
  };

  const removeField = (index) => {
    if (index < 3) return;
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.filter((_, i) => i !== index),
    }));
  };

  // Ticket type handlers
  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', description: '', price: 0, quantity: 50, maxPerOrder: 10 }],
    }));
  };

  const updateTicketType = (index, key, value) => {
    setFormData(prev => {
      const types = [...prev.ticketTypes];
      types[index] = { ...types[index], [key]: key === 'price' || key === 'quantity' || key === 'maxPerOrder' ? Number(value) : value };
      return { ...prev, ticketTypes: types };
    });
  };

  const removeTicketType = (index) => {
    if (formData.ticketTypes.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  // Template handlers
  const updateTemplate = (key, value) => {
    setFormData(prev => ({
      ...prev,
      ticketTemplate: { ...prev.ticketTemplate, [key]: value },
    }));
  };

  const toggleShowField = (fieldName) => {
    setFormData(prev => {
      const current = prev.ticketTemplate.showFields || [];
      const next = current.includes(fieldName)
        ? current.filter(f => f !== fieldName)
        : [...current, fieldName];
      return { ...prev, ticketTemplate: { ...prev.ticketTemplate, showFields: next } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) { toast.error('Event title is required'); return; }
    if (!formData.description.trim()) { toast.error('Description is required'); return; }
    if (!formData.venue.name.trim()) { toast.error('Venue name is required'); return; }
    if (!formData.venue.address.trim()) { toast.error('Venue address is required'); return; }
    if (!formData.venue.city.trim()) { toast.error('City is required'); return; }
    if (!formData.date.start) { toast.error('Start date is required'); return; }
    if (!formData.date.end) { toast.error('End date is required'); return; }
    for (const tt of formData.ticketTypes) {
      if (!tt.name.trim()) { toast.error('All ticket types must have a name'); return; }
      if (tt.quantity < 1) { toast.error('Ticket quantity must be at least 1'); return; }
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const fd = new FormData();
      fd.append('eventData', JSON.stringify(payload));
      if (coverFile) fd.append('cover', coverFile);

      if (isEdit) {
        await api.put(`/events/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Event updated!');
        navigate('/dashboard/events');
      } else {
        const { data } = await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const newEventId = data.data.event._id;
        const newSlug = data.data.event.slug;
        navigate(`/dashboard/events/${newEventId}/created`, { state: { slug: newSlug, title: formData.title } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border-light bg-cream/50 text-heading text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  const labelClass = "block text-sm font-semibold text-heading mb-1";

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
        <p className="text-sm text-body-light mt-1">
          {isEdit ? 'Update your event details below.' : 'Fill in all sections below to set up your event. All fields marked * are required.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: EVENT DETAILS
        ═══════════════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-border-light overflow-hidden"
        >
          <SectionHeader icon={FaInfoCircle} number="1" title="Event Details" subtitle="Basic information about your event" />

          <div className="px-4 pb-5 space-y-3">
            {/* Cover Image */}
            <div>
              <label className={labelClass}>Cover Image</label>
              <div className="relative">
                {coverPreview ? (
                  <div className="relative h-36 md:h-44 rounded-lg overflow-hidden mb-2">
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={handleCoverChange}
                  className="w-full text-sm text-body file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Event Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="e.g. Grace Worship Night 2026" />
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={`${inputClass} resize-none`} placeholder="Tell attendees what this event is about..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tags</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="music, worship" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: VENUE & DATE
        ═══════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <SectionHeader icon={FaMapMarkerAlt} number="2" title="Venue & Date" subtitle="Where and when is it happening?" />

            <div className="px-4 pb-5 space-y-3">
              <div>
                <label className={labelClass}>Venue Name *</label>
                <input name="venue.name" value={formData.venue.name} onChange={handleChange} required className={inputClass} placeholder="e.g. KICC Main Hall" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Address *</label>
                  <input name="venue.address" value={formData.venue.address} onChange={handleChange} required className={inputClass} placeholder="Harambee Ave" />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input name="venue.city" value={formData.venue.city} onChange={handleChange} required className={inputClass} placeholder="Nairobi" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Event Starts *</label>
                  <p className="text-xs text-body-light mb-1">Click to pick date and time</p>
                  <input type="datetime-local" name="date.start" value={formData.date.start} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Event Ends *</label>
                  <p className="text-xs text-body-light mb-1">When does the event finish?</p>
                  <input type="datetime-local" name="date.end" value={formData.date.end} onChange={handleChange} required className={inputClass} />
                </div>
              </div>

              <div className="sm:w-1/2">
                <label className={labelClass}>Gate Opening Time <span className="text-body-light font-normal">(optional)</span></label>
                <p className="text-xs text-body-light mb-1">What time should attendees arrive? This is shown on their ticket.</p>
                <input type="datetime-local" name="date.doorsOpen" value={formData.date.doorsOpen} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3: TICKET TYPES
        ═══════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={0.15}>
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <SectionHeader icon={FaTicketAlt} number="3" title="Ticket Types" subtitle="Set up pricing and capacity for each ticket tier" />

            <div className="px-4 pb-5 space-y-3">
              {formData.ticketTypes.map((tt, i) => (
                <div key={i} className="rounded-lg border border-border-light bg-cream/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Ticket {i + 1}</span>
                    {formData.ticketTypes.length > 1 && (
                      <button type="button" onClick={() => removeTicketType(i)} className="text-red-400 hover:text-red-600 cursor-pointer p-1">
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-heading mb-0.5">Name *</label>
                      <input value={tt.name} onChange={(e) => updateTicketType(i, 'name', e.target.value)} required className={inputClass} placeholder="VIP / Regular" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-heading mb-0.5">Price (KES) *</label>
                      <input type="number" min="0" value={tt.price} onChange={(e) => updateTicketType(i, 'price', e.target.value)} required className={inputClass} placeholder="0 = free" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-heading mb-0.5">Total Quantity *</label>
                      <input type="number" min="1" value={tt.quantity} onChange={(e) => updateTicketType(i, 'quantity', e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-heading mb-0.5">Max Per Order</label>
                      <input type="number" min="1" value={tt.maxPerOrder} onChange={(e) => updateTicketType(i, 'maxPerOrder', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-heading mb-0.5">Description</label>
                    <input value={tt.description} onChange={(e) => updateTicketType(i, 'description', e.target.value)} className={inputClass} placeholder="What's included with this ticket" />
                  </div>
                </div>
              ))}

              <button type="button" onClick={addTicketType}
                className="w-full py-2.5 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-semibold
                           hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <FaPlus className="text-xs" /> Add Another Ticket Type
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4: REGISTRATION FIELDS
        ═══════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <SectionHeader icon={FaClipboardList} number="4" title="Registration Fields" subtitle="What info should attendees provide when buying tickets?" />

            <div className="px-4 pb-5">
              <p className="text-xs text-body-light mb-3 bg-cream/50 rounded-lg px-3 py-2 border border-border-light">
                The first 3 fields (Name, Email, Phone) are always collected. Add custom fields below for anything extra you need.
              </p>

              <div className="space-y-2">
                {formData.registrationFields.map((field, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${i < 3 ? 'border-primary/20 bg-primary/3' : 'border-border-light bg-cream/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {i < 3 ? (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">Default</span>
                      ) : (
                        <span className="text-[10px] font-bold text-body-light bg-cream px-2 py-0.5 rounded uppercase">Custom</span>
                      )}
                      <span className="text-xs font-medium text-heading flex-1">{field.fieldName || 'New Field'}</span>
                      {i >= 3 && (
                        <button type="button" onClick={() => removeField(i)} className="text-red-400 hover:text-red-600 cursor-pointer p-1">
                          <FaTrash className="text-[10px]" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          value={field.fieldName}
                          onChange={(e) => updateField(i, 'fieldName', e.target.value)}
                          disabled={i < 3}
                          className={`${inputClass} ${i < 3 ? 'opacity-60 cursor-not-allowed' : ''}`}
                          placeholder="Field name"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={field.fieldType}
                          onChange={(e) => updateField(i, 'fieldType', e.target.value)}
                          disabled={i < 3}
                          className={`${inputClass} ${i < 3 ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          {fieldTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                        </select>
                        <label className="flex items-center gap-1 text-xs text-heading whitespace-nowrap cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(i, 'required', e.target.checked)}
                            disabled={i < 3}
                            className="rounded text-primary w-3.5 h-3.5"
                          />
                          Req
                        </label>
                      </div>
                    </div>

                    {field.fieldType === 'select' && i >= 3 && (
                      <div className="mt-2">
                        <input
                          value={(field.options || []).join(', ')}
                          onChange={(e) => updateField(i, 'options', e.target.value.split(',').map(o => o.trim()).filter(Boolean))}
                          className={inputClass}
                          placeholder="Options: Student, Professional, Other"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={addField}
                className="w-full mt-3 py-2.5 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm font-semibold
                           hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <FaPlus className="text-xs" /> Add Custom Field
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5: TICKET CARD DESIGN
        ═══════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={0.25}>
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <SectionHeader icon={FaPaintBrush} number="5" title="Ticket Card Design" subtitle="Customize how the PDF ticket looks for your attendees" />

            <div className="px-4 pb-5 space-y-4">
              {/* Color + Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.ticketTemplate.headerColor}
                      onChange={(e) => updateTemplate('headerColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border-light cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.ticketTemplate.headerColor}
                      onChange={(e) => updateTemplate('headerColor', e.target.value)}
                      className={inputClass}
                      placeholder="#E8820C"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Custom Message</label>
                  <input
                    value={formData.ticketTemplate.customMessage}
                    onChange={(e) => updateTemplate('customMessage', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Present at Gate A"
                  />
                </div>
              </div>

              {/* Fields to show on ticket */}
              <div>
                <label className={labelClass}>Fields to Show on Ticket</label>
                <p className="text-xs text-body-light mb-2">
                  Pick which attendee details appear on the printed ticket card.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {formData.registrationFields.map((field) => {
                    const isSelected = (formData.ticketTemplate.showFields || []).includes(field.fieldName);
                    return (
                      <button
                        key={field.fieldName}
                        type="button"
                        onClick={() => toggleShowField(field.fieldName)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-cream text-body border border-border-light hover:border-primary'
                        }`}
                      >
                        {isSelected ? <FaCheck className="text-[9px]" /> : null}
                        {field.fieldName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'requirePhoto', label: 'Require Photo' },
                  { key: 'showVenue', label: 'Show Venue' },
                  { key: 'showDate', label: 'Show Date' },
                  { key: 'showPrice', label: 'Show Price' },
                ].map(({ key, label }) => (
                  <label key={key}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      formData.ticketTemplate[key]
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border-light bg-cream/50 text-body'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.ticketTemplate[key]}
                      onChange={(e) => updateTemplate(key, e.target.checked)}
                      className="rounded text-primary w-3.5 h-3.5 shrink-0"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════
            SUBMIT BAR
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-0 bg-white/95 backdrop-blur-sm border border-border-light rounded-xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 z-20"
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard/events')}
            className="flex-1 sm:flex-initial btn-outline text-sm py-2.5 px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 btn-primary text-sm py-2.5 px-6 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}

function AnimatedSection({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.section>
  );
}
