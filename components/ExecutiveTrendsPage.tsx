
import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, ReferenceLine, PieChart, Pie
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface ExecutiveTrendsPageProps {
    onClose: () => void;
}

// Datos históricos por sucursal (últimas 4 semanas)
const branchHistoricalData: Record<string, Array<{ week: string; icos: number }>> = {
    'Plaza del Sol': [
        { week: 'Sem 01', icos: 79 },
        { week: 'Sem 02', icos: 81 },
        { week: 'Sem 03', icos: 80 },
        { week: 'Sem 04', icos: 82 },
    ],
    'Saucito': [
        { week: 'Sem 01', icos: 83 },
        { week: 'Sem 02', icos: 84 },
        { week: 'Sem 03', icos: 86 },
        { week: 'Sem 04', icos: 85 },
    ],
    'Suc la Villa': [
        { week: 'Sem 01', icos: 75 },
        { week: 'Sem 02', icos: 76 },
        { week: 'Sem 03', icos: 77 },
        { week: 'Sem 04', icos: 78 },
    ],
    'Capitan': [
        { week: 'Sem 01', icos: 88 },
        { week: 'Sem 02', icos: 90 },
        { week: 'Sem 03', icos: 91 },
        { week: 'Sem 04', icos: 92 },
    ],
    'Fuentes Mares': [
        { week: 'Sem 01', icos: 85 },
        { week: 'Sem 02', icos: 87 },
        { week: 'Sem 03', icos: 86 },
        { week: 'Sem 04', icos: 88 },
    ],
    'Esmeralda': [
        { week: 'Sem 01', icos: 84 },
        { week: 'Sem 02', icos: 86 },
        { week: 'Sem 03', icos: 85 },
        { week: 'Sem 04', icos: 87 },
    ],
};

const trendData = [
    { week: 'Sem 01', risk: 45000, discipline: 82, availability: 88, thermal: 120 },
    { week: 'Sem 02', risk: 38000, discipline: 85, availability: 90, thermal: 95 },
    { week: 'Sem 03', risk: 52000, discipline: 78, availability: 85, thermal: 150 },
    { week: 'Sem 04', risk: 27700, discipline: 92, availability: 94, thermal: 65 },
];

// Calcular ICOS promedio general
const icosCalculated = trendData.map(d => {
    const normRisk = Math.max(0, 100 - (d.risk / 600));
    const normThermal = Math.max(0, 100 - (Math.min(150, d.thermal) / 1.5));
    const score = (normRisk + d.discipline + d.availability + normThermal) / 4;
    return { ...d, icos: Math.round(score) };
});

const currentICOS = icosCalculated[icosCalculated.length - 1].icos;
const prevICOS = icosCalculated[icosCalculated.length - 2].icos;
const icosTrend = currentICOS - prevICOS;

