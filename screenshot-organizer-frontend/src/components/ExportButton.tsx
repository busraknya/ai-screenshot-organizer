import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportItemsToZip } from '../utils/export.service';
import type { OrganizedItem } from '../interfaces/item.interface';

interface ExportButtonProps {
  items: OrganizedItem[];
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ items, onToast }) => {
  const [exporting, setExporting] = useState(false);
  const [statusText, setStatusText] = useState('Export ZIP');

  const handleExport = async () => {
    if (items.length === 0) {
      onToast('No items available to export.', 'info');
      return;
    }

    setExporting(true);
    try {
      await exportItemsToZip(items, (msg) => setStatusText(msg));
      onToast('ZIP archive successfully downloaded!', 'success');
    } catch (err) {
      console.error(err);
      onToast('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
      setStatusText('Export ZIP');
    }
  };

  if (items.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="bg-white hover:bg-[#F4F3F0] text-[#1A1A1A] border border-[#EAE8E4] text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xs flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#2C2D30]" />
          {statusText}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-[#2C2D30]" />
          Export ZIP ({items.length})
        </>
      )}
    </button>
  );
};