
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DumaPage from './DumaPage';

interface ProductCategory {
  name: string;
  totalSpaces: number;      // Espacios totales en anaquel
  gaps: number;              // Huecos totales
  operationalGaps: number;   // Huecos operativos (planograma permite vacío)
  stockoutGaps: number;      // Huecos por falta de stock
  status: 'critical' | 'warning' | 'optimal';
}

const ProductExhibition: React.FC = () => {
  const [showDumaPage, setShowDumaPage] = useState(false);

  const categories: ProductCategory[] = [
    {
      name: 'Perecederos',
      totalSpaces: 150,
      gaps: 15,
      operationalGaps: 5,   // 5 espacios vacíos permitidos por planograma
      stockoutGaps: 10,     // 10 espacios vacíos por falta de producto
      status: 'warning'
    },
    {
      name: 'Lácteos',
      totalSpaces: 120,
      gaps: 25,
      operationalGaps: 3,
      stockoutGaps: 22,     // Crítico: 22 espacios sin producto
      status: 'critical'
    },
    {
      name: 'Bebidas',
      totalSpaces: 180,
      gaps: 10,
      operationalGaps: 8,
      stockoutGaps: 2,
      status: 'optimal'
    },
    {
      name: 'Snacks',
      totalSpaces: 100,
      gaps: 12,
      operationalGaps: 4,
      stockoutGaps: 8,
      status: 'warning'
    },
  ];

  // Calcular totales
  const totalSpaces = categories.reduce((sum, c) => sum + c.totalSpaces, 0);
  const totalOccupied = categories.reduce((sum, c) => sum + (c.totalSpaces - c.gaps), 0);
  const totalGaps = categories.reduce((sum, c) => sum + c.gaps, 0);
  const totalOperationalGaps = categories.reduce((sum, c) => sum + c.operationalGaps, 0);
  const totalStockoutGaps = categories.reduce((sum, c) => sum + c.stockoutGaps, 0);

  // Calcular tasas
  const availabilityRate = ((totalOccupied / totalSpaces) * 100).toFixed(1);
  const gapRate = ((totalGaps / totalSpaces) * 100).toFixed(1);
  const stockoutRate = ((totalStockoutGaps / totalSpaces) * 100).toFixed(1);

  // Identificar categorías críticas
  const criticalCategories = categories.filter(c => c.status === 'critical');
  const warningCategories = categories.filter(c => c.status === 'warning');

  // Calcular pérdida estimada por stockout ($50 promedio por espacio vacío por día)
  const dailyLoss = totalStockoutGaps * 50;

  // Preparar datos para DUMA
  const exhibitionData = {
    categories: categories.map(c => ({
      ...c,
      occupied: c.totalSpaces - c.gaps
    })),
    totals: {
      spaces: totalSpaces,
      occupied: totalOccupied,
      gaps: totalGaps,
      operationalGaps: totalOperationalGaps,
      stockoutGaps: totalStockoutGaps
    },
    rates: {
      availability: parseFloat(availabilityRate),
      gap: parseFloat(gapRate),
      stockout: parseFloat(stockoutRate)
    },
    alert: {
      severity: (totalStockoutGaps >= 20 || criticalCategories.length >= 2) ? 'critical' as const :
        (totalStockoutGaps >= 10 || criticalCategories.length >= 1) ? 'warning' as const :
          'info' as const,
      message: totalStockoutGaps >= 20
        ? `⚠️ ALERTA CRÍTICA - ${totalStockoutGaps} espacios sin producto detectados (${stockoutRate}%). ${criticalCategories.map(c => c.name).join(', ')} con desabasto crítico. ACCIÓN INMEDIATA: Verificar inventario y reposición urgente.`
        : totalStockoutGaps >= 10
          ? `📊 ATENCIÓN REQUERIDA - ${totalStockoutGaps} espacios vacíos por falta de stock (${stockoutRate}%). Categorías afectadas: ${[...criticalCategories, ...warningCategories].map(c => c.name).join(', ')}. RECOMENDACIÓN: Revisar proceso de reposición.`
          : `✓ EXHIBICIÓN ÓPTIMA - ${totalOccupied} de ${totalSpaces} espacios ocupados (${availabilityRate}%). Sistema de detección AI operando correctamente.`,
      criticalCategories: criticalCategories.map(c => c.name),
      stockoutCategories: [...criticalCategories, ...warningCategories].map(c => ({
        name: c.name,
        stockoutGaps: c.stockoutGaps,
        rate: ((c.stockoutGaps / c.totalSpaces) * 100).toFixed(1)
      }))
    }
  };

  return (
    <>
      <div className="h-full flex flex-col justify-between">
        {/* MÉTRICAS PRINCIPALES - ARRIBA */}
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {/* Huecos Totales */}
          <div className="bg-white/5 p-1 rounded-lg border border-white/10">
            <div className="text-[7px] text-gray-500 uppercase tracking-widest mb-0.5">Total Huecos</div>
            <div className="flex items-baseline gap-1">
              <div className="text-sm font-black text-white">
                {totalGaps}
              </div>
              <div className="text-[8px] text-gray-400">{gapRate}%</div>
            </div>
          </div>

          {/* Huecos Operativos */}
          <div className="bg-white/5 p-1 rounded-lg border border-white/10">
            <div className="text-[7px] text-amber-500/80 uppercase tracking-widest mb-0.5">Operación</div>
            <div className="flex items-baseline gap-1">
              <div className="text-sm font-black text-amber-400">
                {totalOperationalGaps}
              </div>
              <div className="text-[8px] text-gray-400">{((totalOperationalGaps / totalSpaces) * 100).toFixed(1)}%</div>
            </div>
          </div>

          {/* Huecos por Stock */}
          <div className="bg-white/5 p-1 rounded-lg border border-white/10">
            <div className="text-[7px] text-rose-500/80 uppercase tracking-widest mb-0.5">Stockout</div>
            <div className="flex items-baseline gap-1">
              <div className="text-sm font-black text-rose-400">
                {totalStockoutGaps}
              </div>
              <div className="text-[8px] text-gray-400">{stockoutRate}%</div>
            </div>
          </div>

          {/* Riesgo Oportunidad (Pérdida de venta) */}
          <div className="bg-white/5 p-1 rounded-lg border border-white/10">
            <div className="text-[7px] text-gray-500 uppercase tracking-widest mb-0.5">Oportunidad</div>
            <div className="flex items-baseline gap-1">
              <div className={`text-sm font-black ${totalStockoutGaps === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${dailyLoss.toLocaleString()}
              </div>
              <div className="text-[7px] text-gray-400">/día</div>
            </div>
          </div>
        </div>

        {/* Categorías de Productos - ENFOQUE EN HUECOS */}
        <div className="space-y-2.5 overflow-y-auto max-h-[230px] pr-2 custom-scrollbar">
          {categories.map((category, i) => {
            const operationalPercent = category.gaps > 0 ? (category.operationalGaps / category.gaps) * 100 : 0;
            const stockoutPercent = category.gaps > 0 ? (category.stockoutGaps / category.gaps) * 100 : 0;

            return (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-2 text-[8px] font-mono">
                    <span className="text-gray-500 bg-white/5 px-1 rounded">
                      {category.gaps} <span className="text-[7px]">HUECOS</span>
                    </span>
                    <span className={`${category.stockoutGaps === 0 ? 'text-emerald-400' : 'text-rose-400'} bg-white/5 px-1 rounded`}>
                      {category.stockoutGaps} <span className="text-[7px]">STOCKOUT</span>
                    </span>
                    {category.stockoutGaps > 0 && (
                      <span className="text-rose-400/80 font-bold border-l border-white/10 pl-2">
                        -${(category.stockoutGaps * 50).toLocaleString()} <span className="text-[6px]">RIESGO/D</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de huecos - Solo muestra composición de vacíos */}
                <div className="space-y-1">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                    {/* Huecos operativos (permitidos por planograma) - AMARILLO */}
                    <div
                      className="h-full bg-amber-500/70"
                      style={{ width: `${operationalPercent}%` }}
                      title="Huecos operativos"
                    ></div>
                    {/* Huecos por falta de stock (requieren acción) - ROJO */}
                    <div
                      className="h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                      style={{ width: `${stockoutPercent}%` }}
                      title="Huecos por stockout"
                    ></div>
                  </div>
                </div>

                {/* Indicador de huecos por stock */}
                {category.stockoutGaps > 5 && (
                  <div className="mt-1 text-[9px] text-rose-400 flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {category.stockoutGaps} espacios sin producto
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DUMA AI Alert Section */}
        <div className="mt-2 animate-fade-in">
          <div className={`relative rounded-lg overflow-hidden backdrop-blur-sm border transition-all duration-500 ${exhibitionData.alert.severity === 'critical'
            ? 'bg-rose-500/5 border-rose-500/30'
            : exhibitionData.alert.severity === 'warning'
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-blue-500/5 border-blue-500/30'
            }`}>
            {/* Animated background pulse */}
            <div className={`absolute inset-0 opacity-20 animate-pulse-slow ${exhibitionData.alert.severity === 'critical'
              ? 'bg-gradient-to-r from-rose-500/20 to-transparent'
              : exhibitionData.alert.severity === 'warning'
                ? 'bg-gradient-to-r from-amber-500/20 to-transparent'
                : 'bg-gradient-to-r from-blue-500/20 to-transparent'
              }`}></div>

            <div className="relative z-10 p-1.5 flex items-start gap-1.5">
              {/* DUMA Icon/Badge - Clickeable */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowDumaPage(true)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center gap-0.5 transition-all duration-300 cursor-pointer ${exhibitionData.alert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 hover:scale-105'
                    : exhibitionData.alert.severity === 'warning'
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
                    <h4 className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${exhibitionData.alert.severity === 'critical'
                      ? 'text-rose-400'
                      : exhibitionData.alert.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                      }`}>
                      {exhibitionData.alert.severity === 'critical'
                        ? '⚠️ DESABASTO CRÍTICO - AI VISION'
                        : exhibitionData.alert.severity === 'warning'
                          ? '⚠️ ATENCIÓN REQUERIDA - REPOSICIÓN'
                          : '✓ EXHIBICIÓN OPERANDO NORMALMENTE'}
                    </h4>
                    <p className="text-[9px] text-gray-300 leading-tight">
                      {exhibitionData.alert.message}
                    </p>
                  </div>

                  {/* Severity indicator */}
                  <div className={`flex-shrink-0 w-1 rounded-full self-stretch min-h-[24px] ${exhibitionData.alert.severity === 'critical'
                    ? 'bg-rose-500'
                    : exhibitionData.alert.severity === 'warning'
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
          exhibitionData={exhibitionData}
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

export default ProductExhibition;
