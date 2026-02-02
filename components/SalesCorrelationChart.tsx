

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from 'recharts';
import DumaPage from './DumaPage';


// Datos de tendencia semanal - SOLO ventas sin cliente (anomalías)
const weeklyTrend = [
  { day: 'Lun', undetected: 8, totalSales: 150, riskRate: 5.3 },
  { day: 'Mar', undetected: 12, totalSales: 168, riskRate: 7.1 },
  { day: 'Mié', undetected: 6, totalSales: 155, riskRate: 3.9 },
  { day: 'Jue', undetected: 9, totalSales: 176, riskRate: 5.1 },
  { day: 'Vie', undetected: 14, totalSales: 203, riskRate: 6.9 },
  { day: 'Sáb', undetected: 11, totalSales: 212, riskRate: 5.2 },
  { day: 'Dom', undetected: 7, totalSales: 185, riskRate: 3.8 },
];

// Datos del día actual por horario - SOLO anomalías
const initialTodayData = [
  { hour: '08:00', undetected: 0, totalSales: 12, riskRate: 0, status: 'safe' },
  { hour: '09:00', undetected: 1, totalSales: 19, riskRate: 5.3, status: 'safe' },
  { hour: '10:00', undetected: 0, totalSales: 24, riskRate: 0, status: 'safe' },
  { hour: '11:00', undetected: 2, totalSales: 33, riskRate: 6.1, status: 'warning' },
  { hour: '12:00', undetected: 0, totalSales: 28, riskRate: 0, status: 'safe' },
  { hour: '13:00', undetected: 1, totalSales: 27, riskRate: 3.7, status: 'safe' },
  { hour: '14:00', undetected: 0, totalSales: 22, riskRate: 0, status: 'safe' },
  { hour: '15:00', undetected: 0, totalSales: 19, riskRate: 0, status: 'safe' },
];

