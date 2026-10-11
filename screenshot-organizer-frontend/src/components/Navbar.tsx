import React from 'react';
import { Brain } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-8 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Screenshot & Visual Organizer
          </h1>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-semibold border border-indigo-100 shadow-sm">
          FastAPI + PyTorch + React (TS)
        </span>
      </div>
    </header>
  );
};