
import React, { useState } from 'react';

interface TrendData {
    week: string;
    value: number;
}

interface NotificationTabsProps {
    description: string;
    impact: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    trend?: {
        data: TrendData[];
        change: number;
        direction: 'up' | 'down' | 'stable';
    };
    aiAnalysis?: string;
}

const DumaNotificationTabs: React.FC<NotificationTabsProps> = ({
    description,
    impact,
    severity,
    trend,
    aiAnalysis
}) => {
    const [activeTab, setActiveTab] = useState<'resumen' | 'tendencia' | 'analisis'>('resumen');

    // Show tabs if there's trend data or AI analysis available
    const showTabs = trend || aiAnalysis;

    if (!showTabs) {
        return (
            <div className="mt-4 space-y-4">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Impacto</h3>
                    <p className="text-sm text-gray-300">{impact}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('resumen')}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'resumen'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                >
                    📋 Resumen
                </button>
                {trend && (
                    <button
                        onClick={() => setActiveTab('tendencia')}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'tendencia'
                            ? 'border-blue-500 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        📊 Tendencia
                    </button>
                )}
                {aiAnalysis && (
                    <button
                        onClick={() => setActiveTab('analisis')}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'analisis'
                            ? 'border-blue-500 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        🤖 Análisis IA
                    </button>
                )}
            </div>

            {/* Tab Content - Fixed Height */}
            <div className="h-64 overflow-y-auto pr-2">
                {/* Resumen Tab */}
                {activeTab === 'resumen' && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Impacto</h3>
                            <p className="text-sm text-gray-300">{impact}</p>
                        </div>
                    </div>
                )}

                {/* Tendencia Tab */}
                {activeTab === 'tendencia' && trend && (
                    <div className="animate-fade-in">
                        <div className="p-5 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evolución Semanal</h3>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-black ${trend.direction === 'down'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    }`}>
                                    {trend.direction === 'down' ? '↓' : '↑'} {Math.abs(trend.change)}%
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="flex items-end justify-between gap-4 h-32 px-2">
                                {trend.data.map((point, idx) => {
                                    const height = (point.value / 100) * 100;
                                    const isLast = idx === trend.data.length - 1;
                                    return (
                                        <div key={point.week} className="flex-1 flex flex-col items-center gap-2">
                                            <div className={`text-sm font-bold ${isLast
                                                ? severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                                                : 'text-gray-300'
                                                }`}>{point.value}%</div>
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-500 ${isLast
                                                    ? severity === 'critical'
                                                        ? 'bg-gradient-to-t from-rose-600 to-rose-500 shadow-lg shadow-rose-500/50'
                                                        : 'bg-gradient-to-t from-amber-600 to-amber-500 shadow-lg shadow-amber-500/50'
                                                    : 'bg-gradient-to-t from-gray-700 to-gray-600'
                                                    }`}
                                                style={{ height: `${height}%`, minHeight: '15px' }}
                                            ></div>
                                            <div className={`text-xs font-bold ${isLast ? 'text-white' : 'text-gray-400'}`}>{point.week}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Análisis IA Tab */}
                {activeTab === 'analisis' && aiAnalysis && (
                    <div className="animate-fade-in">
                        <div className="p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-black text-sm">AI</span>
                                </div>
                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Análisis Inteligente DUMA</h3>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DumaNotificationTabs;
