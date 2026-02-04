
import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, ReferenceLine, PieChart, Pie
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface ExecutiveTrendsPageProps {
    onClose: () => void;
}

const trendData = [
    { week: 'Sem 01', risk: 45000, discipline: 82, availability: 88, thermal: 120 },
    { week: 'Sem 02', risk: 38000, discipline: 85, availability: 90, thermal: 95 },
    { week: 'Sem 03', risk: 52000, discipline: 78, availability: 85, thermal: 150 },
    { week: 'Sem 04', risk: 27700, discipline: 92, availability: 94, thermal: 65 },
];

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
                        <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">Executive Trend Intelligence</h1>
                        <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Análisis Comparativo Semanal - Corporate View</p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-surface-accent rounded-full transition-all text-text-muted hover:text-text-main"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
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
                                    ICOS
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
                                <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 uppercase font-bold">Índice de Cultura Operativa Sidon</p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black ${icosTrend > 0 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                            {icosTrend > 0 ? '▲' : '▼'} {Math.abs(icosTrend)} pts
                        </div>
                    </div>

                    <div className="flex items-center justify-between h-[180px] relative z-10 gap-8 mt-4">
                        {/* Gráfica de Tendencia Histórica - PRIORIZADA */}
                        <div className="flex-[3] h-full flex flex-col">
                            <p className="text-[9px] text-indigo-600/50 dark:text-indigo-300/50 font-black mb-2 uppercase tracking-[0.2em]">Evolución Cultural (4 Semanas)</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={icosCalculated}>
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

                        {/* Gauge Medidor - REUBICADO A LA ESQUINA */}
                        <div className="flex-1 h-full relative flex flex-col items-center justify-center border-l border-border-color pl-8">
                            <div className="w-full h-[120px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { value: currentICOS, fill: 'url(#icosGradient)' },
                                                { value: 100 - currentICOS, fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
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
                                    <span className="text-4xl font-black text-text-main leading-none">{currentICOS}</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 text-[8px] block font-black mt-1 tracking-[0.2em]">PUNTOS</span>
                                </div>
                            </div>
                            <div className="mt-2 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
                                <span className="text-indigo-600 dark:text-indigo-300 text-[9px] font-black tracking-widest uppercase">ÓPTIMO</span>
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

                {/* Card 2: Disciplina Operativa */}
                <div className="bg-surface-accent border border-border-color rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Disciplina Operativa</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                                <XAxis dataKey="week" stroke={theme === 'dark' ? '#555' : '#aaa'} fontSize={10} hide />
                                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0a0a0a' : '#fff', border: 'none' }} />
                                <Bar
                                    dataKey="discipline"
                                    label={{ position: 'top', fill: theme === 'dark' ? '#fff' : '#1e293b', fontSize: 10, fontWeight: 'bold' }}
                                >
                                    {trendData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.discipline > 90 ? '#10b981' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-text-main">92%</span>
                        <span className="text-emerald-500 dark:text-emerald-400 text-xs font-bold font-mono">META LOGRADA</span>
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

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      ` }} />
        </div>
    );
};

export default ExecutiveTrendsPage;
