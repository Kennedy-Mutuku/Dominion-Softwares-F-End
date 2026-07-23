import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaVideo, FaPhotoVideo, FaFolderOpen, 
  FaUsers, FaBuilding, FaFileContract, FaInfoCircle, FaMagic 
} from 'react-icons/fa';
import FileUploadZone from './FileUploadZone';
import MediaPreviewGrid from './MediaPreviewGrid';
import { uploadFile } from '../utils/uploadService';
import toast from 'react-hot-toast';

export default function DynamicAssetUploader({
  clientType = 'business',
  mode = 'vision', // 'vision' (Step 3) or 'assets' (Step 4)
  attachedFiles = [],
  onFilesChanged,
}) {
  const isMinistry = clientType === 'ministry';
  const [activeCategory, setActiveCategory] = useState(
    mode === 'vision' ? 'Explain Your Vision' : 'Team & Leadership Headshots'
  );

  // Categories definition depending on clientType & mode
  const getCategories = () => {
    if (mode === 'vision') {
      return [
        {
          id: 'Explain Your Vision',
          label: isMinistry ? 'Vision Walkthroughs, User Stories & Mockups' : 'Walkthroughs, Audio Notes & Wireframes',
          icon: FaVideo,
          accept: 'video/*,audio/*,image/*,application/pdf,.fig',
          title: isMinistry ? 'Upload Vision Walkthrough or User Story Mockup' : 'Upload Video Walkthrough, User Story, or Wireframe',
          helpText: isMinistry
            ? 'Prefer to speak or show your vision? Upload a short video walkthrough, user story audio note, wireframe sketch, or sample church site screenshot.'
            : 'Prefer to show or explain in your own words? Upload a short video walkthrough, screen recording, user story audio note, wireframe sketch, or competitor reference.',
          allowedBadges: ['Video', 'Audio', 'Images', 'Documents']
        }
      ];
    }

    return [
      {
        id: 'Team & Leadership Headshots',
        label: isMinistry ? 'Pastoral Team & Leadership Photos' : 'Executive & Management Team Photos',
        icon: FaUsers,
        accept: 'image/*',
        title: isMinistry ? 'Pastoral Team & Leadership Headshots' : 'Executive & Staff Headshots',
        helpText: isMinistry
          ? 'Upload photos of your Senior Pastor, Pastoral Care Team, Board Members, or Ministry Leaders.'
          : 'Upload high-res headshots of your CEO, Leadership Team, Board of Directors, or Staff members.',
        allowedBadges: ['Images']
      },
      {
        id: 'Facility & Event Photos',
        label: isMinistry ? 'Facility & Worship Service Photos' : 'Office & Workplace Photos',
        icon: FaBuilding,
        accept: 'image/*,video/*',
        title: isMinistry ? 'Church Premises & Event Media' : 'Office, Facilities & Product Media',
        helpText: isMinistry
          ? 'Upload photos of your sanctuary, worship services, choir, community outreach events, or youth ministry gatherings.'
          : 'Upload photos of your headquarters, office environment, products, storefront, or past corporate events.',
        allowedBadges: ['Images', 'Video']
      },
      {
        id: 'Brand & Organizational Documents',
        label: isMinistry ? 'Statement of Faith & Org Documents' : 'Brand Guidelines & Corporate Docs',
        icon: FaFileContract,
        accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.svg,.fig',
        title: isMinistry ? 'Ministry Logos, Statement of Faith & Brochures' : 'Logos, Brand Guidelines & Corporate Catalog',
        helpText: isMinistry
          ? 'Upload vector/PNG logos, brand manuals, Statement of Faith PDFs, weekly bulletins, or ministry profile brochures.'
          : 'Upload brand guidelines, logo files (PNG/SVG), corporate brochures, product catalogs, or legal/registration PDFs.',
        allowedBadges: ['Documents', 'Images']
      }
    ];
  };

  const categories = getCategories();

  const handleFilesSelected = async (selectedFiles, categoryId) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    toast.loading(`Processing ${selectedFiles.length} file(s)...`, { id: 'file-upload' });

    let updatedList = [...attachedFiles];
    let successCount = 0;
    let failCount = 0;

    for (const file of selectedFiles) {
      try {
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const attachment = await uploadFile(file, categoryId, (percent) => {
          // Update real-time progress using pre-generated fileId safely
          updatedList = updatedList.map((item) =>
            item.id === fileId ? { ...item, progress: percent } : item
          );
          onFilesChanged(updatedList);
        }, fileId);

        // Add or update completed attachment
        const existingIndex = updatedList.findIndex((item) => item.id === attachment.id);
        if (existingIndex >= 0) {
          updatedList[existingIndex] = attachment;
        } else {
          updatedList.push(attachment);
        }
        onFilesChanged([...updatedList]);
        successCount++;
      } catch (err) {
        failCount++;
        toast.error(err.message || `Failed to attach ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully attached ${successCount} file(s)`, { id: 'file-upload' });
    } else if (failCount > 0) {
      toast.dismiss('file-upload');
    }
  };

  const handleRemoveFile = (fileId) => {
    const updated = attachedFiles.filter((f) => f.id !== fileId);
    onFilesChanged(updated);
    toast.success('File removed');
  };

  // Filter files by current mode / active category for display
  const currentCategoryFiles = attachedFiles.filter(
    (f) => f.category === activeCategory || (mode === 'vision' && (!f.category || f.category === 'Explain Your Vision'))
  );

  return (
    <div className="mt-6 pt-6 border-t border-border-light">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-heading flex items-center gap-2">
            {mode === 'vision' ? (
              <>
                <FaPhotoVideo className="text-primary" /> Explain Your Vision with Media (Optional)
              </>
            ) : (
              <>
                <FaFolderOpen className="text-primary" /> Site & Brand Assets Upload (Optional)
              </>
            )}
          </h3>
          <p className="text-xs text-body mt-0.5">
            {mode === 'vision'
              ? isMinistry
                ? 'Upload user story voice notes, video walkthroughs, wireframe sketches, or mockups to express your requirements.'
                : 'Upload user story voice notes, video pitches, wireframe sketches, or competitor screenshots to explain your project.'
              : isMinistry
                ? 'Provide existing church headshots, sanctuary photos, logos, or statement of faith documents.'
                : 'Provide company logos, staff photos, brand identity manuals, or corporate brochures.'
            }
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-primary border border-orange-200">
          <FaMagic className="text-xs" /> Optional Step
        </span>
      </div>

      {/* Category Tabs if mode === 'assets' */}
      {mode === 'assets' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const catFileCount = attachedFiles.filter((f) => f.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-cream text-body hover:bg-orange-50 hover:border-primary/40 border-border-light'
                }`}
              >
                <CatIcon className="text-sm" />
                <span>{cat.label}</span>
                {catFileCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeCategory === cat.id ? 'bg-white text-primary font-extrabold' : 'bg-primary text-white'
                  }`}>
                    {catFileCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Upload Zone */}
      {categories.map((cat) => {
        if (cat.id !== activeCategory && mode === 'assets') return null;

        return (
          <div key={cat.id} className="space-y-4">
            <FileUploadZone
              accept={cat.accept}
              multiple={true}
              title={cat.title}
              helpText={cat.helpText}
              allowedBadges={cat.allowedBadges}
              onFilesSelected={(files) => handleFilesSelected(files, cat.id)}
            />
          </div>
        );
      })}

      {/* Media Preview Grid for Current Category */}
      <MediaPreviewGrid
        files={mode === 'vision' ? attachedFiles : currentCategoryFiles}
        onRemoveFile={handleRemoveFile}
        title={mode === 'vision' ? 'Attached Vision Files & User Stories' : `Attached to ${activeCategory}`}
      />

      <div className="mt-3 bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-800">
        <FaInfoCircle className="text-blue-500 text-sm shrink-0 mt-0.5" />
        <p>
          Don't have files right now? You can skip this and send assets or user story mockups to our team later via your Client Portal after application submission.
        </p>
      </div>
    </div>
  );
}
