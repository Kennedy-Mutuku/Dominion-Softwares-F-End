import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaCheckCircle, FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../../utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // We hit the admin endpoint to see ALL reviews (active and deleted)
      const res = await api.get('/reviews/admin');
      setReviews(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review? It will be removed from the public website.')) return;
    
    try {
      setError('');
      setActionSuccess('');
      await api.delete(`/reviews/${id}`);
      setActionSuccess('Review successfully deleted from the public website.');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading">Client Reviews</h1>
        <p className="text-body-light mt-1">Manage and curate public testimonials</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-green-50 text-green-700 flex items-center gap-2 rounded-xl border border-green-100 font-medium">
          <FaCheckCircle /> {actionSuccess}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <FaQuoteLeft className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-heading mb-2">No Reviews Yet</h3>
          <p className="text-body-light">When clients submit reviews from the contact page, they will appear here.</p>
        </div>
      ) : (
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          {reviews.map((review) => (
            <motion.div 
              key={review._id} 
              variants={fadeInUp}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${
                review.status === 'deleted' 
                  ? 'border-red-100 opacity-60' 
                  : 'border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-heading leading-tight">{review.name}</h3>
                    <p className="text-primary text-sm font-medium">{review.org}</p>
                    <p className="text-xs text-body-light">{review.email}</p>
                  </div>
                </div>
                
                {review.status === 'active' ? (
                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                ) : (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
                    Deleted
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-sm ${i < review.rating ? 'text-[#FF8C00]' : 'text-gray-200'}`} 
                  />
                ))}
              </div>

              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50 relative">
                <FaQuoteLeft className="absolute top-4 left-4 text-gray-200 text-2xl opacity-50" />
                <p className="text-body text-sm leading-relaxed relative z-10 pl-8">
                  {review.text}
                </p>
              </div>
              
              <div className="mt-4 text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                Submitted on {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
