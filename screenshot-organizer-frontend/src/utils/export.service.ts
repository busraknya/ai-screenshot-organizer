import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { OrganizedItem } from '../interfaces/item.interface';

export const exportItemsToZip = async (items: OrganizedItem[], onProgress?: (msg: string) => void) => {
  if (items.length === 0) return;

  const zip = new JSZip();
  
  if (onProgress) onProgress("Preparing files for export...");

  for (const item of items) {
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      
      const folderName = item.userFolder || "General / Archive";
      
      const folder = zip.folder(folderName);
      if (folder) {
        folder.file(item.filename, blob);
      }
    } catch (err) {
      console.error(`Failed to pack file ${item.filename}:`, err);
    }
  }

  if (onProgress) onProgress("Compiling ZIP archive...");

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'organized-screenshots.zip');
  
  if (onProgress) onProgress("Export completed successfully!");
};