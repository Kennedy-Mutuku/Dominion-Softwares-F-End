import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EventRegistration() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: info, 2: form, 3: confirm

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/s/${slug}`);
        setEvent(data.data.event);
        setTicketTypes(data.data.ticketTypes || []);

        // Init default form fields
        const defaults = {};
        (data.data.event.registrationFields || []).forEach((f) => {
          defaults[f.fieldName] = '';
        });
        setFormData(defaults);
      } catch (error) {
        toast.error('Event not found');
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug, navigate]);

  const totalTickets = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalAmount = ticketTypes.reduce((sum, tt) => {
    return sum + (selections[tt._id] || 0) * tt.price;
  }, 0);

  const updateSelection = (typeId, delta, max) => {
    setSelections((prev) => {
      const current = prev[typeId] || 0;
      const next = Math.max(0, Math.min(current + delta, max));
      return { ...prev, [typeId]: next };
    });
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    // Validate required fields
    const requiredFields = (event.registrationFields || []).filter((f) => f.required);
    for (const field of requiredFields) {
      if (!formData[field.fieldName]?.trim()) {
        toast.error(`${field.fieldName} is required`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const items = Object.entries(selections)
        .filter(([, qty]) => qty > 0)
        .map(([typeId, quantity]) => {
          const tt = ticketTypes.find((t) => t._id === typeId);
          return { ticketTypeId: typeId, typeName: tt.name, price: tt.price, quantity };
        });

      const orderData = {
        eventId: event._id,
        items,
        attendeeDetails: formData,
      };

      if (photoFile) {
        const photoData = new FormData();
        photoData.append('photo', photoFile);
        const { data: uploadData } = await api.post('/uploads/photo', photoData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        orderData.attendeePhoto = uploadData.data?.url;
      }

      const { data } = await api.post('/orders', orderData);
      toast.success('Tickets purchased successfully!');
      navigate(`/orders/${data.data.order._id}/confirmation`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {event.images?.cover && (
            <div className="h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
              <img src={event.images.cover} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-heading mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-6 text-body mb-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              <span>{format(new Date(event.date.start), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-primary" />
              <span>{format(new Date(event.date.start), 'h:mm a')} - {format(new Date(event.date.end), 'h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <span>{event.venue?.name}, {event.venue?.city}</span>
            </div>
          </div>

          <p className="text-body leading-relaxed">{event.description}</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-primary text-white' : 'bg-white text-body border border-border-light'
              }`}>
                {s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-heading' : 'text-body-light'}`}>
                {s === 1 ? 'Select Tickets' : s === 2 ? 'Your Details' : 'Confirm'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-border-light'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Ticket Selection */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-heading mb-4">Select Tickets</h2>
            {ticketTypes.map((tt) => {
              const available = tt.quantity - tt.sold;
              return (
                <div key={tt._id} className="card flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading">{tt.name}</h3>
                    {tt.description && <p className="text-sm text-body mt-1">{tt.description}</p>}
                    <p className="text-primary font-bold mt-1">
                      {tt.price === 0 ? 'Free' : `KES ${tt.price.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-body-light mt-1">{available} remaining</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateSelection(tt._id, -1, available)}
                      disabled={!selections[tt._id]}
                      className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center
                                 hover:bg-cream disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-bold text-heading">{selections[tt._id] || 0}</span>
                    <button
                      onClick={() => updateSelection(tt._id, 1, Math.min(available, tt.maxPerOrder || 10))}
                      disabled={available === 0}
                      className="w-9 h-9 rounded-full border border-primary text-primary flex items-center justify-center
                                 hover:bg-primary hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}

            {totalTickets > 0 && (
              <div className="card bg-cream border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-body">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</p>
                    <p className="text-2xl font-bold text-heading">
                      {totalAmount === 0 ? 'Free' : `KES ${totalAmount.toLocaleString()}`}
                    </p>
                  </div>
                  <button onClick={() => setStep(2)} className="btn-primary">
                    Continue
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold text-heading mb-4">Your Details</h2>
            <div className="card space-y-4">
              {(event.registrationFields || [])
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((field) => (
                  <div key={field.fieldName}>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      {field.fieldName} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.fieldType === 'select' ? (
                      <select
                        value={formData[field.fieldName] || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/50 text-heading
                                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">Select...</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.fieldType === 'textarea' ? (
                      <textarea
                        value={formData[field.fieldName] || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        required={field.required}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/50 text-heading
                                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type={field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : 'text'}
                        value={formData[field.fieldName] || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/50 text-heading
                                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    )}
                  </div>
                ))}

              {/* Photo upload if required */}
              {event.ticketTemplate?.requirePhoto && (
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/50 text-heading"
                  />
                  <p className="text-xs text-body-light mt-1">Upload a clear photo for your ticket</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold text-heading mb-4">Confirm Your Order</h2>
            <div className="card space-y-4">
              <div>
                <h3 className="font-semibold text-heading mb-2">Event</h3>
                <p className="text-body">{event.title}</p>
                <p className="text-sm text-body-light">{format(new Date(event.date.start), 'EEEE, MMMM d, yyyy • h:mm a')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-heading mb-2">Tickets</h3>
                {Object.entries(selections).filter(([, qty]) => qty > 0).map(([typeId, qty]) => {
                  const tt = ticketTypes.find((t) => t._id === typeId);
                  return (
                    <div key={typeId} className="flex justify-between py-1">
                      <span className="text-body">{qty}x {tt.name}</span>
                      <span className="font-medium text-heading">
                        {tt.price === 0 ? 'Free' : `KES ${(tt.price * qty).toLocaleString()}`}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-3 mt-3 border-t border-border-light">
                  <span className="font-bold text-heading">Total</span>
                  <span className="font-bold text-primary text-xl">
                    {totalAmount === 0 ? 'Free' : `KES ${totalAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-heading mb-2">Your Details</h3>
                {Object.entries(formData).filter(([, v]) => v).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="text-body-light text-sm">{key}</span>
                    <span className="text-heading text-sm">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : totalAmount === 0 ? 'Get Free Tickets' : 'Complete Purchase'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
