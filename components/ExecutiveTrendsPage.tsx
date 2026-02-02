
import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';

interface ExecutiveTrendsPageProps {
    onClose: () => void;
}

const trendData = [
    { week: 'Sem 01', risk: 45000, discipline: 82, availability: 88, thermal: 120 },
    { week: 'Sem 02', risk: 38000, discipline: 85, availability: 90, thermal: 95 },
    { week: 'Sem 03', risk: 52000, discipline: 78, availability: 85, thermal: 150 },
    { week: 'Sem 04', risk: 27700, discipline: 92, availability: 94, thermal: 65 },
];

const ExecutiveTrendsPage: React.FC<ExecutiveTrendsPageProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-xl flex flex-col animate-fade-in">
            {/* Header Ejecutivo */}
            <header className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Executive Trend Intelligence</h1>
                        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Análisis Comparativo Semanal - Corporate View</p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-white"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            {/* Grid de Tendencias */}
            <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">

                {/* Card 1: Riesgo Financiero Consolidado */}
                <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest">Tendencia de Riesgo Total</h3>
                            <p className="text-gray-500 text-[10px] uppercase">Impacto monetario por ineficiencias y desabasto</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">$27,700</span>
                            <span className="text-rose-500 text-xs block font-bold">-24% vs semana previa</span>
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="week" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f43f5e', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Card 2: Disciplina Operativa */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4">Disciplina Operativa</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="week" stroke="#555" fontSize={10} hide />
                                <Tooltip contentStyle={{ background: '#0a0a0a', border: 'none' }} />
                                <Bar dataKey="discipline">
                                    {trendData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.discipline > 90 ? '#10b981' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-white">92%</span>
                        <span className="text-emerald-400 text-xs font-bold font-mono">META LOGRADA</span>
                    </div>
                </div>

                {/* Card 3: Eficiencia de Exhibición */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-4">Disponibilidad de Piso</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <XAxis dataKey="week" hide />
                                <Tooltip contentStyle={{ background: '#0a0a0a', border: 'none' }} />
                                <Line type="stepAfter" dataKey="availability" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-white">94.2%</span>
                        <span className="text-amber-400 text-xs font-bold uppercase underline">Reducción de Huecos</span>
                    </div>
                </div>

                {/* Card 4: Control Térmico */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-4">Estabilidad de Frío</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <XAxis dataKey="week" hide />
                                <Tooltip contentStyle={{ background: '#0a0a0a', border: 'none' }} />
                                <Area type="monotone" dataKey="thermal" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-4xl font-black text-white">65m</span>
                        <span className="text-cyan-400 text-xs font-bold uppercase italic">Mejora vs Promedio</span>
                    </div>
                </div>

            </main>

            {/* Footer corporativo */}
            <footer className="p-8 border-t border-white/5 flex justify-between items-center bg-black/20">
                <div className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      ` }} />
        </div>
    );
};

export default ExecutiveTrendsPage;
