

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import DumaPage from './DumaPage';

interface ProcessData {
  name: string;
  scheduled: number;
  real: number;
  previous?: number;
  trend?: 'up' | 'down' | 'stable';
}

const initialData: ProcessData[] = [
  { name: 'Limpieza', scheduled: 100, real: 98, previous: 98 },
  { name: 'Surtido', scheduled: 100, real: 85, previous: 85 },
  { name: 'Inventario', scheduled: 100, real: 100, previous: 100 },
  { name: 'Check-out', scheduled: 100, real: 92, previous: 92 },
  { name: 'Recibo', scheduled: 100, real: 78, previous: 78 },
];

const ProcessCompliance: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [data, setData] = useState<ProcessData[]>(initialData);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentArea, setCurrentArea] = useState<string>('');
  const [lastAlert, setLastAlert] = useState<{
    severity: 'critical' | 'warning';
    message: string;
    areas: string;
  }>({
    severity: 'warning',
    message: 'Rendimiento bajo meta en Surtido, Recibo. Se recomienda revisión de procesos.',
    areas: 'Surtido, Recibo'
  });
  const [showDumaPage, setShowDumaPage] = useState(false);

  // Calculate compliance percentage
  const calculateCompliance = (processData: ProcessData[]) => {
    const total = processData.reduce((sum, item) => sum + item.real, 0);
    return Number((total / processData.length).toFixed(1));
  };

  const [compliance, setCompliance] = useState(calculateCompliance(initialData));

  // Calculate total financial risk
  const calculateTotalRisk = (processData: ProcessData[]) => {
    return processData.reduce((sum, item) => sum + (100 - item.real) * 1000, 0);
  };

  const [totalRisk, setTotalRisk] = useState(calculateTotalRisk(initialData));
  const target = 95;

  // Simulate supervision rounds with data changes
  useEffect(() => {
    const roundInterval = setInterval(() => {
      setIsUpdating(true);

      // Select random area to evaluate
      const randomIndex = Math.floor(Math.random() * initialData.length);
      const areaName = initialData[randomIndex].name;
      setCurrentArea(areaName);

      setTimeout(() => {
        setData(prevData => {
          const newData = prevData.map(item => {
            // Random change between -10 and +10
            const change = Math.floor(Math.random() * 21) - 10;
            const newValue = Math.max(60, Math.min(100, item.real + change));

            let trend: 'up' | 'down' | 'stable' = 'stable';
            if (newValue > item.real) trend = 'up';
            else if (newValue < item.real) trend = 'down';

            return {
              ...item,
              previous: item.real,
              real: newValue,
              trend
            };
          });

          // Update compliance and risk
          const newCompliance = calculateCompliance(newData);
          setCompliance(newCompliance);
          setTotalRisk(calculateTotalRisk(newData));

          // Update last alert if compliance is below 80%
          if (newCompliance < 80) {
            const criticalAreas = newData.filter(d => d.real < 70).map(d => d.name).join(', ');
            const warningAreas = newData.filter(d => d.real < 80).map(d => d.name).join(', ');

            setLastAlert({
              severity: newCompliance < 70 ? 'critical' : 'warning',
              message: newCompliance < 70
                ? `Déficit crítico detectado en ${criticalAreas}. Impacto proyectado en cumplimiento general: -${(95 - newCompliance).toFixed(1)}pts.`
                : `Rendimiento bajo meta en ${warningAreas}. Se recomienda revisión de procesos.`,
              areas: newCompliance < 70 ? criticalAreas : warningAreas
            });
          }

          return newData;
        });

        setRoundNumber(prev => prev + 1);

        // Clear area name after animation
        setTimeout(() => {
          setIsUpdating(false);
          setTimeout(() => setCurrentArea(''), 1000);
        }, 500);
      }, 500);
    }, 8000); // New round every 8 seconds

    return () => clearInterval(roundInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get status color and label based on compliance
  const getStatusInfo = () => {
    if (compliance >= 90) return {
      label: 'ÓPTIMO',
      bg: 'from-emerald-400',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/30',
      glow: 'rgba(16, 185, 129, 0.4)'
    };
    if (compliance >= 80) return {
      label: 'BUENO',
      bg: 'from-blue-400',
      text: 'text-blue-400',
      badgeBg: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
      glow: 'rgba(59, 130, 246, 0.4)'
    };
    if (compliance >= 70) return {
      label: 'EN RIESGO',
      bg: 'from-amber-400',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-400/10',
      borderColor: 'border-amber-400/30',
      glow: 'rgba(245, 158, 11, 0.4)'
    };
    return {
      label: 'CRÍTICO',
      bg: 'from-rose-400',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-400/10',
      borderColor: 'border-rose-400/30',
      glow: 'rgba(239, 68, 68, 0.4)'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="h-full flex flex-col relative overflow-hidden">
        {/* Animated gradient background overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main content with fade-in animation */}
        <div className={`relative z-10 h-full flex flex-col transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header metrics with enhanced styling */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col group cursor-pointer">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-bold text-white tabular-nums transition-all duration-700 ${statusInfo.text}`}
                  style={{
                    textShadow: `0 0 20px ${statusInfo.glow}, 0 0 40px ${statusInfo.glow}`,
                    transform: isUpdating ? 'scale(1.1)' : 'scale(1)'
                  }}>
                  {compliance}%
                </span>
                {compliance >= target && (
                  <span className="text-emerald-400 text-sm animate-bounce">✓</span>
                )}
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              {/* Status and Area indicator row */}
              <div className="flex items-center gap-2">
                {/* Area being evaluated indicator - LEFT SIDE */}
                {currentArea && (
                  <div className={`px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm transition-all duration-300 ${isUpdating ? 'scale-105 border-blue-500/60 bg-blue-500/20' : 'opacity-80'}`}>
                    <span className="text-[8px] text-blue-400 font-bold tracking-wider">📋 {currentArea.toUpperCase()}</span>
                  </div>
                )}

                {/* Status badge - RIGHT SIDE */}
                <div className={`px-2 py-1 rounded-lg ${statusInfo.badgeBg} border ${statusInfo.borderColor} backdrop-blur-sm transition-all duration-500`}>
                  <span className={`text-[8px] ${statusInfo.text} font-bold tracking-wider`}>{statusInfo.label}</span>
                </div>

                {/* Financial Risk badge */}
                <div className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 backdrop-blur-sm shadow-sm transition-all duration-500">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-[7px] text-rose-400 uppercase tracking-tighter opacity-80">Riesgo:</span>
                    <span className="text-[9px] text-white tabular-nums tracking-tight">
                      $ {totalRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-sm text-gray-400 font-medium">Meta: {target}%</span>
              {/* Enhanced progress bar with gradient and glow */}
              <div className="w-28 h-2 bg-white/5 rounded-full mt-2 overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${statusInfo.bg} via-${statusInfo.text.replace('text-', '')}-500 to-${statusInfo.text.replace('text-', '')}-600 rounded-full transition-all duration-1000 ease-out relative`}
                  style={{
                    width: `${compliance}%`,
                    boxShadow: `0 0 10px ${statusInfo.glow}, 0 0 20px ${statusInfo.glow}`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart with enhanced styling - REDUCED HEIGHT FOR DUMA */}
          <div className="flex-1 relative min-h-[120px] max-h-[120px]">
            {/* Glassmorphism overlay on chart */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5 rounded-lg pointer-events-none"></div>

            {/* Update flash effect */}
            {isUpdating && (
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse rounded-lg pointer-events-none z-10"></div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                    setHoveredBar(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <defs>
                  <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barGradientYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barGradientRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff08"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                />

                <YAxis
                  domain={[0, 100]}
                  hide
                />

                <Tooltip
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ProcessData;
                      const change = data.previous ? data.real - data.previous : 0;
                      return (
                        <div style={{
                          background: 'rgba(10, 10, 10, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(59, 130, 246, 0.2)'
                        }}>
                          <p style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '4px', fontSize: '12px' }}>{data.name}</p>
                          <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                            {data.real}%
                            {change !== 0 && (
                              <span style={{
                                color: change > 0 ? '#10b981' : '#ef4444',
                                fontSize: '11px',
                                marginLeft: '6px'
                              }}>
                                {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar
                  dataKey="real"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                  animationBegin={0}
                  maxBarSize={50}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => {
                    const isHovered = hoveredBar === index;
                    const fillColor = entry.real >= 90
                      ? 'url(#barGradientGreen)'
                      : entry.real >= 80
                        ? 'url(#barGradientYellow)'
                        : 'url(#barGradientRed)';

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={fillColor}
                        opacity={isHovered ? 1 : 0.85}
                        style={{
                          filter: isHovered ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Animated process indicators with trend arrows */}
          <div className="flex justify-between mt-2 gap-1">
            {data.map((item, idx) => {
              const change = item.previous ? item.real - item.previous : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                  {/* Trend indicator */}
                  {change !== 0 && (
                    <div className={`text-[10px] font-bold transition-all duration-500 ${change > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                      {change > 0 ? '↑' : '↓'}
                    </div>
                  )}

                  {/* Progress bar */}
                  <div
                    className="w-full h-1 rounded-full overflow-hidden bg-white/5 transition-all duration-500"
                    style={{
                      transitionDelay: `${idx * 100}ms`,
                      opacity: isVisible ? 1 : 0
                    }}
                  >
                    <div
                      className={`h-full transition-all duration-800 ${item.real >= 90 ? 'bg-emerald-500' : item.real >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      style={{
                        width: `${item.real}%`,
                        boxShadow: `0 0 8px ${item.real >= 90 ? 'rgba(16, 185, 129, 0.5)' : item.real >= 80 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DUMA AI Alert Section - Always visible */}
          <div className="mt-4 animate-fade-in">
            <div className={`relative rounded-lg overflow-hidden backdrop-blur-sm border transition-all duration-500 ${lastAlert.severity === 'critical'
              ? 'bg-rose-500/5 border-rose-500/30'
              : 'bg-amber-500/5 border-amber-500/30'
              }`}>
              {/* Animated background pulse */}
              <div className={`absolute inset-0 opacity-20 animate-pulse-slow ${lastAlert.severity === 'critical'
                ? 'bg-gradient-to-r from-rose-500/20 to-transparent'
                : 'bg-gradient-to-r from-amber-500/20 to-transparent'
                }`}></div>

              <div className="relative z-10 p-3 flex items-start gap-2.5">
                {/* DUMA Icon/Badge - Clickeable */}
                <div className="flex-shrink-0 pt-0.5">
                  <button
                    onClick={() => setShowDumaPage(true)}
                    className={`px-2 py-1 rounded-md text-[8px] font-black tracking-wider flex items-center gap-1 transition-all duration-300 cursor-pointer ${lastAlert.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 hover:scale-105'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 hover:scale-105'
                      }`}
                    title="Abrir Centro de Notificaciones DUMA"
                  >
                    <span className="animate-pulse">●</span>
                    <span>DUMA</span>
                  </button>
                </div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${lastAlert.severity === 'critical'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                        }`}>
                        {lastAlert.severity === 'critical'
                          ? 'ALERTA CRÍTICA'
                          : 'ATENCIÓN REQUERIDA'}
                      </h4>
                      <p className="text-[10px] text-gray-300 leading-relaxed">
                        {lastAlert.message}
                      </p>
                    </div>

                    {/* Severity indicator */}
                    <div className={`flex-shrink-0 w-1 rounded-full self-stretch min-h-[32px] ${lastAlert.severity === 'critical'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                      }`} style={{
                        boxShadow: lastAlert.severity === 'critical'
                          ? '0 0 10px rgba(239, 68, 68, 0.5)'
                          : '0 0 10px rgba(245, 158, 11, 0.5)'
                      }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
      </div>

      {/* DUMA Intelligence Page - Portal to document.body for true full-screen modal */}
      {showDumaPage && ReactDOM.createPortal(
        <DumaPage onClose={() => setShowDumaPage(false)} />,
        document.body
      )}
    </>
  );
};

export default ProcessCompliance;
