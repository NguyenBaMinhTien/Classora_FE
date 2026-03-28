import React from 'react';
import { Bell, Plus, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

export default function Header({ title, showSearch = false }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">{title}</h1>

        {showSearch && (
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#10b77f] transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#10b77f] transition-all outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:text-[#10b77f] hover:bg-emerald-50 rounded-full transition-all">
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white animate-pulse"></span>
          <Bell className="w-6 h-6" />
        </button>

        <div className="h-8 w-px bg-slate-100"></div>


      </div>
    </header>
  );
}
