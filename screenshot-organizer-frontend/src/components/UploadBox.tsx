import React from 'react';
import { Upload, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
          <Upload className="w-5 h-5 text-indigo-600" /> Bulk Upload Images / Screenshots
        </h2>
        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
          Max Limit: {MAX_BATCH_LIMIT} files per batch
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <label className="w-full md:w-2/3 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
          <input 
            type="file" 
            multiple 
            onChange={onFilesChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          {selectedFiles.length > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                {selectedFiles.length} / {MAX_BATCH_LIMIT} files selected
              </span>
              <div className="flex gap-2 overflow-x-auto max-w-full py-2">
                {selectedFiles.slice(0, 4).map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-16 w-16 object-cover rounded-lg shadow-sm border border-slate-200"
                  />
                ))}
                {selectedFiles.length > 4 && (
                  <div className="h-16 w-16 bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                    +{selectedFiles.length - 4} more
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-600">Click to select up to {MAX_BATCH_LIMIT} files or drag & drop</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Optimized Batch Processing)</span>
            </>
          )}
        </label>

        <div className="w-full md:w-1/3 flex flex-col justify-center gap-3">
          <button
            onClick={onUpload}
            disabled={selectedFiles.length === 0 || selectedFiles.length > MAX_BATCH_LIMIT || loading}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
              selectedFiles.length === 0 || selectedFiles.length > MAX_BATCH_LIMIT || loading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Batch Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Upload & Analyze ({selectedFiles.length})
              </>
            )}
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-red-600 text-center font-medium transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* LIMIT IMAGE UPLOAD */}
      {selectedFiles.length > MAX_BATCH_LIMIT && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>You can upload a maximum of <strong>{MAX_BATCH_LIMIT} files</strong> at once. Please reduce your selection.</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
};