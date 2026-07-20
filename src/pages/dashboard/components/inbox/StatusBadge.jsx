import React from 'react';

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || 'pending').toLowerCase();
  
  let colorClasses = 'bg-orange-100 text-orange-700 border border-orange-200';
  
  if (normalizedStatus === 'approved') {
    colorClasses = 'bg-green-100 text-green-700 border border-green-200';
  } else if (normalizedStatus === 'feedback' || normalizedStatus === 'in review') {
    colorClasses = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  } else if (normalizedStatus === 'contacted') {
    colorClasses = 'bg-blue-100 text-blue-700 border border-blue-200';
  } else if (normalizedStatus === 'closed') {
    colorClasses = 'bg-gray-100 text-gray-700 border border-gray-200';
  } else if (normalizedStatus === 'rejected') {
    colorClasses = 'bg-red-100 text-red-700 border border-red-200';
  }

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${colorClasses}`}>
      {normalizedStatus}
    </span>
  );
}
