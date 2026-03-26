import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
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

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [submitting, setSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

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
          const { data } = await api.get(`/dashboard/events`);
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
              registrationFields: event.registrationFields || formData.registrationFields,
              ticketTypes: event.ticketTypes || formData.ticketTypes,
              ticketTemplate: event.ticketTemplate || formData.ticketTemplate,
            });
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
    if (index < 3) return; // Can't remove default fields
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

  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'tickets', label: 'Ticket Types' },
    { id: 'registration', label: 'Registration Fields' },
    { id: 'template', label: 'Ticket Card Design' },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border-light bg-cream/50 text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">{isEdit ? 'Edit Event' : 'Create Event'}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-border-light overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id ? 'bg-primary text-white' : 'text-body hover:bg-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-border-light p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Event Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="e.g. Grace Worship Night 2026" />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Describe your event..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Tags</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="worship, music, praise (comma separated)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Venue Name *</label>
                <input name="venue.name" value={formData.venue.name} onChange={handleChange} required className={inputClass} placeholder="KICC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Address *</label>
                <input name="venue.address" value={formData.venue.address} onChange={handleChange} required className={inputClass} placeholder="Harambee Ave" />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">City *</label>
                <input name="venue.city" value={formData.venue.city} onChange={handleChange} required className={inputClass} placeholder="Nairobi" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Start Date & Time *</label>
                <input type="datetime-local" name="date.start" value={formData.date.start} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">End Date & Time *</label>
                <input type="datetime-local" name="date.end" value={formData.date.end} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Doors Open</label>
                <input type="datetime-local" name="date.doorsOpen" value={formData.date.doorsOpen} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className={inputClass} />
            </div>
          </motion.div>
        )}

        {/* Ticket Types Tab */}
        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {formData.ticketTypes.map((tt, i) => (
              <div key={i} className="bg-white rounded-xl border border-border-light p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-heading">Ticket Type {i + 1}</h3>
                  {formData.ticketTypes.length > 1 && (
                    <button type="button" onClick={() => removeTicketType(i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Name *</label>
                    <input value={tt.name} onChange={(e) => updateTicketType(i, 'name', e.target.value)} required className={inputClass} placeholder="e.g. VIP, Regular, Early Bird" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Description</label>
                    <input value={tt.description} onChange={(e) => updateTicketType(i, 'description', e.target.value)} className={inputClass} placeholder="What's included" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Price (KES) *</label>
                    <input type="number" min="0" value={tt.price} onChange={(e) => updateTicketType(i, 'price', e.target.value)} required className={inputClass} placeholder="0 for free" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Quantity *</label>
                    <input type="number" min="1" value={tt.quantity} onChange={(e) => updateTicketType(i, 'quantity', e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Max Per Order</label>
                    <input type="number" min="1" value={tt.maxPerOrder} onChange={(e) => updateTicketType(i, 'maxPerOrder', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addTicketType} className="w-full py-3 rounded-xl border-2 border-dashed border-border-light text-body hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <FaPlus /> Add Ticket Type
            </button>
          </motion.div>
        )}

        {/* Registration Fields Tab */}
        {activeTab === 'registration' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-sm text-body mb-4">Define what information attendees must provide when purchasing tickets. The first 3 fields (Name, Email, Phone) are required by default.</p>
            {formData.registrationFields.map((field, i) => (
              <div key={i} className="bg-white rounded-xl border border-border-light p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-heading mb-1">Field Name</label>
                    <input
                      value={field.fieldName}
                      onChange={(e) => updateField(i, 'fieldName', e.target.value)}
                      disabled={i < 3}
                      className={`${inputClass} ${i < 3 ? 'opacity-60' : ''}`}
                      placeholder="e.g. ID Number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-heading mb-1">Type</label>
                    <select
                      value={field.fieldType}
                      onChange={(e) => updateField(i, 'fieldType', e.target.value)}
                      disabled={i < 3}
                      className={`${inputClass} ${i < 3 ? 'opacity-60' : ''}`}
                    >
                      {fieldTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(i, 'required', e.target.checked)}
                        disabled={i < 3}
                        className="rounded text-primary"
                      />
                      Required
                    </label>
                  </div>
                  <div className="flex items-center justify-end">
                    {i >= 3 && (
                      <button type="button" onClick={() => removeField(i)} className="text-red-400 hover:text-red-600 cursor-pointer p-2">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                {field.fieldType === 'select' && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-heading mb-1">Options (comma separated)</label>
                    <input
                      value={(field.options || []).join(', ')}
                      onChange={(e) => updateField(i, 'options', e.target.value.split(',').map(o => o.trim()).filter(Boolean))}
                      className={inputClass}
                      placeholder="Student, Professional, Other"
                    />
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addField} className="w-full py-3 rounded-xl border-2 border-dashed border-border-light text-body hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <FaPlus /> Add Custom Field
            </button>
          </motion.div>
        )}

        {/* Ticket Template Tab */}
        {activeTab === 'template' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-border-light p-6 space-y-5">
            <p className="text-sm text-body mb-2">Customize how the PDF ticket card looks for attendees.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Header Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.ticketTemplate.headerColor}
                    onChange={(e) => updateTemplate('headerColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-border-light cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.ticketTemplate.headerColor}
                    onChange={(e) => updateTemplate('headerColor', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Custom Message</label>
                <input
                  value={formData.ticketTemplate.customMessage}
                  onChange={(e) => updateTemplate('customMessage', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Present this ticket at Gate A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Fields to Show on Ticket Card</label>
              <p className="text-xs text-body-light mb-3">Select which registration fields appear on the printed ticket</p>
              <div className="flex flex-wrap gap-2">
                {formData.registrationFields.map((field) => (
                  <button
                    key={field.fieldName}
                    type="button"
                    onClick={() => toggleShowField(field.fieldName)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      (formData.ticketTemplate.showFields || []).includes(field.fieldName)
                        ? 'bg-primary text-white'
                        : 'bg-cream text-body border border-border-light hover:border-primary'
                    }`}
                  >
                    {field.fieldName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                <input type="checkbox" checked={formData.ticketTemplate.requirePhoto} onChange={(e) => updateTemplate('requirePhoto', e.target.checked)} className="rounded text-primary" />
                Require attendee photo
              </label>
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                <input type="checkbox" checked={formData.ticketTemplate.showVenue} onChange={(e) => updateTemplate('showVenue', e.target.checked)} className="rounded text-primary" />
                Show venue
              </label>
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                <input type="checkbox" checked={formData.ticketTemplate.showDate} onChange={(e) => updateTemplate('showDate', e.target.checked)} className="rounded text-primary" />
                Show date
              </label>
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                <input type="checkbox" checked={formData.ticketTemplate.showPrice} onChange={(e) => updateTemplate('showPrice', e.target.checked)} className="rounded text-primary" />
                Show price
              </label>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/events')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
