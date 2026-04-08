import React from 'react';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white ${className}`}>
      <div className="container mx-auto px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold tracking-wider">MAC</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-blue-200 tracking-widest">MAKE A CHART</div>
        </div>
      </div>
    </header>
  );
}
