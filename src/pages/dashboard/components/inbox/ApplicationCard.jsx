import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from './StatusBadge';

export default function ApplicationCard({ item, activeTab, isSelected, onClick }) {
  const isApplication = activeTab === 'applications' || (item.projectDescription && activeTab === 'archived');
  const title = isApplication ? item.organizationName : item.name;
  const description = isApplication ? item.projectDescription : item.message;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
        isSelected 
          ? 'bg-orange-50/50 border-orange-500 shadow-sm border-l-4' 
          : 'bg-white border-border-light hover:border-orange-500/50 shadow-sm'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        isSelected ? 'bg-orange-100 text-orange-600' : 'bg-cream text-primary'
      }`}>
        {isApplication ? <FaBriefcase /> : <FaEnvelope />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <h4 className="font-semibold text-heading truncate">{title}</h4>
            {isApplication ? (
              <StatusBadge status={item.status} />
            ) : item.subject ? (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-800 rounded shrink-0">
                {item.subject}
              </span>
            ) : null}
          </div>
          <span className="text-xs text-body-light whitespace-nowrap shrink-0">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-body truncate mb-2">
          {description}
        </p>
        
        <div className="flex gap-3 text-xs text-body-light">
          <span className="truncate">{item.email}</span>
        </div>
      </div>
    </motion.div>
  );
}
