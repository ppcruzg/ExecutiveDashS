
import React, { useState, useEffect } from 'react';
import { OperationalStatus } from '../types';

interface HeaderProps {
  storeName: string;
  location: string;
  globalStatus: OperationalStatus;
}

const Header: React.FC<HeaderProps> = ({ storeName, location, globalStatus }) => {
  const [time, setTime] = useState(new Date());

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
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between glass-card p-4 rounded-xl border-l-4 border-l-blue-500">
      <div className="flex items-center gap-4">
        <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 shadow-inner overflow-hidden flex items-center justify-center">
          <img
            src="/assets/sidon.png"
            alt="Sidon Logo"
            className="h-8 w-auto object-contain brightness-110 contrast-125"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">{storeName}</h1>
          <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">{location}</p>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-4 md:mt-0">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(globalStatus)} animate-pulse`}></span>
            <span className="text-xs font-semibold tracking-widest text-gray-300">ESTADO GLOBAL: ÓPTIMO</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Última sincronización: Hace 4s</div>
        </div>

        <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>

        <div className="text-right">
          <div className="text-lg font-mono text-white tabular-nums">
            {time.toLocaleTimeString('es-MX', { hour12: false })}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
            {time.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
