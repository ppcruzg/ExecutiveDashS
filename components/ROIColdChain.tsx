
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DumaPage from './DumaPage';

interface ColdChainArea {
  name: string;
  currentTemp: number;
  targetTemp: number;
  timeOutsideRange: number; // minutes in the last 24h
  estimatedLoss: number;    // USD or MXN
  severity: 'critical' | 'warning' | 'optimal';
  energyWaste: number;      // percentage increase in energy consumption
}

const ROIColdChain: React.FC = () => {
  const [showDumaPage, setShowDumaPage] = useState(false);

  const areas: ColdChainArea[] = [
    {
      name: 'Cárnicos - Arcones',
      currentTemp: 4.8,
      targetTemp: 2.0,
      timeOutsideRange: 145, // 2.4 hours
      estimatedLoss: 12400,
      severity: 'critical',
      energyWaste: 18
    },
    {
      name: 'Lácteos - Murales',
      currentTemp: 5.2,
      targetTemp: 4.0,
      timeOutsideRange: 60,  // 1 hour
      estimatedLoss: 4500,
      severity: 'warning',
      energyWaste: 12
    },
    {
      name: 'Congelados - Islas',
      currentTemp: -18.5,
      targetTemp: -18.0,
      timeOutsideRange: 20,
      estimatedLoss: 0,
      severity: 'optimal',
      energyWaste: 5
    },
    {
      name: 'Perecederos - Frutas',
      currentTemp: 8.5,
      targetTemp: 5.0,
      timeOutsideRange: 180, // 3 hours
      estimatedLoss: 8200,
      severity: 'warning',
      energyWaste: 15
    },
  ];

  // Totals
  const totalLoss = areas.reduce((sum, a) => sum + a.estimatedLoss, 0);
  const avgTimeOutside = areas.reduce((sum, a) => sum + a.timeOutsideRange, 0) / areas.length;
  const criticalAreasCount = areas.filter(a => a.severity === 'critical').length;

  const coldChainData = {
    areas,
    totals: {
      loss: totalLoss,
      avgTimeOutside,
      criticalCount: criticalAreasCount
    },
    alert: {
      severity: criticalAreasCount > 0 ? 'critical' as const : 'warning' as const,
      message: criticalAreasCount > 0
        ? `🚨 RIESGO DE DESJUGUE DETECTADO - ${criticalAreasCount} áreas críticas superan el tiempo límite de exposición térmica. Pérdida potencial: $${totalLoss.toLocaleString()}.`
        : `⚠️ DESVIACIÓN TÉRMICA DETECTADA - El promedio de exposición fuera de rango es de ${avgTimeOutside.toFixed(0)} min. Se recomienda ajuste preventivo en compresores.`,
    }
  };

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        {/* MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* Tiempo Excedido */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Tiempo Excedido</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-xl font-black ${avgTimeOutside > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                {avgTimeOutside.toFixed(0)}
              </div>
              <div className="text-[9px] text-gray-400">min/avg</div>
            </div>
          </div>

          {/* Riesgo de Merma */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Riesgo Merma</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-xl font-black ${totalLoss > 10000 ? 'text-rose-400' : 'text-amber-400'}`}>
                ${(totalLoss / 1000).toFixed(1)}k
              </div>
              <div className="text-[9px] text-gray-400">MXN</div>
            </div>
          </div>

          {/* Desjugue/Degradación */}
          <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-0.5">Alertas</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-xl font-black ${criticalAreasCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {criticalAreasCount}
              </div>
              <div className="text-[9px] text-gray-400">áreas</div>
            </div>
          </div>
        </div>

        {/* Detalle por Área */}
        <div className="space-y-2 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
          {areas.map((area, i) => {
            const timePercent = Math.min((area.timeOutsideRange / 180) * 100, 100); // 180 min as 100% ref

            return (
              <div key={i} className="group border-b border-white/5 pb-2 last:border-0">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {area.name}
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase">
                      Act: {area.currentTemp}° / Set: {area.targetTemp}°
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-mono font-bold ${area.severity === 'critical' ? 'text-rose-400' :
                        area.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                      {area.timeOutsideRange}m OUT
                    </span>
                    <span className="text-[7px] text-gray-500">
                      Riesgo: ${area.estimatedLoss.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Time outside range bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className={`h-full transition-all duration-1000 ${area.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                        area.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500/30'
                      }`}
                    style={{ width: `${timePercent}%` }}
                  ></div>
                </div>

                {/* Micro-insights */}
                <div className="flex justify-between mt-0.5">
                  <span className="text-[7px] text-rose-300/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {area.energyWaste}% exceso energía
                  </span>
                  {area.severity === 'critical' && (
                    <span className="text-[7px] text-rose-500 animate-pulse font-black uppercase">
                      Detección Desjugue Inminente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DUMA AI Alert Section */}
        <div className="mt-2 animate-fade-in">
          <div className={`relative rounded-lg overflow-hidden backdrop-blur-sm border transition-all duration-500 ${coldChainData.alert.severity === 'critical'
              ? 'bg-rose-500/5 border-rose-500/30'
              : 'bg-amber-500/5 border-amber-500/30'
            }`}>
            <div className={`absolute inset-0 opacity-20 animate-pulse-slow ${coldChainData.alert.severity === 'critical' ? 'bg-rose-500/20' : 'bg-amber-500/20'
              }`}></div>

            <div className="relative z-10 p-1.5 flex items-start gap-1.5 grayscale-[0.5] hover:grayscale-0 transition-all">
              <button
                onClick={() => setShowDumaPage(true)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center gap-0.5 transition-all ${coldChainData.alert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
              >
                <span className="animate-pulse">●</span>
                <span>DUMA</span>
              </button>

              <div className="flex-1 min-w-0">
                <h4 className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${coldChainData.alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                  {coldChainData.alert.severity === 'critical' ? 'Riesgo Crítico de Merma' : 'Alerta Térmica Preventiva'}
                </h4>
                <p className="text-[9px] text-gray-300 leading-tight truncate">
                  {coldChainData.alert.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDumaPage && ReactDOM.createPortal(
        <DumaPage
          onClose={() => setShowDumaPage(false)}
          coldChainData={coldChainData}
        />,
        document.body
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
      `}</style>
    </>
  );
};

export default ROIColdChain;
