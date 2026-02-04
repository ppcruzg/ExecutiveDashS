
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
    const { theme } = useTheme();

    // Show tabs if there's trend data or AI analysis available
    const showTabs = trend || aiAnalysis;

    if (!showTabs) {
        return (
            <div className="mt-4 space-y-4">
                <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Descripción</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Impacto</h3>
                    <p className="text-sm text-text-secondary">{impact}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* Tabs */}
            <div className={`flex gap-2 mb-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                <button
                    onClick={() => setActiveTab('resumen')}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'resumen'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-text-muted hover:text-text-main'
                        }`}
                >
                    📋 Resumen
                </button>
                {trend && (
                    <button
                        onClick={() => setActiveTab('tendencia')}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'tendencia'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-text-muted hover:text-text-main'
                            }`}
                    >
                        📊 Tendencia
                    </button>
                )}
                {aiAnalysis && (
                    <button
                        onClick={() => setActiveTab('analisis')}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 ${activeTab === 'analisis'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-text-muted hover:text-text-main'
                            }`}
                    >
                        🤖 Análisis IA
                    </button>
                )}
            </div>

            {/* Tab Content - Fixed Height */}
            <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
                {/* Resumen Tab */}
                {activeTab === 'resumen' && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Descripción</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Impacto</h3>
                            <p className="text-sm text-text-secondary">{impact}</p>
                        </div>
                    </div>
                )}

                {/* Tendencia Tab */}
                {activeTab === 'tendencia' && trend && (
                    <div className="animate-fade-in">
                        <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Evolución Semanal</h3>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-black ${trend.direction === 'down'
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
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
                                                ? severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                                                : 'text-text-secondary'
                                                }`}>{point.value}%</div>
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-500 ${isLast
                                                    ? severity === 'critical'
                                                        ? 'bg-gradient-to-t from-rose-600 to-rose-500 shadow-lg shadow-rose-500/30'
                                                        : 'bg-gradient-to-t from-amber-600 to-amber-500 shadow-lg shadow-amber-500/30'
                                                    : theme === 'dark' ? 'bg-gradient-to-t from-gray-700 to-gray-600' : 'bg-gradient-to-t from-gray-300 to-gray-200'
                                                    }`}
                                                style={{ height: `${height}%`, minHeight: '15px' }}
                                            ></div>
                                            <div className={`text-xs font-bold ${isLast ? 'text-text-main' : 'text-text-muted'}`}>{point.week}</div>
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
                        <div className={`p-5 rounded-lg border ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'}`}>
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-black text-sm">AI</span>
                                </div>
                                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Análisis Inteligente DUMA</h3>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

export default DumaNotificationTabs;
