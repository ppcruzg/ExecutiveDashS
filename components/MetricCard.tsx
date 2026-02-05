
import React, { useState } from 'react';
import { MetricCardProps, OperationalStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

const MetricCard: React.FC<MetricCardProps> = ({ title, subtitle, status, children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { theme } = useTheme();

  const getStatusLabel = (status: OperationalStatus) => {
    switch (status) {
      case OperationalStatus.OPTIMAL: return {
        text: "ÓPTIMO",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-400/10",
        borderColor: "border-emerald-200 dark:border-emerald-400/30",
        glowColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)'
      };
      case OperationalStatus.AT_RISK: return {
        text: "EN RIESGO",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-400/10",
        borderColor: "border-amber-200 dark:border-amber-400/30",
        glowColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)'
      };
      case OperationalStatus.CRITICAL: return {
        text: "CRÍTICO",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-100 dark:bg-rose-400/10",
        borderColor: "border-rose-200 dark:border-rose-400/30",
        glowColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.15)'
      };
    }
  };

  const statusInfo = status ? getStatusLabel(status) : null;

  const shadowColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(31, 38, 135, 0.1)';
  const baseShadow = theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.8)' : '0 8px 32px rgba(31, 38, 135, 0.07)';

  // Check if this is the DISCIPLINA OPERATIVA card
  const showConfigButton = title === "DISCIPLINA OPERATIVA";

  return (
    <div
      className={`glass-card rounded-2xl flex flex-col relative overflow-hidden transition-all duration-500 group ${className}`}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered && statusInfo
          ? `0 20px 60px ${shadowColor}, 0 0 30px ${statusInfo.glowColor}`
          : baseShadow
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border overlay */}
      {statusInfo && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.glowColor}, transparent, ${statusInfo.glowColor})`,
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
      )}

      {/* Decorative animated scanline */}
      <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-transparent via-blue-500/20 ${theme === 'dark' ? 'dark:via-white/40' : 'via-blue-500/10'} to-transparent transition-all duration-700`}
          style={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            width: '50%'
          }}
        />
      </div>

      {/* Background gradient overlay */}
      {statusInfo && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${statusInfo.glowColor}, transparent)`,
              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
              opacity: isHovered ? 0.3 : 0.15
            }}
          />
        </div>
      )}

      <div className="p-4 pb-2 flex justify-between items-start relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-widest text-text-main uppercase transition-all duration-300 group-hover:tracking-[0.15em]">
              {title}
            </h3>
            {/* Settings Icon - Only for DISCIPLINA OPERATIVA */}
            {showConfigButton && (
              <button
                onClick={() => setShowConfigModal(true)}
                className="p-1 hover:bg-surface-accent rounded-full transition-all text-text-muted hover:text-text-main group/settings opacity-0 group-hover:opacity-100"
                title="Configuración"
              >
                <svg className="w-4 h-4 group-hover/settings:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-text-muted uppercase font-medium mt-1 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>

        {/* Enhanced status badge with pulse animation - only show if status is provided */}
        {statusInfo && (
          <div className="relative">
            <div
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.borderColor} backdrop-blur-sm transition-all duration-300 relative overflow-hidden`}
              style={{
                boxShadow: isHovered ? `0 0 20px ${statusInfo.glowColor}` : 'none'
              }}
            >
              {/* Pulse effect background */}
              <div
                className="absolute inset-0 animate-pulse-slow"
                style={{
                  background: `radial-gradient(circle, ${statusInfo.glowColor}, transparent)`
                }}
              />
              <span className="relative z-10">{statusInfo.text}</span>
            </div>

            {/* Pulsing dot indicator */}
            <div className="absolute -top-1 -right-1">
              <div
                className={`w-2 h-2 rounded-full ${statusInfo.bg} ${statusInfo.borderColor} border animate-ping`}
                style={{ animationDuration: '2s' }}
              />
              <div
                className={`w-2 h-2 rounded-full ${statusInfo.bg} ${statusInfo.borderColor} border absolute top-0 left-0`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 pt-0 relative z-10 overflow-y-auto custom-scrollbar">
        {children}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowConfigModal(false)}>
          <div
            className="bg-surface border border-border-color rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Configuración</h2>
                <p className="text-text-muted text-xs mt-1">Enlaces a productos Sidon</p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 hover:bg-surface-accent rounded-full transition-all text-text-muted hover:text-text-main"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Smart Audits Link */}
              <a
                href="https://sidon-landing.vercel.app/smart-audits"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Smart Audits</h3>
                    <p className="text-xs text-text-muted mt-1">Procesos</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                {/* Process List */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Limpieza', 'Surtido', 'Inventario', 'Check-out', 'Recibo'].map((process) => (
                    <span key={process} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-600 dark:text-blue-400 font-semibold">
                      {process}
                    </span>
                  ))}
                </div>
              </a>

              {/* Sense IoT Link */}
              <a
                href="https://sidon-landing.vercel.app/sense-iot"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Sense</h3>
                    <p className="text-xs text-text-muted mt-1">Aperturas en tiempo de sucursal</p>
                  </div>
                  <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-border-color">
              <p className="text-[10px] text-text-muted text-center">Sidon Executive Intelligence Platform</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default MetricCard;
