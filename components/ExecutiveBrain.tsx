
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ExecutiveTrendsPage from './ExecutiveTrendsPage';
import { useTheme } from '../context/ThemeContext';

interface Alert {
    id: string;
    source: string;
    message: string;
    severity: 'critical' | 'warning';
    action: string;
}

const ExecutiveBrain: React.FC = () => {
    const [showTrends, setShowTrends] = useState(false);
    const { theme } = useTheme();

    // Mock critical alerts derived from current dashboard state
    const criticalAlerts: Alert[] = [
        {
            id: '1',
            source: 'PLANTILLA',
            message: 'Déficit de 12% en validación AI (5 Ghost Workers)',
            severity: 'critical',
            action: 'REFORZAR SUPERVISIÓN'
        },
        {
            id: '2',
            source: 'EXHIBICIÓN',
            message: '42 huecos sin stock ($2,100 riesgo diario)',
            severity: 'critical',
            action: 'REPOSICIÓN URGENTE'
        },
        {
            id: '3',
            source: 'ESTABILIDAD',
            message: 'Desviación térmica en Cárnicos (145 min OUT)',
            severity: 'warning',
            action: 'CHECK COMPRESOR'
        }
    ];

    // Consolidated Financial Risk (CEO Level)
    const totalRisk = criticalAlerts.length > 0 ? 27700 : 0; // Derived from EXHIBICIÓN ($2,100) + ESTABILIDAD ($25,100) + STAFF (est. $500)

    return (
        <div className="flex flex-col h-full space-y-3">
            {/* Visual Intelligence Pulse - TRIGGER FOR TRENDS */}
            <div
                onClick={() => setShowTrends(true)}
                className="relative h-[72px] rounded-xl overflow-hidden bg-surface-accent border border-border-color group shadow-2xl shadow-rose-900/10 cursor-pointer hover:bg-surface transition-all active:scale-[0.98]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-rose-500/15 to-blue-500/10 animate-gradient-x opacity-50"></div>

                <div className="relative z-10 h-full flex items-center px-4 justify-between">
                    {/* Left: Health Pulse */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-rose-500 blur-xl opacity-30 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border border-rose-500/50 flex items-center justify-center bg-rose-500/10">
                                    <svg className="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-rose-600 dark:text-rose-500 uppercase tracking-[0.2em]">Estado Maestro</div>
                            <div className="text-sm font-bold text-text-main uppercase italic tracking-tight">ALERTA ESTRATÉGICA</div>
                        </div>
                    </div>

                    {/* Right: Risk Matrix */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end border-r border-border-color pr-4">
                            <div className={`text-[20px] font-black tabular-nums ${theme === 'dark' ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-rose-600'}`}>
                                ${totalRisk.toLocaleString()}
                            </div>
                            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">RIESGO TOTAL (MXN/D)</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-[18px] font-black text-text-main tabular-nums">{criticalAlerts.length}</div>
                            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">ANOMALÍAS</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* consolidated Alerts for CEO */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="relative group p-2 rounded-lg bg-surface-accent border border-border-color hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded tracking-tighter ${alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                }`}>
                                {alert.source}
                            </span>
                            <span className="text-[7px] text-text-muted font-mono">ID: {alert.id}x99</span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-tight mb-2 font-medium pr-8">{alert.message}</p>

                        <button className="w-full py-1 bg-surface hover:bg-blue-600/20 border border-border-color hover:border-blue-500/50 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest rounded transition-all">
                            {alert.action}
                        </button>

                        {alert.severity === 'critical' && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Strategic Command Input (The former SOW Integrator) */}
            <div className="bg-gradient-to-b from-blue-600/10 to-transparent p-2 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-[8px] font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest">Estafeta Estratégica AI</span>
                </div>
                <div className="relative h-[60px]">
                    <textarea
                        placeholder="Introduzca misiones estratégicas o lista de sensores..."
                        className="w-full h-full bg-surface border border-border-color rounded-lg p-2 text-[9px] text-text-main font-mono focus:border-blue-500/50 outline-none resize-none placeholder:text-text-muted"
                    />
                    <button className="absolute bottom-1.5 right-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-[8px] font-black text-white uppercase rounded shadow-lg">
                        Procesar
                    </button>
                </div>
            </div>

            {/* EXECUTIVE TRENDS MODAL */}
            {showTrends && createPortal(
                <ExecutiveTrendsPage onClose={() => setShowTrends(false)} />,
                document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 10s ease infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
      ` }} />
        </div>
    );
};

export default ExecutiveBrain;