const ExecutiveTrendsPage: React.FC<ExecutiveTrendsPageProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [showConfigModal, setShowConfigModal] = useState(false);

    // Obtener datos de tendencia según la sucursal seleccionada
    const displayedTrendData = selectedBranch
        ? branchHistoricalData[selectedBranch]
        : icosCalculated;

    const currentDisplayedICOS = selectedBranch
        ? branchHistoricalData[selectedBranch][3].icos
        : currentICOS;

    const prevDisplayedICOS = selectedBranch
        ? branchHistoricalData[selectedBranch][2].icos
        : prevICOS;

    const displayedTrend = currentDisplayedICOS - prevDisplayedICOS;

    return (
        <div className={`fixed inset-0 z-[100] ${theme === 'dark' ? 'bg-[#050505]/95' : 'bg-white/95'} backdrop-blur-xl flex flex-col animate-fade-in`}>
            {/* Header Ejecutivo */}
            <header className="px-8 py-6 border-b border-border-color flex justify-between items-center bg-surface-accent/40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">ICOS</h1>
                        <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Indice de cultura Sidon / Executive Trend Intelligence</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Settings Button */}
                    <button
                        onClick={() => setShowConfigModal(true)}
                        className="p-2 hover:bg-surface-accent rounded-full transition-all text-text-muted hover:text-text-main group"
                        title="Configuración"
                    >
                        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-accent rounded-full transition-all text-text-muted hover:text-text-main"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Grid de Tendencias */}
            <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">

                {/* Card 1: ICOS - Resumen Ejecutivo */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex items-start gap-2">
                            <div>
                                <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-tighter flex items-center gap-2">
                                    ICOS {selectedBranch && <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 rounded">→ {selectedBranch}</span>}
                                    <div className="group/info relative cursor-help">
                                        <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 opacity-60 hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-surface border border-border-color rounded-xl backdrop-blur-xl shadow-2xl opacity-0 translate-y-1 invisible group-hover/info:opacity-100 group-hover/info:translate-y-0 group-hover/info:visible transition-all z-[100]">
                                            <p className="text-[10px] text-indigo-600 dark:text-indigo-300 font-black uppercase mb-2 border-b border-indigo-500/30 pb-1">Composición del KPI</p>
                                            <ul className="space-y-1.5">
                                                <li className="flex justify-between text-[9px] text-text-muted"><span>• Riesgo Financiero</span> <span className="text-text-main font-bold">25%</span></li>
                                                <li className="flex justify-between text-[9px] text-text-muted"><span>• Disciplina Op.</span> <span className="text-text-main font-bold">25%</span></li>
                                                <li className="flex justify-between text-[9px] text-text-muted"><span>• Disponibilidad</span> <span className="text-text-main font-bold">25%</span></li>
                                                <li className="flex justify-between text-[9px] text-text-muted"><span>• Estabilidad Term.</span> <span className="text-text-main font-bold">25%</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </h3>
                                <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 uppercase font-bold">{selectedBranch ? `Tendencia Específica - ${selectedBranch}` : 'Índice de Cultura Operativa Sidon'}</p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black ${displayedTrend > 0 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                            {displayedTrend > 0 ? '▲' : '▼'} {Math.abs(displayedTrend)} pts
                        </div>
                    </div>

                    <div className="flex items-center justify-between h-[180px] relative z-10 gap-8 mt-4">
                        {/* Gráfica de Tendencia Histórica - DINÁMICA */}
                        <div className="flex-[3] h-full flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[9px] text-indigo-600/50 dark:text-indigo-300/50 font-black uppercase tracking-[0.2em]">Evolución Cultural (4 Semanas)</p>
                                {selectedBranch && (
                                    <button
                                        onClick={() => setSelectedBranch(null)}
                                        className="text-[8px] px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded text-indigo-600 dark:text-indigo-400 font-black transition-all"
                                    >
                                        VER PROMEDIO GENERAL
                                    </button>
                                )}
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayedTrendData}>
                                    <defs>
                                        <linearGradient id="icosTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                                    <XAxis dataKey="week" stroke={theme === 'dark' ? '#555' : '#aaa'} fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                    <Tooltip
                                        contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`, borderRadius: '8px', fontSize: '10px' }}
                                        itemStyle={{ color: '#6366f1' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="icos"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fill="url(#icosTrendGradient)"
                                        dot={{ r: 5, fill: '#6366f1', stroke: theme === 'dark' ? '#050505' : '#fff', strokeWidth: 2 }}
                                        activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                        label={{
                                            position: 'top',
                                            fill: '#6366f1',
                                            fontSize: 9,
                                            fontWeight: 'bold',
                                            offset: 10
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gauge Medidor - DINÁMICO */}
                        <div className="flex-1 h-full relative flex flex-col items-center justify-center border-l border-border-color pl-8">
                            <div className="w-full h-[120px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { value: currentDisplayedICOS, fill: 'url(#icosGradient)' },
                                                { value: 100 - currentDisplayedICOS, fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                                            ]}
                                            cx="50%"
                                            cy="85%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={45}
                                            outerRadius={60}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell key="val" />
                                            <Cell key="bg" />
                                        </Pie>
                                        <defs>
                                            <linearGradient id="icosGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute bottom-[15%] left-0 right-0 text-center">
                                    <span className="text-4xl font-black text-text-main leading-none">{currentDisplayedICOS}</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 text-[8px] block font-black mt-1 tracking-[0.2em]">PUNTOS</span>
                                </div>
                            </div>
                            <div className="mt-2 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                                <span className="text-indigo-600 dark:text-indigo-300 text-[9px] font-black tracking-widest uppercase">{currentDisplayedICOS >= 90 ? 'ÓPTIMO' : currentDisplayedICOS >= 80 ? 'BUENO' : 'REQUIERE ATENCIÓN'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border-color flex gap-8 relative z-10">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-[10px] text-text-secondary leading-tight">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">Mejorando:</span> Reducción de riesgo financiero y mayor disciplina operativa.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <p className="text-[10px] text-text-secondary leading-tight">
                                <span className="text-amber-600 dark:text-amber-500 font-bold uppercase">Aviso:</span> La estabilidad térmica requiere atención para optimizar el score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: ICOS por Sucursal - Premium Executive View */}
                <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    ICOS por Sucursal
                                    <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-[8px] font-black">
                                        CULTURA SIDON
                                    </div>
                                </h3>
                                <p className="text-[9px] text-blue-600/70 dark:text-blue-400/70 uppercase font-bold mt-1">Índice de Cultura Operativa</p>
                                <p className="text-[8px] text-text-muted mt-1 italic">💡 Haz clic en una sucursal para ver su tendencia</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-text-main">85%</div>
                                <div className="text-[8px] text-blue-500 dark:text-blue-400 font-black tracking-widest">PROMEDIO</div>
                            </div>
                        </div>

                        <div className="h-[200px] mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Plaza del Sol', icos: 82, shortName: 'P. Sol' },
                                        { name: 'Saucito', icos: 85, shortName: 'Saucito' },
                                        { name: 'Suc la Villa', icos: 78, shortName: 'La Villa' },
                                        { name: 'Capitan', icos: 92, shortName: 'Capitan' },
                                        { name: 'Fuentes Mares', icos: 88, shortName: 'F. Mares' },
                                        { name: 'Esmeralda', icos: 87, shortName: 'Esmeralda' },
                                    ]}
                                    margin={{ top: 20, right: 10, left: 10, bottom: 50 }}
                                >
                                    <defs>
                                        <linearGradient id="icosGreen" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="icosBlue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="icosYellow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="shortName"
                                        stroke={theme === 'dark' ? '#555' : '#aaa'}
                                        fontSize={11}
                                        fontWeight={700}
                                        tick={{ fill: theme === 'dark' ? '#9ca3af' : '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        domain={[0, 100]}
                                        hide
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background: theme === 'dark' ? 'rgba(10, 10, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                            border: `2px solid ${theme === 'dark' ? '#3b82f6' : '#60a5fa'}`,
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        }}
                                        labelStyle={{
                                            color: '#3b82f6',
                                            fontWeight: 'bold',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            marginBottom: '4px'
                                        }}
                                        itemStyle={{
                                            color: theme === 'dark' ? '#fff' : '#1e293b',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                        formatter={(value: number) => [`${value}%`, 'ICOS']}
                                        labelFormatter={(label) => {
                                            const fullNames: Record<string, string> = {
                                                'P. Sol': 'Plaza del Sol',
                                                'Saucito': 'Saucito',
                                                'La Villa': 'Sucursal la Villa',
                                                'Capitan': 'Capitan',
                                                'F. Mares': 'Fuentes Mares',
                                                'Esmeralda': 'Esmeralda'
                                            };
                                            return fullNames[label] || label;
                                        }}
                                    />

                                    <Bar
                                        dataKey="icos"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={60}
                                        label={{
                                            position: 'top',
                                            fill: theme === 'dark' ? '#fff' : '#1e293b',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            formatter: (value: number) => `${value}%`
                                        }}
                                    >
                                        {[
                                            { value: 82, fill: 'url(#icosBlue)', name: 'Plaza del Sol' },
                                            { value: 85, fill: 'url(#icosBlue)', name: 'Saucito' },
                                            { value: 78, fill: 'url(#icosYellow)', name: 'Suc la Villa' },
                                            { value: 92, fill: 'url(#icosGreen)', name: 'Capitan' },
                                            { value: 88, fill: 'url(#icosBlue)', name: 'Fuentes Mares' },
                                            { value: 87, fill: 'url(#icosBlue)', name: 'Esmeralda' }
                                        ].map((item, index) => {
                                            const isSelected = selectedBranch === item.name;
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={item.fill}
                                                    onClick={() => setSelectedBranch(item.name)}
                                                    style={{
                                                        filter: theme === 'dark'
                                                            ? isSelected
                                                                ? 'drop-shadow(0 6px 12px rgba(59, 130, 246, 0.6))'
                                                                : 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
                                                            : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        opacity: isSelected ? 1 : 0.85,
                                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                                                    }}
                                                />
                                            );
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend with status indicators */}
                        <div className="mt-4 pt-4 border-t border-border-color flex justify-between items-center text-[9px]">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                                    <span className="text-text-muted font-bold">Excelente (≥90%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                    <span className="text-text-muted font-bold">Bueno (80-89%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-400 to-amber-600"></div>
                                    <span className="text-text-muted font-bold">Requiere Atención (&lt;80%)</span>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded">
                                <span className="text-blue-600 dark:text-blue-400 font-black tracking-wider">META: 95%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Eficiencia de Exhibición */}
                <div className="bg-surface-accent border border-border-color rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4">Disponibilidad de Piso</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <XAxis dataKey="week" hide />
                                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: 'none' }} />
                                <Line
                                    type="stepAfter"
                                    dataKey="availability"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#f59e0b' }}
                                    label={{ position: 'top', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold', offset: 10 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-text-main">94.2%</span>
                        <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase underline">Reducción de Huecos</span>
                    </div>
                </div>

                {/* Card 4: Control Térmico */}
                <div className="bg-surface-accent border border-border-color rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-4">Estabilidad Operativa</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <XAxis dataKey="week" hide />
                                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: 'none' }} />
                                <ReferenceLine
                                    y={107.5}
                                    stroke="#0891b2"
                                    strokeDasharray="3 3"
                                    strokeOpacity={0.3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="thermal"
                                    stroke="#0891b2"
                                    strokeWidth={3}
                                    fill="#0891b2"
                                    fillOpacity={0.1}
                                    dot={{ r: 4, fill: '#0891b2', stroke: theme === 'dark' ? '#050505' : '#fff', strokeWidth: 1 }}
                                    label={{ position: 'top', fill: '#0891b2', fontSize: 10, fontWeight: 'bold', offset: 10 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-text-main">65m</span>
                        <span className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase italic">Mejora vs Promedio</span>
                    </div>
                </div>

                {/* Card 5: Riesgo Financiero Consolidado */}
                <div className="bg-surface-accent border border-border-color rounded-2xl p-6 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest line-clamp-1">Riesgo Total</h3>
                            <p className="text-text-muted text-[9px] uppercase">Financiero & Desabasto</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-text-main">$27,700</span>
                        </div>
                    </div>
                    <div className="h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRiskSmall" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                                <XAxis dataKey="week" hide />
                                <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
                                <Tooltip
                                    contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`, borderRadius: '8px' }}
                                    itemStyle={{ color: '#f43f5e', fontSize: '10px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    fill="url(#colorRiskSmall)"
                                    dot={{ r: 3, fill: '#f43f5e' }}
                                    label={{
                                        position: 'top',
                                        fill: '#f43f5e',
                                        fontSize: 9,
                                        fontWeight: 'bold',
                                        offset: 10,
                                        formatter: (v: number) => `$${(v / 1000).toFixed(1)}k`
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                        <span className="text-rose-600 dark:text-rose-500 text-[10px] block font-bold text-center bg-rose-500/10 py-1 rounded-lg uppercase tracking-wider">
                            -24% VS SEM PREVIA
                        </span>
                    </div>
                </div>

            </main>

            {/* Footer corporativo */}
            <footer className="p-8 border-t border-border-color flex justify-between items-center bg-surface-accent/20">
                <div className="text-[10px] text-text-muted uppercase font-mono tracking-widest">
                    Sidon Sense Executive Intelligence Unit • Generado el {new Date().toLocaleDateString()}
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-900/40 transition-all">
                        Exportar Reporte CEO
                    </button>
                </div>
            </footer>

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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Smart Audits</h3>
                                        <p className="text-xs text-text-muted mt-1">Procesos</p>
                                    </div>
                                    <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
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
                                        <p className="text-xs text-text-muted mt-1">Aperturas de Sucursal</p>
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

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      ` }} />
        </div>
    );
};

export default ExecutiveTrendsPage;
