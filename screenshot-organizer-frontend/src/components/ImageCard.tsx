import React, { useState } from 'react';
import type { OrganizedItem } from '../interfaces/item.interface';
import { Trash2, Check, X, Sparkles } from 'lucide-react';

interface ImageCardProps {
  item: OrganizedItem;
  onDelete: (id: number) => void;
  onFolderChange: (id: number, newFolder: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item, onDelete, onFolderChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(item.userFolder);
  const [isModified, setIsModified] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
    setIsModified(e.target.value !== item.userFolder);
  };

  const handleApplyChange = () => {
    onFolderChange(item.id, selectedFolder);
    setIsModified(false);
  };

  const handleCancelChange = () => {
    setSelectedFolder(item.userFolder);
    setIsModified(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE8E4] overflow-hidden shadow-2xs flex flex-col justify-between transition-all hover:border-[#D1CFCD]">
      <div>
        {/* Image Preview & AI Confidence Badge */}
        <div className="h-52 bg-[#FBFBFA] overflow-hidden relative flex items-center justify-center border-b border-[#EAE8E4]">
          <img src={item.imageUrl} alt={item.filename} className="w-full h-full object-cover" />
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#EAE8E4] shadow-2xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> {(item.confidence * 100).toFixed(0)}% match
          </span>
        </div>

        <div className="p-5">
          {/* AI Category Tag */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#555350] bg-[#F4F3F0] px-2.5 py-0.5 rounded-md border border-[#EAE8E4]">
              {item.category}
            </span>
          </div>
          <p className="text-xs text-[#8C8985] truncate mb-4" title={item.filename}>
            {item.filename}
          </p>

          {/* Folder Update Section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#F4F3F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#706E6B]">Target folder</span>
              <select
                value={selectedFolder}
                onChange={handleSelectChange}
                className="text-xs border border-[#EAE8E4] rounded-xl px-3 py-1.5 bg-[#FBFBFA] font-medium text-[#1A1A1A] focus:outline-none focus:border-[#2C2D30] transition-colors"
              >
                <option value="Shopping & Products">Shopping & Products</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Tech & Electronics">Tech & Electronics</option>
                <option value="Work & Stationery">Work & Stationery</option>
                <option value="General / Archive">General / Archive</option>
              </select>
            </div>

            {isModified && (
              <div className="flex items-center justify-end gap-1.5 mt-1 animate-fadeIn">
                <span className="text-[10px] text-amber-700 font-medium">Save folder?</span>
                <button
                  onClick={handleApplyChange}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-lg transition-colors shadow-xs"
                  title="Apply"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCancelChange}
                  className="bg-[#EAE8E4] hover:bg-[#D1CFCD] text-[#555350] p-1 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Section */}
      <div className="border-t border-[#F4F3F0] px-5 py-3 bg-[#FBFBFA]/50 flex justify-end">
        {showConfirm ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="text-xs text-[#706E6B] font-medium">Delete item?</span>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-xl font-medium transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-[#EAE8E4] hover:bg-[#D1CFCD] text-[#555350] text-xs px-2.5 py-1 rounded-xl font-medium transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-[#8C8985] hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>
    </div>
  );
};