const SalesCorrelationChart: React.FC = () => {
  const [view, setView] = useState<'week' | 'today'>('week');
  const [todayData, setTodayData] = useState(initialTodayData);
  const [lastAlert, setLastAlert] = useState<string | null>(null);
  const [alertAnimation, setAlertAnimation] = useState(false);
  const [showDumaPage, setShowDumaPage] = useState(false);

  // Estado para eventos de cajas específicas
  const [registerEvents, setRegisterEvents] = useState<Array<{
    time: string;
    register: string;
    type: 'normal' | 'anomaly';
    amount: number;
  }>>([]);

  // Estadísticas por caja (simuladas pero realistas)
  const [registerStats] = useState<Record<string, { total: number; anomalies: number; rate: number; trend: string }>>({
    'Caja 1': { total: 145, anomalies: 12, rate: 8.3, trend: 'increasing' },
    'Caja 2': { total: 167, anomalies: 3, rate: 1.8, trend: 'stable' },
    'Caja 3': { total: 189, anomalies: 8, rate: 4.2, trend: 'stable' },
    'Caja 4': { total: 156, anomalies: 15, rate: 9.6, trend: 'increasing' },
    'Caja 5': { total: 178, anomalies: 5, rate: 2.8, trend: 'decreasing' },
    'Caja 6': { total: 134, anomalies: 2, rate: 1.5, trend: 'stable' },
  });

  const [dumaAlert, setDumaAlert] = useState<{
    severity: 'critical' | 'warning' | 'info';
    message: string;
    registers?: string[];
    stats?: {
      totalSales: number;
      totalAnomalies: number;
      avgRate: number;
      worstRegister: string;
      bestRegister: string;
    };
  }>({
    severity: 'warning',
    message: 'Detección de anomalías en rango aceptable. Monitoreo continuo activo.'
  });


  // Simulación de detección en tiempo real (modo demo) - CON EVENTOS POR CAJA
  useEffect(() => {
    if (view !== 'today') return;

    const registers = ['Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Caja 5', 'Caja 6'];

    const interval = setInterval(() => {
      const randomEvent = Math.random();
      const selectedRegister = registers[Math.floor(Math.random() * registers.length)];
      const amount = Math.floor(Math.random() * 500) + 50; // Monto entre $50 y $550

      // 12% de probabilidad de detectar venta sin cliente (anomalía)
      if (randomEvent < 0.12) {
        setTodayData(prev => {
          const newData = [...prev];
          const lastIndex = newData.length - 1;

          // Agregar evento de riesgo (anomalía)
          const newUndetected = newData[lastIndex].undetected + 1;
          const newTotal = newData[lastIndex].totalSales + 1;
          const newRiskRate = (newUndetected / newTotal) * 100;

          newData[lastIndex] = {
            ...newData[lastIndex],
            undetected: newUndetected,
            totalSales: newTotal,
            riskRate: parseFloat(newRiskRate.toFixed(1)),
            status: 'alert'
          };

          return newData;
        });

        // Registrar evento de anomalía
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setRegisterEvents(prev => [
          {
            time: timeStr,
            register: selectedRegister,
            type: 'anomaly',
            amount: amount
          },
          ...prev.slice(0, 9) // Mantener solo los últimos 10 eventos
        ]);

        setLastAlert(`${timeStr} - ⚠️ ${selectedRegister}: Venta sin cliente ($${amount})`);
        setAlertAnimation(true);
        setTimeout(() => setAlertAnimation(false), 3000);
      } else {
        // Agregar venta normal (solo incrementa total, no anomalías)
        setTodayData(prev => {
          const newData = [...prev];
          const lastIndex = newData.length - 1;

          const newTotal = newData[lastIndex].totalSales + 1;
          const newRiskRate = (newData[lastIndex].undetected / newTotal) * 100;

          newData[lastIndex] = {
            ...newData[lastIndex],
            totalSales: newTotal,
            riskRate: parseFloat(newRiskRate.toFixed(1)),
            status: newData[lastIndex].undetected > 0 ? 'warning' : 'safe'
          };

          return newData;
        });

        // Registrar evento normal (opcional, para demo completo)
        if (Math.random() < 0.3) { // Solo registrar 30% de ventas normales para no saturar
          const now = new Date();
          const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          setRegisterEvents(prev => [
            {
              time: timeStr,
              register: selectedRegister,
              type: 'normal',
              amount: amount
            },
            ...prev.slice(0, 9)
          ]);
        }
      }
    }, 4000); // Cada 4 segundos simula una nueva venta

    return () => clearInterval(interval);
  }, [view]);

  // Actualizar alerta DUMA basada en métricas Y ESTADÍSTICAS POR CAJA
  useEffect(() => {
    const data = view === 'week' ? weeklyTrend : todayData;
    const totalUndetected = data.reduce((sum, d) => sum + d.undetected, 0);
    const totalSales = data.reduce((sum, d) => sum + d.totalSales, 0);
    const riskRate = parseFloat(((totalUndetected / totalSales) * 100).toFixed(1));

    // Calcular estadísticas globales de cajas
    const totalRegisterSales = (Object.values(registerStats) as Array<{ total: number; anomalies: number; rate: number; trend: string }>).reduce((sum, r) => sum + r.total, 0);
    const totalRegisterAnomalies = (Object.values(registerStats) as Array<{ total: number; anomalies: number; rate: number; trend: string }>).reduce((sum, r) => sum + r.anomalies, 0);
    const avgRegisterRate = parseFloat(((totalRegisterAnomalies / totalRegisterSales) * 100).toFixed(1));

    // Identificar cajas problemáticas (>7% anomalías)
    const problematicRegisters = (Object.entries(registerStats) as Array<[string, { total: number; anomalies: number; rate: number; trend: string }]>)
      .filter(([_, stats]) => stats.rate > 7)
      .map(([name]) => name);

    // Identificar mejor y peor caja
    const sortedByRate = (Object.entries(registerStats) as Array<[string, { total: number; anomalies: number; rate: number; trend: string }]>).sort((a, b) => b[1].rate - a[1].rate);
    const worstRegister = sortedByRate[0][0];
    const bestRegister = sortedByRate[sortedByRate.length - 1][0];

    if (riskRate > 10 || problematicRegisters.length >= 3) {
      setDumaAlert({
        severity: 'critical',
        message: `⚠️ ANÁLISIS CRÍTICO - Tasa global: ${riskRate}% | ${problematicRegisters.length} cajas con desviación crítica (${problematicRegisters.join(', ')}). ${worstRegister} presenta ${registerStats[worstRegister].rate}% de anomalías con tendencia ${registerStats[worstRegister].trend === 'increasing' ? 'creciente ⬆️' : 'estable'}. ACCIÓN REQUERIDA: Verificar cámaras en ${problematicRegisters.join(', ')}, revisar iluminación y recalibrar modelo AI. Impacto estimado en pérdidas: Alto.`,
        registers: problematicRegisters,
        stats: {
          totalSales: totalRegisterSales,
          totalAnomalies: totalRegisterAnomalies,
          avgRate: avgRegisterRate,
          worstRegister,
          bestRegister
        }
      });
    } else if (riskRate > 5 || problematicRegisters.length >= 1) {
      setDumaAlert({
        severity: 'warning',
        message: `📊 ANÁLISIS DE DESVIACIÓN - Tasa global: ${riskRate}% | Cajas con atención requerida: ${problematicRegisters.length > 0 ? problematicRegisters.join(', ') : 'Ninguna'}. ${worstRegister} lidera con ${registerStats[worstRegister].rate}% vs ${bestRegister} con ${registerStats[bestRegister].rate}% (mejor performance). RECOMENDACIÓN: Revisar ángulos de cámara en ${worstRegister}, comparar configuración con ${bestRegister}. Tendencia: ${registerStats[worstRegister].trend === 'increasing' ? 'Requiere intervención' : 'Monitoreo continuo'}.`,
        registers: problematicRegisters,
        stats: {
          totalSales: totalRegisterSales,
          totalAnomalies: totalRegisterAnomalies,
          avgRate: avgRegisterRate,
          worstRegister,
          bestRegister
        }
      });
    } else if (riskRate > 2) {
      setDumaAlert({
        severity: 'info',
        message: `✓ ANÁLISIS OPERACIONAL - Tasa global: ${riskRate}% (Aceptable) | Distribución por cajas: ${worstRegister} ${registerStats[worstRegister].rate}% (máx) - ${bestRegister} ${registerStats[bestRegister].rate}% (mín). Sistema AI funcionando dentro de parámetros. ${totalRegisterSales} ventas procesadas, ${totalRegisterAnomalies} anomalías detectadas. Monitoreo preventivo activo en todas las cajas.`,
        registers: [],
        stats: {
          totalSales: totalRegisterSales,
          totalAnomalies: totalRegisterAnomalies,
          avgRate: avgRegisterRate,
          worstRegister,
          bestRegister
        }
      });
    } else {
      setDumaAlert({
        severity: 'info',
        message: `🎯 ESTADO ÓPTIMO - Tasa global: ${riskRate}% | Todas las cajas operando en rango óptimo. ${bestRegister} lidera con ${registerStats[bestRegister].rate}% de anomalías. Cobertura AI: Excelente. ${totalRegisterSales} ventas procesadas con ${avgRegisterRate}% de tasa promedio. Sistema de detección calibrado correctamente.`,
        registers: [],
        stats: {
          totalSales: totalRegisterSales,
          totalAnomalies: totalRegisterAnomalies,
          avgRate: avgRegisterRate,
          worstRegister,
          bestRegister
        }
      });
    }
  }, [view, todayData, registerStats]);


  // Calcular métricas
  const data = view === 'week' ? weeklyTrend : todayData;
  const totalUndetected = data.reduce((sum, d) => sum + d.undetected, 0);
  const totalSales = data.reduce((sum, d) => sum + d.totalSales, 0);
  const avgRiskRate = ((totalUndetected / totalSales) * 100).toFixed(1);

  // Calcular riesgo monetario ($150 promedio por anomalía)
  const financialRisk = Math.round(totalUndetected * 150);

  // Estado del KPI basado en % de ventas sin cliente
  const getStatus = (rate: number) => {
    if (rate <= 2) return {
      label: 'ÓPTIMO',
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      description: 'Anomalías mínimas'
    };
    if (rate <= 5) return {
      label: 'ACEPTABLE',
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      description: 'Dentro de rango'
    };
    if (rate <= 10) return {
      label: 'EN RIESGO',
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      description: 'Requiere atención'
    };
    return {
      label: 'CRÍTICO',
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      description: 'Acción inmediata'
    };
  };

  const status = getStatus(parseFloat(avgRiskRate));

  // Función para obtener color de barra según nivel de riesgo
  const getBarColor = (riskRate: number) => {
    if (riskRate === 0) return '#10b981'; // Verde - perfecto
    if (riskRate <= 2) return '#3b82f6'; // Azul - óptimo
    if (riskRate <= 5) return '#f59e0b'; // Ámbar - aceptable
    if (riskRate <= 10) return '#f97316'; // Naranja - riesgo
    return '#ef4444'; // Rojo - crítico
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const detected = data.totalSales - data.undetected;

      return (
        <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-lg shadow-xl">
          <div className="text-white font-bold mb-2">{data.day || data.hour}</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-400">Con Cliente:</span>
              <span className="text-white font-bold">{detected}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-gray-400">Sin Cliente (Anomalía):</span>
              <span className="text-white font-bold">{data.undetected}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-400">Total Ventas:</span>
              <span className="text-white font-bold">{data.totalSales}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10">
              <span className="text-gray-400">% Sin Cliente:</span>
              <span className={`font-bold ml-2 ${data.riskRate === 0 ? 'text-emerald-400' :
                data.riskRate <= 2 ? 'text-blue-400' :
                  data.riskRate <= 5 ? 'text-amber-400' :
                    data.riskRate <= 10 ? 'text-orange-400' :
                      'text-rose-400'
                }`}>
                {data.riskRate}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col min-h-0">
        {/* Header con controles - MÁS COMPACTO */}
        <div className="flex gap-2 mb-2">
          {/* Financial Risk Badge - ÚNICO BADGE DE ESTADO */}
          <div className={`${parseFloat(avgRiskRate) > 5 ? 'bg-rose-500/10 border-rose-500/30' : parseFloat(avgRiskRate) > 2 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} border p-2 rounded-lg flex-1`}>
            <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-0.5">
              <span className="inline-flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                RIESGO
              </span>
            </div>
            <div className={`text-sm font-black ${parseFloat(avgRiskRate) > 5 ? 'text-rose-400' : parseFloat(avgRiskRate) > 2 ? 'text-amber-400' : 'text-emerald-400'} flex items-center gap-1`}>
              <span className="text-[10px]">$</span>
              {financialRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* % Ventas sin Cliente */}
          <div className={`${status.bgColor} border ${status.borderColor} p-2 rounded-lg flex-1`}>
            <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-0.5">% Sin Cliente</div>
            <div className={`text-lg font-black ${status.textColor}`}>
              {avgRiskRate}%
              <span className="text-[10px] text-gray-400 ml-1">
                {parseFloat(avgRiskRate) <= 2 ? '✓' : parseFloat(avgRiskRate) <= 5 ? '◐' : '⚠'}
              </span>
            </div>
          </div>

          {/* Total Anomalías */}
          <div className={`${alertAnimation ? 'bg-rose-500/20 animate-pulse' : 'bg-rose-500/10'} border ${alertAnimation ? 'border-rose-500/40' : 'border-rose-500/20'} p-2 rounded-lg flex-1 transition-all duration-300`}>
            <div className="text-[9px] text-rose-400 font-bold tracking-widest uppercase mb-0.5">Anomalías</div>
            <div className="text-lg font-black text-white">
              {totalUndetected}
              <span className="text-[10px] text-gray-400 ml-1">
                / {totalSales}
              </span>
            </div>
          </div>

          {/* Selector de Vista */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-lg flex flex-col gap-0.5">
            <button
              onClick={() => setView('week')}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${view === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-gray-400 hover:text-white'
                }`}
            >
              SEMANA
            </button>
            <button
              onClick={() => setView('today')}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${view === 'today'
                ? 'bg-emerald-500 text-white'
                : 'bg-transparent text-gray-400 hover:text-white'
                }`}
            >
              HOY
            </button>
          </div>
        </div>

        {/* Alerta en tiempo real */}
        {lastAlert && view === 'today' && (
          <div className={`mb-1.5 p-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] transition-all duration-300 ${alertAnimation
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">{lastAlert}</span>
            <span className="ml-auto text-[9px] opacity-60">LIVE</span>
          </div>
        )}

        {/* Chart - Altura optimizada */}
        <div className="h-[140px] mb-1.5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis
                dataKey={view === 'week' ? 'day' : 'hour'}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                label={{ value: 'Anomalías', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                domain={[0, 15]}
                label={{ value: '% Riesgo', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
              />

              {/* Líneas de referencia */}
              <ReferenceLine
                yAxisId="right"
                y={2}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: 'Óptimo: 2%', fill: '#10b981', fontSize: 9, position: 'right' }}
              />
              <ReferenceLine
                yAxisId="right"
                y={5}
                stroke="#3b82f6"
                strokeDasharray="3 3"
                label={{ value: 'Aceptable: 5%', fill: '#3b82f6', fontSize: 9, position: 'right' }}
              />
              <ReferenceLine
                yAxisId="right"
                y={10}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{ value: 'Crítico: 10%', fill: '#f59e0b', fontSize: 9, position: 'right' }}
              />

              {/* Barras de anomalías (ventas sin cliente) */}
              <Bar
                yAxisId="left"
                dataKey="undetected"
                fill="url(#colorRisk)"
                strokeWidth={2}
                name="Ventas sin Cliente (Anomalías)"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    stroke={getBarColor(entry.riskRate)}
                    fill={entry.status === 'alert' ? '#ef4444' : 'url(#colorRisk)'}
                    className={entry.status === 'alert' ? 'animate-pulse' : ''}
                  />
                ))}
              </Bar>

              {/* Línea de % de riesgo */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="riskRate"
                stroke="#f59e0b"
                strokeWidth={3}
                name="% Ventas sin Cliente"
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Info - Compacto */}
        <div className="mt-1 pt-1 border-t border-white/5 flex justify-between text-[9px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              <span className="text-rose-400 font-bold">{totalUndetected}</span> anomalías
            </span>
            <span>•</span>
            <span>
              <span className="text-emerald-400 font-bold">{totalSales - totalUndetected}</span> normales
            </span>
            {view === 'today' && (
              <>
                <span>•</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  MODO DEMO EN VIVO
                </span>
              </>
            )}
          </div>
          <div>
            {view === 'week' ? 'Última semana' : 'Hoy'}: <span className="text-white font-bold">{totalSales}</span> ventas totales
          </div>
        </div>

        {/* DUMA AI Alert Section - Compacto */}
        <div className="mt-1.5 animate-fade-in">
          <div className={`relative rounded-lg overflow-hidden backdrop-blur-sm border transition-all duration-500 ${dumaAlert.severity === 'critical'
            ? 'bg-rose-500/5 border-rose-500/30'
            : dumaAlert.severity === 'warning'
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-blue-500/5 border-blue-500/30'
            }`}>
            {/* Animated background pulse */}
            <div className={`absolute inset-0 opacity-20 animate-pulse-slow ${dumaAlert.severity === 'critical'
              ? 'bg-gradient-to-r from-rose-500/20 to-transparent'
              : dumaAlert.severity === 'warning'
                ? 'bg-gradient-to-r from-amber-500/20 to-transparent'
                : 'bg-gradient-to-r from-blue-500/20 to-transparent'
              }`}></div>

            <div className="relative z-10 p-1.5 flex items-start gap-1.5">
              {/* DUMA Icon/Badge - Clickeable */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowDumaPage(true)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center gap-0.5 transition-all duration-300 cursor-pointer ${dumaAlert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 hover:scale-105'
                    : dumaAlert.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 hover:scale-105'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 hover:scale-105'
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
                    <h4 className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${dumaAlert.severity === 'critical'
                      ? 'text-rose-400'
                      : dumaAlert.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                      }`}>
                      {dumaAlert.severity === 'critical'
                        ? '🚨 ALERTA CRÍTICA - VISIÓN AI'
                        : dumaAlert.severity === 'warning'
                          ? '⚠️ ATENCIÓN REQUERIDA - VISIÓN AI'
                          : '✓ SISTEMA OPERANDO NORMALMENTE'}
                    </h4>
                    <p className="text-[9px] text-gray-300 leading-tight">
                      {dumaAlert.message}
                    </p>
                  </div>

                  {/* Severity indicator */}
                  <div className={`flex-shrink-0 w-1 rounded-full self-stretch min-h-[24px] ${dumaAlert.severity === 'critical'
                    ? 'bg-rose-500'
                    : dumaAlert.severity === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                    }`} style={{
                      boxShadow: dumaAlert.severity === 'critical'
                        ? '0 0 10px rgba(239, 68, 68, 0.5)'
                        : dumaAlert.severity === 'warning'
                          ? '0 0 10px rgba(245, 158, 11, 0.5)'
                          : '0 0 10px rgba(59, 130, 246, 0.5)'
                    }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
      </div>

      {/* DUMA Intelligence Page - Portal to document.body for true full-screen modal */}
      {
        showDumaPage && ReactDOM.createPortal(
          <DumaPage
            onClose={() => setShowDumaPage(false)}
            visionData={{
              events: registerEvents,
              registerStats: registerStats,
              alert: dumaAlert
            }}
          />,
          document.body
        )
      }
    </>
  );
};

export default SalesCorrelationChart;
