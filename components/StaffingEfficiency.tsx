
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DumaPage from './DumaPage';

interface StaffProfile {
  name: string;
  assigned: number;        // Plantilla asignada
  attendance: number;      // Asistencia registrada (check-in)
  aiValidated: number;     // Validados por AI Vision (permanencia real)
  status: 'critical' | 'warning' | 'optimal';
  ghostWorkers: number;    // Personal que solo registró entrada/salida
}

const StaffingEfficiency: React.FC = () => {
  const [showDumaPage, setShowDumaPage] = useState(false);

  const profiles: StaffProfile[] = [
    {
      name: 'Cajas',
      assigned: 12,
      attendance: 10,
      aiValidated: 8,
      status: 'critical',
      ghostWorkers: 2  // 10 registraron asistencia, pero solo 8 permanecieron
    },
    {
      name: 'Perecederos',
      assigned: 6,
      attendance: 6,
      aiValidated: 5,
      status: 'warning',
      ghostWorkers: 1
    },
    {
      name: 'Surtido Nocturno',
      assigned: 15,
      attendance: 15,
      aiValidated: 14,
      status: 'optimal',
      ghostWorkers: 1
    },
    {
      name: 'Prevención',
      assigned: 8,
      attendance: 8,
      aiValidated: 8,
      status: 'optimal',
      ghostWorkers: 0
    },
    {
      name: 'Recibo',
      assigned: 4,
      attendance: 3,
      aiValidated: 2,
      status: 'critical',
      ghostWorkers: 1
    },
  ];

  // Calcular totales
  const totalAssigned = profiles.reduce((sum, p) => sum + p.assigned, 0);
  const totalAttendance = profiles.reduce((sum, p) => sum + p.attendance, 0);
  const totalAiValidated = profiles.reduce((sum, p) => sum + p.aiValidated, 0);
  const totalGhostWorkers = profiles.reduce((sum, p) => sum + p.ghostWorkers, 0);

  // Calcular tasas
  const attendanceRate = ((totalAttendance / totalAssigned) * 100).toFixed(1);
  const validationRate = ((totalAiValidated / totalAttendance) * 100).toFixed(1);
  const ghostRate = ((totalGhostWorkers / totalAttendance) * 100).toFixed(1);

  // Identificar perfiles críticos
  const criticalProfiles = profiles.filter(p => p.status === 'critical');
  const profilesWithGhosts = profiles.filter(p => p.ghostWorkers > 0);

  // Preparar datos para DUMA
  const staffingData = {
    profiles: profiles,
    totals: {
      assigned: totalAssigned,
      attendance: totalAttendance,
      aiValidated: totalAiValidated,
      ghostWorkers: totalGhostWorkers
    },
    rates: {
      attendance: parseFloat(attendanceRate),
      validation: parseFloat(validationRate),
      ghost: parseFloat(ghostRate)
    },
    alert: {
      severity: (totalGhostWorkers >= 3 || criticalProfiles.length >= 2) ? 'critical' as const :
        (totalGhostWorkers >= 1 || criticalProfiles.length >= 1) ? 'warning' as const :
          'info' as const,
      message: totalGhostWorkers >= 3
        ? `⚠️ ALERTA CRÍTICA - ${totalGhostWorkers} empleados detectados con registro fantasma (${ghostRate}%). ${criticalProfiles.map(p => p.name).join(', ')} presentan déficit crítico. ACCIÓN INMEDIATA: Verificar sistema de asistencia y validar permanencia con supervisores.`
        : totalGhostWorkers >= 1
          ? `📊 ATENCIÓN REQUERIDA - ${totalGhostWorkers} empleados con registro de entrada/salida pero sin permanencia validada por AI (${ghostRate}%). Perfiles afectados: ${profilesWithGhosts.map(p => p.name).join(', ')}. RECOMENDACIÓN: Revisar cámaras de validación y políticas de permanencia.`
          : `✓ SISTEMA OPERANDO CORRECTAMENTE - ${totalAiValidated} de ${totalAttendance} empleados validados por AI Vision (${validationRate}%). Todos los perfiles operando dentro de parámetros normales.`,
      criticalProfiles: criticalProfiles.map(p => p.name),
      ghostProfiles: profilesWithGhosts.map(p => ({ name: p.name, count: p.ghostWorkers }))
    }
  };

  // Calcular riesgo de pago por ghost workers
  const dailyGhostCost = totalGhostWorkers * 8 * 15; // Ghost workers × 8h × $15/h
  const monthlyGhostCost = dailyGhostCost * 30;

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        {/* MÉTRICAS PRINCIPALES - ARRIBA */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* Inasistencia */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Inasistencia</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-xl font-black ${(totalAssigned - totalAttendance) === 0 ? 'text-emerald-400' :
                  (totalAssigned - totalAttendance) <= 2 ? 'text-amber-400' :
                    'text-rose-400'
                }`}>
                {totalAssigned - totalAttendance}
              </div>
              <div className="text-[9px] text-gray-400">
                {((totalAssigned - totalAttendance) / totalAssigned * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Ghost Workers */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">👻 Ghosts</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-xl font-black ${totalGhostWorkers === 0 ? 'text-emerald-400' :
                  totalGhostWorkers <= 2 ? 'text-amber-400' :
                    'text-rose-400'
                }`}>
                {totalGhostWorkers}
              </div>
              <div className="text-[9px] text-gray-400">
                {ghostRate}%
              </div>
            </div>
          </div>

          {/* Riesgo de Pago */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Riesgo</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-sm font-black ${totalGhostWorkers === 0 ? 'text-emerald-400' :
                  totalGhostWorkers <= 2 ? 'text-amber-400' :
                    'text-rose-400'
                }`}>
                ${dailyGhostCost.toLocaleString()}
              </div>
              <div className="text-[9px] text-gray-400">
                /día
              </div>
            </div>
          </div>
        </div>

        {/* Perfiles de Personal */}
        <div className="space-y-2.5 overflow-y-auto max-h-[230px] pr-2 custom-scrollbar">
          {profiles.map((profile, i) => {
            const attendancePercent = (profile.attendance / profile.assigned) * 100;
            const validationPercent = (profile.aiValidated / profile.assigned) * 100;

            return (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {profile.name}
                  </span>
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    <span className="text-gray-500">
                      {profile.attendance}/{profile.assigned}
                      <span className="text-[8px] ml-0.5">REG</span>
                    </span>
                    <span className={`${profile.aiValidated === profile.attendance ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {profile.aiValidated}
                      <span className="text-[8px] ml-0.5">AI✓</span>
                    </span>
                  </div>
                </div>

                {/* Barra de progreso dual */}
                <div className="space-y-1">
                  {/* Asistencia Registrada */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-1000 ${profile.status === 'critical' ? 'bg-rose-500/50' :
                        profile.status === 'warning' ? 'bg-amber-500/50' :
                          'bg-emerald-500/50'
                        }`}
                      style={{ width: `${attendancePercent}%` }}
                    ></div>
                  </div>

                  {/* Validación AI Vision */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-1000 ${profile.status === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                        profile.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                          'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        }`}
                      style={{ width: `${validationPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Indicador de "Ghost Workers" */}
                {profile.ghostWorkers > 0 && (
                  <div className="mt-1 text-[9px] text-rose-400 flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {profile.ghostWorkers} sin permanencia
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DUMA AI Alert Section */}
        <div className="mt-2 animate-fade-in">
          <div className={`relative rounded-lg overflow-hidden backdrop-blur-sm border transition-all duration-500 ${staffingData.alert.severity === 'critical'
            ? 'bg-rose-500/5 border-rose-500/30'
            : staffingData.alert.severity === 'warning'
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-blue-500/5 border-blue-500/30'
            }`}>
            {/* Animated background pulse */}
            <div className={`absolute inset-0 opacity-20 animate-pulse-slow ${staffingData.alert.severity === 'critical'
              ? 'bg-gradient-to-r from-rose-500/20 to-transparent'
              : staffingData.alert.severity === 'warning'
                ? 'bg-gradient-to-r from-amber-500/20 to-transparent'
                : 'bg-gradient-to-r from-blue-500/20 to-transparent'
              }`}></div>

            <div className="relative z-10 p-1.5 flex items-start gap-1.5">
              {/* DUMA Icon/Badge - Clickeable */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowDumaPage(true)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center gap-0.5 transition-all duration-300 cursor-pointer ${staffingData.alert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 hover:scale-105'
                    : staffingData.alert.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 hover:scale-105'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 hover:scale-105'
                    }`}
                  title="Abrir Panel DUMA"
                >
                  <span className="animate-pulse">●</span>
                  <span>DUMA</span>
                </button>
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${staffingData.alert.severity === 'critical'
                      ? 'text-rose-400'
                      : staffingData.alert.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                      }`}>
                      {staffingData.alert.severity === 'critical'
                        ? '⚠️ VALIDACIÓN CRÍTICA - AI VISION'
                        : staffingData.alert.severity === 'warning'
                          ? '⚠️ ATENCIÓN REQUERIDA - PERMANENCIA'
                          : '✓ VALIDACIÓN OPERANDO NORMALMENTE'}
                    </h4>
                    <p className="text-[9px] text-gray-300 leading-tight">
                      {staffingData.alert.message}
                    </p>
                  </div>

                  {/* Severity indicator */}
                  <div className={`flex-shrink-0 w-1 rounded-full self-stretch min-h-[24px] ${staffingData.alert.severity === 'critical'
                    ? 'bg-rose-500'
                    : staffingData.alert.severity === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                    }`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DUMA Intelligence Page - Portal */}
      {showDumaPage && ReactDOM.createPortal(
        <DumaPage
          onClose={() => setShowDumaPage(false)}
          staffingData={staffingData}
        />,
        document.body
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};

export default StaffingEfficiency;
