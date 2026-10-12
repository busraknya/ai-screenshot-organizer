import React, { useState } from 'react';
import axios from 'axios';
import type { OrganizedItem, ToastMessage } from '../interfaces/item.interface';
import { UploadBox } from '../components/UploadBox';
import { ImageCard } from '../components/ImageCard';
import { ExportButton } from '../components/ExportButton'; 
import { Folder, CheckCircle, AlertCircle, Info, Filter } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<OrganizedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://127.0.0.1:8000/api/v1/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        return {
          id: Date.now() + Math.random(),
          filename: response.data.filename,
          imageUrl: URL.createObjectURL(file),
          category: response.data.predicted_category,
          confidence: response.data.confidence,
          userFolder: response.data.predicted_category,
        } as OrganizedItem;
      });

      const newItems = await Promise.all(uploadPromises);

      setItems((prev) => [...newItems, ...prev]);
      setSelectedFiles([]);
      addToast(`Successfully processed ${newItems.length} images!`, 'success');
    } catch (err) {
      console.error(err);
      setError('Batch processing failed. Check backend connection.');
      addToast('Some uploads failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    addToast('Image successfully removed.', 'info');
  };

  const handleFolderChange = (id: number, newFolder: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, userFolder: newFolder } : item))
    );
    addToast('Folder updated successfully!', 'success');
  };

  // Filtering
  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.userFolder === activeFilter);

  const categories = [
    'All',
    'Shopping & Products',
    'Home & Living',
    'Tech & Electronics',
    'Work & Stationery',
    'General / Archive'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 relative">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-indigo-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.type === 'info' && <Info className="w-4 h-4" />}
            {toast.message}
          </div>
        ))}
      </div>

      <UploadBox
        selectedFiles={selectedFiles}
        loading={loading}
        error={error}
        onFilesChange={handleFilesChange}
        onUpload={handleUpload}
        onCancel={() => setSelectedFiles([])}
      />

      {/* (Filter Tabs) */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap shadow-sm ${
              activeFilter === cat
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat} {cat === 'All' ? `(${items.length})` : `(${items.filter(i => i.userFolder === cat).length})`}
          </button>
        ))}
      </div>

      {/* List Sections & Export Button*/}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Folder className="w-6 h-6 text-indigo-600" /> Organized Images ({filteredItems.length})
          </h2>
          
          {/* Modular Export Button */}
          <ExportButton items={filteredItems} onToast={addToast} />
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
            {items.length === 0 
              ? "No images uploaded yet. Upload screenshots above to start AI organization!" 
              : "No images found in this folder."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onFolderChange={handleFolderChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};