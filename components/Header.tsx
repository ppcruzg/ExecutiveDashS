
import React, { useState, useEffect } from 'react';
import { OperationalStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  storeName: string;
  location: string;
  globalStatus: OperationalStatus;
}

const Header: React.FC<HeaderProps> = ({ storeName, location, globalStatus }) => {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: OperationalStatus) => {
    switch (status) {
      case OperationalStatus.OPTIMAL: return 'bg-emerald-500';
      case OperationalStatus.AT_RISK: return 'bg-amber-500';
      case OperationalStatus.CRITICAL: return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between glass-card p-4 rounded-xl border-l-4 border-l-blue-500 relative transition-all duration-500">
      <div className="flex items-center gap-4">
        <div className="bg-surface-accent p-1.5 rounded-lg border border-border-color shadow-inner overflow-hidden flex items-center justify-center">
          <img
            src="/assets/sidon.png"
            alt="Sidon Logo"
            className="h-8 w-auto object-contain brightness-110 contrast-125 dark:filter-none"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main transition-colors duration-300">{storeName}</h1>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase transition-colors duration-300">{location}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-surface-accent hover:bg-surface border border-border-color transition-all duration-300 group"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(globalStatus)} animate-pulse`}></span>
            <span className="text-xs font-semibold tracking-widest text-text-secondary uppercase transition-colors duration-300">Estado Global: Óptimo</span>
          </div>
          <div className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">Última sincronización: Hace 4s</div>
        </div>

        <div className={`h-10 w-[1px] ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'} hidden md:block`}></div>

        <div className="text-right">
          <div className="text-lg font-mono text-text-main tabular-nums transition-colors duration-300">
            {time.toLocaleTimeString('es-MX', { hour12: false })}
          </div>
          <div className="text-[10px] text-text-muted uppercase tracking-widest transition-colors duration-300">
            {time.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
