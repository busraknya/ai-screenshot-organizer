import React from 'react';
import { Upload, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
  selectedFile: File | null;
  previewUrl: string | null;
  loading: boolean;
  error: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onCancel: () => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  selectedFile,
  previewUrl,
  loading,
  error,
  onFileChange,
  onUpload,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
        <Upload className="w-5 h-5 text-indigo-600" /> Upload Image / Screenshot (Create)
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <label className="w-full md:w-2/3 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
          <input type="file" onChange={onFileChange} className="hidden" accept="image/*" />
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="h-36 object-contain rounded-lg shadow-sm" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium rounded-lg">
                Click to change
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-600">Click to select or drag & drop file</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
            </>
          )}
        </label>

        <div className="w-full md:w-1/3 flex flex-col justify-center gap-3">
          <button
            onClick={onUpload}
            disabled={!selectedFile || loading}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
              !selectedFile || loading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> AI Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Upload & Analyze
              </>
            )}
          </button>
          {selectedFile && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-red-600 text-center font-medium transition-colors"
            >
              Cancel Selection
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
};