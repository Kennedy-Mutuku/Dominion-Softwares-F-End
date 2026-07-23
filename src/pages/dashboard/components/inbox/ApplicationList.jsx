import React from 'react';
import { FaInbox, FaSpinner } from 'react-icons/fa';
import ApplicationCard from './ApplicationCard';

export default function ApplicationList({ loading, activeTab, list, selectedItem, setSelectedItem }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-5 bg-white border border-border-light rounded-xl flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-body-light bg-white rounded-xl border border-dashed border-border-light text-center px-4">
        <FaInbox className="text-5xl mb-4 opacity-20" />
        <p className="text-heading font-medium mb-1">No applications found</p>
        <p className="text-sm">Try adjusting your filters or wait for new submissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((item) => (
        <ApplicationCard
          key={item._id}
          item={item}
          activeTab={activeTab}
          isSelected={selectedItem?._id === item._id}
          onClick={() => setSelectedItem(item)}
        />
      ))}
    </div>
  );
}
