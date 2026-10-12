import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportItemsToZip } from '../utils/export.service';
import type { OrganizedItem } from '../interfaces/item.interface';

interface ExportButtonProps {
  items: OrganizedItem[];
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ items, onToast }) => {
  // Loading state for export process
  const [exporting, setExporting] = useState(false);
  const [statusText, setStatusText] = useState('Export to ZIP');

  // Trigger zip download when button is clicked
  const handleExport = async () => {
    // Check if there is anything to export
    if (items.length === 0) {
      onToast('No items available to export.', 'info');
      return;
    }

    setExporting(true);
    try {
      // Call zip utility and update status message
      await exportItemsToZip(items, (msg) => setStatusText(msg));
      onToast('ZIP archive successfully downloaded!', 'success');
    } catch (err) {
      console.error(err);
      onToast('Export failed. Please try again.', 'error');
    } finally {
      // Reset loading state
      setExporting(false);
      setStatusText('Export to ZIP');
    }
  };

  // Hide button if list is empty
  if (items.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] disabled:bg-slate-300"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {statusText}
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export Organized ZIP ({items.length})
        </>
      )}
    </button>
  );
};