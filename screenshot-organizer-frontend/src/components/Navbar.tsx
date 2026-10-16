import React from 'react';
import { FolderKanban } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-[#FBFBFA] border-b border-[#EAE8E4] py-5 px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* App Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2C2D30] p-2 rounded-xl text-white shadow-sm">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
              Visual Organizer
            </h1>
            <p className="text-xs text-[#706E6B]">AI-powered screenshot sorting</p>
          </div>
        </div>

        {/* Minimalist tech badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#706E6B] bg-white px-3 py-1.5 rounded-full border border-[#EAE8E4] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FastAPI & PyTorch Core
        </div>
        
      </div>
    </header>
  );
};