import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrash, FaFileVideo, FaFileAudio, FaFileAlt, 
  FaFilePdf, FaEye, FaCheckCircle, FaExclamationCircle, FaFigma 
} from 'react-icons/fa';
import { formatBytes } from '../utils/uploadService';

export default function MediaPreviewGrid({
  files = [],
  onRemoveFile,
  compact = false,
  title = 'Attached Media & Files'
}) {
  if (!files || files.length === 0) return null;

  const renderPreviewThumbnail = (file) => {
    const isImage = file.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
    const isVideo = file.type?.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
    const isAudio = file.type?.startsWith('audio/') || /\.(mp3|wav|m4a)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || file.name?.endsWith('.pdf');
    const isFigma = file.name?.endsWith('.fig');

    if (isImage && (file.previewUrl || file.url)) {
      return (
        <div className="relative w-full h-full group/thumb overflow-hidden rounded-lg bg-black/5">
          <img
            src={file.previewUrl || file.url}
            alt={file.name}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          />
          <a
            href={file.previewUrl || file.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
          >
            <FaEye className="text-lg" />
          </a>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex flex-col items-center justify-center text-purple-200 p-2 rounded-lg relative overflow-hidden">
          {file.previewUrl ? (
            <video src={file.previewUrl} className="w-full h-full object-cover" muted />
          ) : (
            <FaFileVideo className="text-3xl text-purple-400" />
          )}
          <div className="absolute bottom-1 right-1 bg-black/60 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">
            VIDEO
          </div>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="w-full h-full bg-orange-100 text-orange-600 flex flex-col items-center justify-center p-2 rounded-lg">
          <FaFileAudio className="text-3xl text-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold mt-1 text-orange-700">AUDIO</span>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="w-full h-full bg-red-50 text-red-500 flex flex-col items-center justify-center p-2 rounded-lg">
          <FaFilePdf className="text-3xl text-red-500" />
          <span className="text-[10px] font-bold mt-1 text-red-700">PDF</span>
        </div>
      );
    }

    if (isFigma) {
      return (
        <div className="w-full h-full bg-purple-50 text-purple-600 flex flex-col items-center justify-center p-2 rounded-lg">
          <FaFigma className="text-3xl text-purple-500" />
          <span className="text-[10px] font-bold mt-1 text-purple-700">SKETCH</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-slate-100 text-slate-500 flex flex-col items-center justify-center p-2 rounded-lg">
        <FaFileAlt className="text-3xl text-slate-400" />
        <span className="text-[10px] font-bold mt-1 uppercase text-slate-600">
          {file.name.split('.').pop() || 'FILE'}
        </span>
      </div>
    );
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Explain Your Vision':
      case 'Vision Media':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Team & Leadership Headshots':
      case 'Team Photos':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Facility & Event Photos':
      case 'Facility Media':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Brand & Organizational Documents':
      case 'Brand Guidelines & Documents':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="mt-4">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-body-light flex items-center gap-2">
            <span>{title}</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-semibold">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          </h4>
        </div>
      )}

      <div className={compact ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"}>
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id || file.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white border border-border-light rounded-xl p-3 shadow-2xs hover:shadow-md transition-all flex ${
                compact ? 'items-center gap-3' : 'flex-col justify-between'
              }`}
            >
              {compact ? (
                // Compact row view for Step 6 summary
                <>
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                    {renderPreviewThumbnail(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-heading truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-body-light">{formatBytes(file.size)}</span>
                      {file.category && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getCategoryBadgeColor(file.category)}`}>
                          {file.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1.5 text-body-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </>
              ) : (
                // Detailed Grid Card View
                <>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border-light">
                      {renderPreviewThumbnail(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold text-heading truncate leading-tight" title={file.name}>
                          {file.name}
                        </p>
                        {onRemoveFile && (
                          <button
                            type="button"
                            onClick={() => onRemoveFile(file.id)}
                            className="text-body-light hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0"
                            title="Remove file"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-body-light mt-0.5">{formatBytes(file.size)}</p>

                      {file.category && (
                        <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryBadgeColor(file.category)}`}>
                          {file.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Upload progress & status */}
                  {file.status === 'uploading' && (
                    <div className="mt-2 pt-2 border-t border-border-light">
                      <div className="flex justify-between items-center text-[10px] font-medium text-primary mb-1">
                        <span>Uploading...</span>
                        <span>{file.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300 rounded-full"
                          style={{ width: `${file.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {file.status === 'ready' && (
                    <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-green-600 font-medium">
                      <span className="flex items-center gap-1">
                        <FaCheckCircle className="text-green-500" /> Attached
                      </span>
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[10px] flex items-center gap-1 font-semibold"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="mt-2 text-[10px] text-red-500 font-medium flex items-center gap-1">
                      <FaExclamationCircle className="text-red-500" /> {file.error || 'Upload failed'}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
