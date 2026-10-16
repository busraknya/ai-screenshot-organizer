import React from 'react';
import { Upload, ArrowUpRight, RefreshCw, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
  selectedFiles: File[];
  loading: boolean;
  error: string | null;
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onCancel: () => void;
}

const MAX_BATCH_LIMIT = 15;

export const UploadBox: React.FC<UploadBoxProps> = ({
  selectedFiles,
  loading,
  error,
  onFilesChange,
  onUpload,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xs border border-[#EAE8E4] p-8 mb-8 transition-all">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A] tracking-tight">
            Drop your captures
          </h2>
          <p className="text-xs text-[#706E6B] mt-0.5">
            Automatically analyze and sort your screenshots instantly.
          </p>
        </div>
        <span className="text-xs font-medium bg-[#F4F3F0] text-[#555350] px-3 py-1 rounded-full border border-[#EAE8E4]">
          Max {MAX_BATCH_LIMIT} files
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Dropzone */}
        <label className="w-full md:w-2/3 border border-dashed border-[#D1CFCD] rounded-2xl p-8 text-center cursor-pointer hover:border-[#2C2D30] hover:bg-[#FBFBFA]/50 transition-all bg-[#FBFBFA] flex flex-col items-center justify-center relative overflow-hidden group">
          <input 
            type="file" 
            multiple 
            onChange={onFilesChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          {selectedFiles.length > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <span className="bg-[#2C2D30] text-white text-xs font-medium px-3 py-1 rounded-full">
                {selectedFiles.length} files ready
              </span>
              <div className="flex gap-2 overflow-x-auto max-w-full py-1">
                {selectedFiles.slice(0, 4).map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-14 w-14 object-cover rounded-xl shadow-xs border border-[#EAE8E4]"
                  />
                ))}
                {selectedFiles.length > 4 && (
                  <div className="h-14 w-14 bg-[#EAE8E4] rounded-xl flex items-center justify-center text-xs font-medium text-[#555350]">
                    +{selectedFiles.length - 4}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#EAE8E4] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-[#2C2D30]">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">Click to browse or drag & drop</span>
              <span className="text-xs text-[#8C8985] mt-1">Supports PNG, JPG, WEBP</span>
            </>
          )}
        </label>

        {/* Action Buttons */}
        <div className="w-full md:w-1/3 flex flex-col justify-center gap-3">
          <button
            onClick={onUpload}
            disabled={selectedFiles.length === 0 || selectedFiles.length > MAX_BATCH_LIMIT || loading}
            className={`w-full py-3.5 px-4 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
              selectedFiles.length === 0 || selectedFiles.length > MAX_BATCH_LIMIT || loading
                ? 'bg-[#EAE8E4] text-[#A09E9A] cursor-not-allowed'
                : 'bg-[#2C2D30] text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" /> Organize Now ({selectedFiles.length})
              </>
            )}
          </button>
          
          {selectedFiles.length > 0 && (
            <button
              onClick={onCancel}
              className="text-xs text-[#706E6B] hover:text-red-600 text-center font-medium transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {selectedFiles.length > MAX_BATCH_LIMIT && (
        <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Limit is <strong>{MAX_BATCH_LIMIT} files</strong> per batch. Please reduce your selection.</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50/80 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
};