
import React, { useState } from 'react';
import { MetricCardProps, OperationalStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

const MetricCard: React.FC<MetricCardProps> = ({ title, subtitle, status, children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
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
          <h3 className="text-sm font-bold tracking-widest text-text-main uppercase transition-all duration-300 group-hover:tracking-[0.15em]">
            {title}
          </h3>
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

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
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
