import React, { useState } from 'react';
import type { OrganizedItem } from '../interfaces/item.interface';
import { Trash2, Check, X } from 'lucide-react';

interface ImageCardProps {
  item: OrganizedItem;
  onDelete: (id: number) => void;
  onFolderChange: (id: number, newFolder: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item, onDelete, onFolderChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(item.userFolder);
  const [isModified, setIsModified] = useState(false);

  // Klasör seçimi değiştiğinde geçici state'e al ve Apply butonunu göster
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
    setIsModified(e.target.value !== item.userFolder);
  };

  // Onaylandığında ana state'e (Dashboard) bildir
  const handleApplyChange = () => {
    onFolderChange(item.id, selectedFolder);
    setIsModified(false);
  };

  const handleCancelChange = () => {
    setSelectedFolder(item.userFolder);
    setIsModified(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div>
        <div className="h-48 bg-slate-100 overflow-hidden relative flex items-center justify-center">
          <img src={item.imageUrl} alt={item.filename} className="w-full h-full object-cover" />
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
            Confidence: {(item.confidence * 100).toFixed(1)}%
          </span>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              AI: {item.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mb-4" title={item.filename}>
            File: {item.filename}
          </p>

          {/* UPDATE İşlemi ve Onay Mekanizması */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Folder:</span>
              <select
                value={selectedFolder}
                onChange={handleSelectChange}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-indigo-500 shadow-sm transition-colors flex-grow"
              >
                <option value="Shopping & Products">Shopping & Products</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Tech & Electronics">Tech & Electronics</option>
                <option value="Work & Stationery">Work & Stationery</option>
                <option value="General / Archive">General / Archive</option>
              </select>
            </div>

            {/* Değişiklik yapıldığında beliren Apply / Cancel butonları */}
            {isModified && (
              <div className="flex items-center justify-end gap-1.5 mt-1 animate-fadeIn">
                <span className="text-[10px] text-amber-600 font-medium">Save changes?</span>
                <button
                  onClick={handleApplyChange}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-md transition-colors shadow-sm"
                  title="Apply"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCancelChange}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-1 rounded-md transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE İşlemi & Onay Modalı */}
      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex justify-end">
        {showConfirm ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="text-xs text-slate-600 font-medium">Are you sure?</span>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        )}
      </div>
    </div>
  );
};