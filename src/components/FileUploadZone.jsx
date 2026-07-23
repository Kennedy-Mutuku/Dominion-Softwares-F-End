import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileVideo, FaFileAudio, FaFileImage, FaFileAlt } from 'react-icons/fa';

export default function FileUploadZone({
  onFilesSelected,
  accept = '*/*',
  multiple = true,
  title = 'Drag & Drop files here',
  helpText = 'Upload images, videos, audio notes, or documents',
  maxSizeHint = 'Max 100MB per video/doc, Max 10MB per image',
  icon: Icon = FaCloudUploadAlt,
  allowedBadges = ['Video', 'Audio', 'Images', 'Documents']
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      onFilesSelected(fileList);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
      // Reset input value so same file can be re-selected if removed
      e.target.value = '';
    }
  };

  const badgeIcons = {
    Video: <FaFileVideo className="text-primary text-xs" />,
    Audio: <FaFileAudio className="text-orange-500 text-xs" />,
    Images: <FaFileImage className="text-amber-600 text-xs" />,
    Documents: <FaFileAlt className="text-orange-600 text-xs" />
  };

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
        isDragOver
          ? 'border-primary bg-primary/10 shadow-lg ring-4 ring-primary/20 scale-[1.01]'
          : 'border-orange-200 bg-cream/60 hover:border-primary/60 hover:bg-orange-50/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDragOver ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary'
        }`}>
          <Icon className="text-2xl" />
        </div>

        <div>
          <h4 className="text-base font-bold text-heading group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-xs text-body mt-1 max-w-md mx-auto leading-relaxed">
            {helpText}
          </p>
        </div>

        {allowedBadges && allowedBadges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {allowedBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-body-light border border-orange-100 shadow-2xs"
              >
                {badgeIcons[badge] || null}
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all shadow-sm flex items-center gap-1.5"
          >
            <FaCloudUploadAlt className="text-sm" /> Select Files
          </button>
          <span className="text-[11px] text-body-light">{maxSizeHint}</span>
        </div>
      </div>
    </motion.div>
  );
}
