export interface OrganizedItem {
  id: number;
  filename: string;
  imageUrl: string;
  category: string;
  confidence: number;
  userFolder: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}