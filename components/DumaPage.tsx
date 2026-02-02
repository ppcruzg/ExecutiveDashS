

import React, { useState } from 'react';
import DumaNotificationTabs from './DumaNotificationTabs';


interface TrendData {
    week: string;
    value: number;
}

interface DumaNotification {
    id: string;
    timestamp: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    source: string;
    title: string;
    description: string;
    impact: string;
    status: 'pending' | 'in-progress' | 'resolved';
    trend?: {
        data: TrendData[];
        change: number;
        direction: 'up' | 'down' | 'stable';
    };
    aiAnalysis?: string;
    actions: {
        email: boolean;
        smartAudit?: boolean;
        congratulations?: boolean;
    };
    financialRisk?: number;
}

const mockNotifications: DumaNotification[] = [
    {
        id: '1',
        timestamp: '2026-01-29 15:30',
        severity: 'critical',
        source: 'Disciplina Operativa',
        title: 'Déficit Crítico en Recibo',
        description: 'Déficit crítico detectado en Recibo. Impacto proyectado en cumplimiento general: -16.4pts.',
        impact: 'Alto - Afecta cumplimiento general',
        status: 'pending',
        trend: {
            data: [
                { week: 'Sem 1', value: 92 },
                { week: 'Sem 2', value: 88 },
                { week: 'Sem 3', value: 85 },
                { week: 'Sem 4', value: 78 }
            ],
            change: -14,
            direction: 'down'
        },
        aiAnalysis: 'El área de Recibo presenta un Riesgo Financiero cuantificado de $ 22,000.00 debido a un deterioro del 15.2% en 4 semanas.\n\nDIAGNÓSTICO DUMA:\n(1) Saturación (+23% volumen), (2) Brecha de supervisión (vacantes críticas), (3) Latencia WMS (45m/turno).\n\nPLAN DE REMEDIACIÓN (Inmediato):\n1. CAPACIDAD: Reasignar 2 auxiliares de Limpieza a Recibo por 48h para eliminar el backlog acumulado.\n2. LIDERAZGO: Asignar un Supervisor Senior Interino para estabilizar la disciplina operativa de inmediato.\n3. SISTEMAS: Ticket Soporte IT "Prioridad Ejecutiva" para mantenimiento de base de datos WMS y eliminar latencia.\n\nCada punto de déficit bajo la meta suma $ 1,000.00 de riesgo. La ejecución completa de este plan detiene la fuga de capital operativo.',
        actions: { email: false, smartAudit: false },
        financialRisk: 22000
    },
    {
        id: '2',
        timestamp: '2026-01-29 14:45',
        severity: 'warning',
        source: 'Disciplina Operativa',
        title: 'Atención Requerida en Surtido',
        description: 'Rendimiento bajo meta en Surtido. Se recomienda revisión de procesos.',
        impact: 'Medio - Requiere atención',
        status: 'in-progress',
        trend: {
            data: [
                { week: 'Sem 1', value: 90 },
                { week: 'Sem 2', value: 88 },
                { week: 'Sem 3', value: 87 },
                { week: 'Sem 4', value: 85 }
            ],
            change: -5,
            direction: 'down'
        },
        aiAnalysis: 'DUMA cuantifica un riesgo de $ 15,000.00 en el proceso de Surtido. La tendencia descendente del 5.6% se concentra en el turno nocturno (78% cumplimiento). Este déficit financiero es recuperable mediante intervención puntual. Se requiere: (1) Reforzamiento nocturno, (2) Optimización de picking, y (3) Sistema de incentivos financieros ligados a la recuperación del cumplimiento.',
        actions: { email: true, smartAudit: false },
        financialRisk: 15000
    },
    {
        id: '3',
        timestamp: '2026-01-29 13:20',
        severity: 'warning',
        source: 'Disciplina Operativa',
        title: 'Mejora Requerida en Check-out',
        description: 'Rendimiento bajo meta en Check-out. Se recomienda revisión de procesos.',
        impact: 'Medio - Requiere atención',
        status: 'resolved',
        actions: { email: true, smartAudit: true }
    },
    {
        id: '4',
        timestamp: '2026-01-29 12:00',
        severity: 'info',
        source: 'Eficiencia Plantilla',
        title: 'Optimización de Turnos Detectada',
        description: 'Oportunidad de optimización en distribución de turnos para mejorar eficiencia en 8%.',
        impact: 'Bajo - Oportunidad de mejora',
        status: 'pending',
        actions: { email: false, smartAudit: false }
    },
    {
        id: '5',
        timestamp: '2026-01-29 11:30',
        severity: 'success',
        source: 'Disciplina Operativa',
        title: 'Excelencia en Inventario',
        description: 'El área de Inventario ha mantenido 100% de cumplimiento durante 5 rondas consecutivas. Destacable gestión del equipo.',
        impact: 'Positivo - Buena práctica identificada',
        status: 'pending',
        actions: { email: false, congratulations: false }
    },
    {
        id: '6',
        timestamp: '2026-01-29 10:15',
        severity: 'success',
        source: 'Disciplina Operativa',
        title: 'Mejora Sostenida en Limpieza',
        description: 'El área de Limpieza ha incrementado su rendimiento de 92% a 98% en las últimas 3 rondas. Excelente trabajo del equipo.',
        impact: 'Positivo - Reconocimiento merecido',
        status: 'resolved',
        actions: { email: true, congratulations: true }
    }
];

interface VisionData {
    events: Array<{
        time: string;
        register: string;
        type: 'normal' | 'anomaly';
        amount: number;
    }>;
    registerStats: Record<string, { total: number; anomalies: number; rate: number; trend: string }>;
    alert: {
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
    };
}

interface StaffingData {
    profiles: Array<{
        name: string;
        assigned: number;
        attendance: number;
        aiValidated: number;
        status: 'critical' | 'warning' | 'optimal';
        ghostWorkers: number;
    }>;
    totals: {
        assigned: number;
        attendance: number;
        aiValidated: number;
        ghostWorkers: number;
    };
    rates: {
        attendance: number;
        validation: number;
        ghost: number;
    };
    alert: {
        severity: 'critical' | 'warning' | 'info';
        message: string;
        criticalProfiles: string[];
        ghostProfiles: Array<{ name: string; count: number }>;
    };
}

interface ExhibitionData {
    categories: Array<{
        name: string;
        totalSpaces: number;
        occupied: number;
        gaps: number;
        operationalGaps: number;
        stockoutGaps: number;
        status: 'critical' | 'warning' | 'optimal';
    }>;
    totals: {
        spaces: number;
        occupied: number;
        gaps: number;
        operationalGaps: number;
        stockoutGaps: number;
    };
    rates: {
        availability: number;
        gap: number;
        stockout: number;
    };
    alert: {
        severity: 'critical' | 'warning' | 'info';
        message: string;
        criticalCategories: string[];
        stockoutCategories: Array<{ name: string; stockoutGaps: number; rate: string }>;
    };
}

interface ColdChainData {
    areas: Array<{
        name: string;
        currentTemp: number;
        targetTemp: number;
        timeOutsideRange: number;
        estimatedLoss: number;
        severity: 'critical' | 'warning' | 'optimal';
        energyWaste: number;
    }>;
    totals: {
        loss: number;
        avgTimeOutside: number;
        criticalCount: number;
    };
    alert: {
        severity: 'critical' | 'warning' | 'info';
        message: string;
    };
}

interface DumaPageProps {
    onClose: () => void;
    visionData?: VisionData;
    staffingData?: StaffingData;
    exhibitionData?: ExhibitionData;
    coldChainData?: ColdChainData;
}

const DumaPage: React.FC<DumaPageProps> = ({ onClose, visionData, staffingData, exhibitionData, coldChainData }) => {
    // Crear notificación de AI Vision si hay datos
    const visionNotification: DumaNotification | null = visionData ? {
        id: 'vision-ai',
        timestamp: new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        severity: visionData.alert.severity,
        source: 'AI Vision - Detección de Clientes',
        title: visionData.alert.severity === 'critical'
            ? 'Anomalías Críticas en Detección de Clientes'
            : visionData.alert.severity === 'warning'
                ? 'Atención Requerida en Sistema de Visión'
                : 'Sistema de Visión Operando Normalmente',
        description: visionData.alert.message,
        impact: visionData.alert.severity === 'critical'
            ? 'Alto - Posible impacto en prevención de pérdidas'
            : visionData.alert.severity === 'warning'
                ? 'Medio - Requiere revisión de configuración'
                : 'Bajo - Sistema funcionando correctamente',
        status: 'pending',
        trend: visionData.alert.stats ? {
            data: (Object.entries(visionData.registerStats) as Array<[string, { total: number; anomalies: number; rate: number; trend: string }]>).map(([name, stats]) => ({
                week: name,
                value: 100 - stats.rate // Invertir para mostrar % de detección exitosa
            })),
            change: visionData.alert.stats.avgRate,
            direction: visionData.alert.stats.avgRate > 7 ? 'down' : visionData.alert.stats.avgRate > 3 ? 'stable' : 'up'
        } : undefined,
        aiAnalysis: visionData.alert.stats ? `ANÁLISIS ESTADÍSTICO DUMA - SISTEMA AI VISION

📊 MÉTRICAS GLOBALES:
• Total de Ventas Procesadas: ${visionData.alert.stats.totalSales.toLocaleString()}
• Anomalías Detectadas: ${visionData.alert.stats.totalAnomalies} (${visionData.alert.stats.avgRate.toFixed(1)}%)
• Tasa de Detección Exitosa: ${(100 - visionData.alert.stats.avgRate).toFixed(1)}%

🎯 ANÁLISIS POR CAJA:
${(Object.entries(visionData.registerStats) as Array<[string, { total: number; anomalies: number; rate: number; trend: string }]>).map(([name, stats]) =>
            `${name}: ${stats.total} ventas | ${stats.anomalies} sin cliente (${stats.rate.toFixed(1)}%) | Tendencia: ${stats.trend === 'increasing' ? '⬆️ Creciente' : stats.trend === 'decreasing' ? '⬇️ Decreciente' : '➡️ Estable'}`
        ).join('\n')}

⚠️ CAJAS PROBLEMÁTICAS (>7%):
${visionData.alert.registers && visionData.alert.registers.length > 0
                ? visionData.alert.registers.map(reg => `• ${reg}: ${visionData.registerStats[reg].rate.toFixed(1)}% anomalías`).join('\n')
                : '✓ Ninguna caja fuera de rango'}

📈 COMPARATIVA DE PERFORMANCE:
• Mejor Caja: ${visionData.alert.stats.bestRegister} (${visionData.registerStats[visionData.alert.stats.bestRegister].rate.toFixed(1)}% anomalías)
• Peor Caja: ${visionData.alert.stats.worstRegister} (${visionData.registerStats[visionData.alert.stats.worstRegister].rate.toFixed(1)}% anomalías)
• Diferencial: ${(visionData.registerStats[visionData.alert.stats.worstRegister].rate - visionData.registerStats[visionData.alert.stats.bestRegister].rate).toFixed(1)} puntos porcentuales

🔧 RECOMENDACIONES DUMA:
${visionData.alert.severity === 'critical' || visionData.alert.severity === 'warning'
                ? `1. INMEDIATO: Verificar configuración de cámaras en ${visionData.alert.stats.worstRegister}
2. COMPARAR: Revisar diferencias de setup entre ${visionData.alert.stats.worstRegister} y ${visionData.alert.stats.bestRegister}
3. CALIBRAR: Ajustar modelo AI basado en condiciones de iluminación actuales
4. MONITOREAR: Seguimiento cada 2 horas hasta normalización`
                : `1. MANTENER: Configuración actual está funcionando correctamente
2. DOCUMENTAR: Guardar parámetros de ${visionData.alert.stats.bestRegister} como referencia
3. PREVENTIVO: Revisión semanal de calibración de cámaras`}

💰 IMPACTO ESTIMADO:
${visionData.alert.severity === 'critical'
                ? `Riesgo Alto - Cada punto porcentual de anomalía representa aproximadamente $${(visionData.alert.stats.totalSales * 0.01 * 150).toLocaleString()} en posibles pérdidas no detectadas.`
                : visionData.alert.severity === 'warning'
                    ? `Riesgo Medio - Optimización puede reducir pérdidas en $${(visionData.alert.stats.totalAnomalies * 150).toLocaleString()} mensuales.`
                    : `Sistema optimizado - Prevención efectiva de pérdidas operando correctamente.`}` : undefined,
        actions: { email: false, smartAudit: false },
        financialRisk: visionData.alert.stats && visionData.alert.severity !== 'info'
            ? Math.round(visionData.alert.stats.totalAnomalies * 150) // $150 promedio por anomalía
            : undefined
    } : null;

    // Crear notificación de Staffing si hay datos
    const staffingNotification: DumaNotification | null = staffingData ? {
        id: 'staffing-ai',
        timestamp: new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        severity: staffingData.alert.severity,
        source: 'AI Vision - Validación de Permanencia',
        title: staffingData.alert.severity === 'critical'
            ? 'Déficit Crítico en Validación de Personal'
            : staffingData.alert.severity === 'warning'
                ? 'Atención Requerida - Ghost Workers Detectados'
                : 'Sistema de Validación Operando Normalmente',
        description: staffingData.alert.message,
        impact: staffingData.alert.severity === 'critical'
            ? 'Alto - Impacto directo en productividad real'
            : staffingData.alert.severity === 'warning'
                ? 'Medio - Requiere verificación de permanencia'
                : 'Bajo - Sistema funcionando correctamente',
        status: 'pending',
        trend: {
            data: staffingData.profiles.map(profile => ({
                week: profile.name,
                value: parseFloat(((profile.aiValidated / profile.assigned) * 100).toFixed(1))
            })),
            change: staffingData.rates.ghost,
            direction: staffingData.rates.ghost > 5 ? 'down' : staffingData.rates.ghost > 0 ? 'stable' : 'up'
        },
        aiAnalysis: `ANÁLISIS DE VALIDACIÓN DE PERMANENCIA - AI VISION

📊 MÉTRICAS GLOBALES:
• Personal Asignado: ${staffingData.totals.assigned}
• Asistencia Registrada: ${staffingData.totals.attendance} (${staffingData.rates.attendance.toFixed(1)}%)
• Validados por AI Vision: ${staffingData.totals.aiValidated} (${staffingData.rates.validation.toFixed(1)}%)
• Ghost Workers Detectados: ${staffingData.totals.ghostWorkers} (${staffingData.rates.ghost.toFixed(1)}%)

🎯 ANÁLISIS POR PERFIL:
${staffingData.profiles.map(profile =>
            `${profile.name}: ${profile.assigned} asignados | ${profile.attendance} registrados | ${profile.aiValidated} validados AI | ${profile.ghostWorkers} ghost workers (${((profile.ghostWorkers / profile.attendance) * 100).toFixed(1)}%)`
        ).join('\n')}

⚠️ PERFILES CRÍTICOS:
${staffingData.alert.criticalProfiles.length > 0
                ? staffingData.alert.criticalProfiles.map(name => {
                    const profile = staffingData.profiles.find(p => p.name === name);
                    return `• ${name}: ${profile?.assigned} asignados vs ${profile?.aiValidated} validados (${((profile!.aiValidated / profile!.assigned) * 100).toFixed(1)}% cobertura)`;
                }).join('\n')
                : '✓ Ningún perfil en estado crítico'}

👻 GHOST WORKERS POR PERFIL:
${staffingData.alert.ghostProfiles.length > 0
                ? staffingData.alert.ghostProfiles.map(gp => `• ${gp.name}: ${gp.count} empleados sin permanencia validada`).join('\n')
                : '✓ No se detectaron ghost workers'}

📈 ANÁLISIS DE IMPACTO:
• Tasa de Validación AI: ${staffingData.rates.validation.toFixed(1)}% (Meta: ≥95%)
• Brecha de Validación: ${(100 - staffingData.rates.validation).toFixed(1)} puntos porcentuales
• Personal Efectivo Real: ${staffingData.totals.aiValidated} de ${staffingData.totals.assigned} asignados

🔧 RECOMENDACIONES DUMA:
${staffingData.alert.severity === 'critical' || staffingData.alert.severity === 'warning'
                ? `1. INMEDIATO: Verificar cámaras de validación en ${staffingData.alert.criticalProfiles.join(', ')}
2. SUPERVISIÓN: Implementar checkpoints de permanencia cada 2 horas
3. POLÍTICAS: Reforzar políticas de permanencia y sanciones por registro fantasma
4. TECNOLOGÍA: Revisar cobertura de cámaras AI en puntos críticos
5. CAPACITACIÓN: Entrenar supervisores en uso de sistema de validación AI`
                : `1. MANTENER: Sistema de validación funcionando correctamente
2. DOCUMENTAR: Guardar configuración actual como referencia
3. PREVENTIVO: Auditoría mensual de cobertura de cámaras AI`}

💰 IMPACTO ESTIMADO:
${staffingData.alert.severity === 'critical'
                ? `Riesgo Alto - ${staffingData.totals.ghostWorkers} ghost workers × 8 horas × $15/hora = $${(staffingData.totals.ghostWorkers * 8 * 15).toLocaleString()} en costo laboral sin productividad real por día.`
                : staffingData.alert.severity === 'warning'
                    ? `Riesgo Medio - Optimización puede recuperar $${(staffingData.totals.ghostWorkers * 8 * 15 * 30).toLocaleString()} mensuales en productividad.`
                    : `Sistema optimizado - Validación efectiva de permanencia operando correctamente.`}`,
        actions: { email: false, smartAudit: false },
        financialRisk: staffingData.alert.severity !== 'info'
            ? Math.round(staffingData.totals.ghostWorkers * 8 * 15 * 30) // Ghost workers × 8h × $15/h × 30 días
            : undefined
    } : null;

    // Crear notificación de Exhibition si hay datos
    const exhibitionNotification: DumaNotification | null = exhibitionData ? {
        id: 'exhibition-ai',
        timestamp: new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        severity: exhibitionData.alert.severity,
        source: 'AI Vision - Detección de Productos',
        title: exhibitionData.alert.severity === 'critical'
            ? 'Desabasto Crítico en Exhibición'
            : exhibitionData.alert.severity === 'warning'
                ? 'Atención Requerida - Huecos Detectados'
                : 'Sistema de Exhibición Operando Normalmente',
        description: exhibitionData.alert.message,
        impact: exhibitionData.alert.severity === 'critical'
            ? 'Alto - Pérdida de ventas por productos no disponibles'
            : exhibitionData.alert.severity === 'warning'
                ? 'Medio - Requiere reposición de productos'
                : 'Bajo - Exhibición óptima',
        status: 'pending',
        trend: {
            data: exhibitionData.categories.map(category => ({
                week: category.name,
                value: parseFloat(((category.occupied / category.totalSpaces) * 100).toFixed(1))
            })),
            change: exhibitionData.rates.stockout,
            direction: exhibitionData.rates.stockout > 10 ? 'down' : exhibitionData.rates.stockout > 5 ? 'stable' : 'up'
        },
        aiAnalysis: `ANÁLISIS DE EXHIBICIÓN DE PRODUCTOS - AI VISION

📊 MÉTRICAS GLOBALES:
• Espacios Totales: ${exhibitionData.totals.spaces}
• Espacios Ocupados: ${exhibitionData.totals.occupied} (${exhibitionData.rates.availability.toFixed(1)}%)
• Huecos Totales: ${exhibitionData.totals.gaps} (${exhibitionData.rates.gap.toFixed(1)}%)
• Huecos Operativos: ${exhibitionData.totals.operationalGaps} (permitidos por planograma)
• Huecos por Falta de Stock: ${exhibitionData.totals.stockoutGaps} (${exhibitionData.rates.stockout.toFixed(1)}%)

🎯 ANÁLISIS POR CATEGORÍA:
${exhibitionData.categories.map(category => {
            const availRate = ((category.occupied / category.totalSpaces) * 100).toFixed(1);
            const stockoutRate = ((category.stockoutGaps / category.totalSpaces) * 100).toFixed(1);
            return `${category.name}: ${category.occupied}/${category.totalSpaces} espacios (${availRate}%) | ${category.stockoutGaps} sin stock (${stockoutRate}%)`;
        }).join('\n')}

⚠️ CATEGORÍAS CRÍTICAS:
${exhibitionData.alert.criticalCategories.length > 0
                ? exhibitionData.alert.criticalCategories.map(name => {
                    const category = exhibitionData.categories.find(c => c.name === name);
                    return `• ${name}: ${category?.stockoutGaps} espacios sin producto (${((category!.stockoutGaps / category!.totalSpaces) * 100).toFixed(1)}% desabasto)`;
                }).join('\n')
                : '✓ Ninguna categoría en estado crítico'}

📦 HUECOS POR FALTA DE STOCK:
${exhibitionData.alert.stockoutCategories.length > 0
                ? exhibitionData.alert.stockoutCategories.map(sc => `• ${sc.name}: ${sc.stockoutGaps} espacios vacíos (${sc.rate}%)`).join('\n')
                : '✓ No se detectaron huecos por falta de stock'}

🔍 CLASIFICACIÓN DE HUECOS:
• Huecos Operativos: ${exhibitionData.totals.operationalGaps} (${((exhibitionData.totals.operationalGaps / exhibitionData.totals.gaps) * 100).toFixed(1)}% del total)
  → Espacios vacíos permitidos por planograma (rotación, promociones, etc.)
• Huecos por Stockout: ${exhibitionData.totals.stockoutGaps} (${((exhibitionData.totals.stockoutGaps / exhibitionData.totals.gaps) * 100).toFixed(1)}% del total)
  → Espacios vacíos por falta de producto (REQUIERE ACCIÓN)

📈 ANÁLISIS DE IMPACTO:
• Tasa de Disponibilidad: ${exhibitionData.rates.availability.toFixed(1)}% (Meta: ≥95%)
• Brecha de Disponibilidad: ${(100 - exhibitionData.rates.availability).toFixed(1)} puntos porcentuales
• Productos Efectivamente Exhibidos: ${exhibitionData.totals.occupied} de ${exhibitionData.totals.spaces} espacios

🔧 RECOMENDACIONES DUMA:
${exhibitionData.alert.severity === 'critical' || exhibitionData.alert.severity === 'warning'
                ? `1. INMEDIATO: Reponer productos en ${exhibitionData.alert.criticalCategories.join(', ')}
2. INVENTARIO: Verificar stock disponible en almacén vs exhibición
3. REPOSICIÓN: Implementar alertas automáticas cuando huecos > 5% por categoría
4. PLANOGRAMA: Revisar si huecos operativos están alineados con estrategia comercial
5. MONITOREO: Aumentar frecuencia de escaneo AI en categorías críticas`
                : `1. MANTENER: Sistema de detección funcionando correctamente
2. DOCUMENTAR: Guardar configuración actual como referencia
3. PREVENTIVO: Auditoría semanal de cobertura de cámaras AI en anaqueles`}

💰 IMPACTO ESTIMADO:
${exhibitionData.alert.severity === 'critical'
                ? `Riesgo Alto - ${exhibitionData.totals.stockoutGaps} espacios sin producto × $50/espacio/día = $${(exhibitionData.totals.stockoutGaps * 50).toLocaleString()} en ventas perdidas por día.`
                : exhibitionData.alert.severity === 'warning'
                    ? `Riesgo Medio - Optimización puede recuperar $${(exhibitionData.totals.stockoutGaps * 50 * 30).toLocaleString()} mensuales en ventas.`
                    : `Sistema optimizado - Exhibición de productos operando correctamente.`}

🎯 PRODUCTOS ESTRATÉGICOS DETECTADOS:
• Sistema AI identifica productos en tiempo real
• Clasificación automática de huecos (operativos vs stockout)
• Alertas proactivas antes de impacto en ventas`,
        actions: { email: false, smartAudit: false },
        financialRisk: exhibitionData.alert.severity !== 'info'
            ? Math.round(exhibitionData.totals.stockoutGaps * 50 * 30) // Stockout gaps × $50/día × 30 días
            : undefined
    } : null;

    // Crear notificación de Cold Chain si hay datos
    const coldChainNotification: DumaNotification | null = coldChainData ? {
        id: 'cold-chain-ai',
        timestamp: new Date().toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        severity: coldChainData.alert.severity,
        source: 'IoT + AI Vision - Cadena de Frío',
        title: coldChainData.alert.severity === 'critical'
            ? 'Riesgo Crítico de Merma y Desjugue'
            : coldChainData.alert.severity === 'warning'
                ? 'Atención Requerida - Desviación Térmica'
                : 'Cadena de Frío Operando Normalmente',
        description: coldChainData.alert.message,
        impact: coldChainData.alert.severity === 'critical'
            ? 'Alto - Impacto directo en calidad de producto y merma'
            : coldChainData.alert.severity === 'warning'
                ? 'Medio - Riesgo de degradación y exceso de energía'
                : 'Bajo - Condiciones térmicas óptimas',
        status: 'pending',
        trend: {
            data: coldChainData.areas.map(area => ({
                week: area.name,
                value: area.timeOutsideRange
            })),
            change: coldChainData.totals.avgTimeOutside,
            direction: coldChainData.totals.avgTimeOutside > 60 ? 'down' : coldChainData.totals.avgTimeOutside > 30 ? 'stable' : 'up'
        },
        aiAnalysis: `ANÁLISIS DE CADENA DE FRÍO

📊 MÉTRICAS TÉRMICAS:
• Áreas en Monitoreo: ${coldChainData.areas.length}
• Tiempo Promedio Fuera de Rango: ${coldChainData.totals.avgTimeOutside.toFixed(1)} min
• Áreas con Desviación Crítica: ${coldChainData.totals.criticalCount}
• Riesgo de Merma Estimado: $${coldChainData.totals.loss.toLocaleString()} MXN

🎯 DETALLE DE EXPOSICIÓN:
${coldChainData.areas.map(area => {
            const hours = (area.timeOutsideRange / 60).toFixed(1);
            return `${area.name}: ${area.currentTemp}°C vs Meta ${area.targetTemp}°C | Exposición: ${area.timeOutsideRange}min (${hours}h) | Severidad: ${area.severity.toUpperCase()}`;
        }).join('\n')}

⚠️ ANÁLISIS DE RIESGO DE PRODUCTO (DESJUGUES):
${coldChainData.areas.filter(a => a.severity !== 'optimal').map(area => {
            const riskFactor = area.severity === 'critical' ? 'ALTO (Desjugue inminente)' : 'MEDIO (Degradación celular)';
            return `• ${area.name}: Factor de riesgo ${riskFactor} debido a ${area.timeOutsideRange}min fuera de rango térmico.`;
        }).join('\n')}

⚡ IMPACTO EN EFICIENCIA ENERGÉTICA:
${coldChainData.areas.map(area => `• ${area.name}: Exceso de consumo del ${area.energyWaste}% por compensación térmica.`).join('\n')}

🔍 RECOMENDACIONES DUMA:
${coldChainData.alert.severity === 'critical' || coldChainData.alert.severity === 'warning'
                ? `1. INMEDIATO: Trasladar producto de ${coldChainData.areas.filter(a => a.severity === 'critical').map(a => a.name).join(', ')} a cámara de choque.
2. MANTENIMIENTO: Revisar niveles de gas refrigerante y estado de sellos en áreas críticas.
3. OPERACIÓN: Minimizar tiempos de apertura y carga en zonas de alta temperatura.
4. CONTROL: Ajustar setpoints de defrost para evitar picos térmicos prolongados.
5. PREVENCIÓN: Implementar cortinas hieleras en murales de Lácteos.`
                : `1. MANTENER: Parámetros actuales de operación.
2. OPTIMIZAR: Revisar horarios de menor carga para ajustes de ahorro energético.
3. PREVENTIVO: Auditoría quincenal de sensores IoT.`}

💰 IMPACTO FINANCIERO ESTIMADO:
${coldChainData.alert.severity === 'critical'
                ? `Riesgo Crítico - Merma potencial de $${coldChainData.totals.loss.toLocaleString()} MXN en las próximas 12 horas si no se corrige la temperatura.`
                : coldChainData.alert.severity === 'warning'
                    ? `Riesgo Moderado - La degradación progresiva podría generar una merma del 3-5% en el lote actual ($${(coldChainData.totals.loss * 0.4).toLocaleString()} est.).`
                    : `Operación rentable - Ahorro sostenido por preservación de frescura.`}

🎯 INSIGHT DE INTELIGENCIA:
• La desviación en Carnes sugiere posible falla en motorventilador o carga excesiva bloqueando ductos.
• El tiempo promedio de exposición ha incrementado 15% en la última hora.`,
        actions: { email: false, smartAudit: false },
        financialRisk: coldChainData.alert.severity !== 'info'
            ? Math.round(coldChainData.totals.loss * 30) // Potencial mensual si no se corrige
            : undefined
    } : null;

    // Combinar notificaciones
    const allNotifications = [
        ...(visionNotification ? [visionNotification] : []),
        ...(staffingNotification ? [staffingNotification] : []),
        ...(exhibitionNotification ? [exhibitionNotification] : []),
        ...(coldChainNotification ? [coldChainNotification] : []),
        ...mockNotifications
    ];

    const [notifications, setNotifications] = useState<DumaNotification[]>(allNotifications);
    const [selectedNotification, setSelectedNotification] = useState<DumaNotification | null>(
        coldChainNotification || exhibitionNotification || staffingNotification || visionNotification || null // Priorizar cold chain
    );
    const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/30',
                    text: 'text-rose-400',
                    glow: 'rgba(239, 68, 68, 0.3)',
                    label: 'CRÍTICO'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    text: 'text-amber-400',
                    glow: 'rgba(245, 158, 11, 0.3)',
                    label: 'ATENCIÓN'
                };
            default:
                return {
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/30',
                    text: 'text-blue-400',
                    glow: 'rgba(59, 130, 246, 0.3)',
                    label: 'INFO'
                };
            case 'success':
                return {
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/30',
                    text: 'text-emerald-400',
                    glow: 'rgba(16, 185, 129, 0.3)',
                    label: 'BUENA PRÁCTICA'
                };
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Pendiente' };
            case 'in-progress':
                return { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'En Proceso' };
            case 'resolved':
                return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Resuelto' };
            default:
                return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Desconocido' };
        }
    };

    const handleAction = (notificationId: string, action: 'email' | 'smartAudit' | 'congratulations') => {
        setNotifications(prev => prev.map(n => {
            if (n.id === notificationId) {
                return {
                    ...n,
                    actions: { ...n.actions, [action]: true },
                    status: 'in-progress' as const
                };
            }
            return n;
        }));
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.severity === filter);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
            {/* Header */}
            <div className="glass-card border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                <img
                                    src="/assets/LOGODUMA.png"
                                    alt="DUMA Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">DUMA Intelligence</h1>
                                <p className="text-xs text-gray-400">Centro de Notificaciones Ejecutivas</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-300"
                    >
                        ← Volver al Dashboard
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Panel - Notifications List */}
                    <div className="col-span-5">
                        {/* Filters */}
                        <div className="flex gap-2 mb-4">
                            {(['all', 'critical', 'warning', 'success', 'info'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === f
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {f === 'all' ? 'Todas' : f === 'critical' ? 'Críticas' : f === 'warning' ? 'Atención' : f === 'success' ? 'Buenas Prácticas' : 'Info'}
                                </button>
                            ))}
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                            {filteredNotifications.map(notification => {
                                const severityConfig = getSeverityConfig(notification.severity);
                                const statusConfig = getStatusConfig(notification.status);
                                const isSelected = selectedNotification?.id === notification.id;

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => setSelectedNotification(notification)}
                                        className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 border ${isSelected
                                            ? `${severityConfig.border} bg-white/5`
                                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border}`}>
                                                        {severityConfig.label}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-white mb-1">{notification.title}</h3>
                                                <p className="text-xs text-gray-400 line-clamp-2">{notification.description}</p>
                                            </div>
                                            <div className={`w-1 h-12 rounded-full ${notification.severity === 'critical' ? 'bg-rose-500' :
                                                notification.severity === 'warning' ? 'bg-amber-500' :
                                                    notification.severity === 'success' ? 'bg-emerald-500' :
                                                        'bg-blue-500'
                                                }`}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                                            <span>{notification.source}</span>
                                            <span>{notification.timestamp}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel - Notification Detail & Actions */}
                    <div className="col-span-7">
                        {selectedNotification ? (
                            <div className="glass-card rounded-xl p-6 border border-white/10">
                                <div className="mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                {(() => {
                                                    const config = getSeverityConfig(selectedNotification.severity);
                                                    return (
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                                                            ● {config.label}
                                                        </span>
                                                    );
                                                })()}
                                                {(() => {
                                                    const config = getStatusConfig(selectedNotification.status);
                                                    return (
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.text}`}>
                                                            {config.label}
                                                        </span>
                                                    );
                                                })()}

                                                {/* Monetary Risk Indicator */}
                                                {selectedNotification.financialRisk && (
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                                                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Riesgo:</span>
                                                        <span className="text-xs font-black text-white tabular-nums">
                                                            $ {selectedNotification.financialRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">{selectedNotification.title}</h2>
                                            <p className="text-sm text-gray-400">{selectedNotification.source} • {selectedNotification.timestamp}</p>
                                        </div>
                                    </div>

                                    {/* Tabbed Content */}
                                    <DumaNotificationTabs
                                        description={selectedNotification.description}
                                        impact={selectedNotification.impact}
                                        severity={selectedNotification.severity}
                                        trend={selectedNotification.trend}
                                        aiAnalysis={selectedNotification.aiAnalysis}
                                    />

                                </div>

                                {/* Actions Section */}
                                <div className="border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Acciones Ejecutivas</h3>

                                    <div className="space-y-3">
                                        {/* Congratulations Email - Only for Success */}
                                        {selectedNotification.severity === 'success' ? (
                                            <div className={`p-4 rounded-lg border transition-all duration-300 ${selectedNotification.actions.congratulations
                                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                                : 'bg-white/5 border-white/10'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg">🎉</span>
                                                            <h4 className="text-sm font-bold text-white">Enviar Felicitación por Correo</h4>
                                                        </div>
                                                        <p className="text-xs text-gray-400">Reconocer y felicitar al equipo por su excelente desempeño</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAction(selectedNotification.id, 'congratulations')}
                                                        disabled={selectedNotification.actions.congratulations}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${selectedNotification.actions.congratulations
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                                                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                                            }`}
                                                    >
                                                        {selectedNotification.actions.congratulations ? '✓ Enviado' : 'Enviar Felicitación'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Email Action - For Critical/Warning/Info */}
                                                <div className={`p-4 rounded-lg border transition-all duration-300 ${selectedNotification.actions.email
                                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                                    : 'bg-white/5 border-white/10'
                                                    }`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-lg">📧</span>
                                                                <h4 className="text-sm font-bold text-white">Enviar Notificación por Correo</h4>
                                                            </div>
                                                            <p className="text-xs text-gray-400">Enviar recomendaciones detalladas al equipo responsable</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAction(selectedNotification.id, 'email')}
                                                            disabled={selectedNotification.actions.email}
                                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${selectedNotification.actions.email
                                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30'
                                                                }`}
                                                        >
                                                            {selectedNotification.actions.email ? '✓ Enviado' : 'Enviar'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Smart Audit Action - Only for Critical/Warning */}
                                                {(selectedNotification.severity === 'critical' || selectedNotification.severity === 'warning') && (
                                                    <div className={`p-4 rounded-lg border transition-all duration-300 ${selectedNotification.actions.smartAudit
                                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                                        : 'bg-white/5 border-white/10'
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">📋</span>
                                                                    <h4 className="text-sm font-bold text-white">Crear Tarea en Smart Audits</h4>
                                                                </div>
                                                                <p className="text-xs text-gray-400">Generar tarea de auditoría para seguimiento y corrección</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAction(selectedNotification.id, 'smartAudit')}
                                                                disabled={selectedNotification.actions.smartAudit}
                                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${selectedNotification.actions.smartAudit
                                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                                                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30'
                                                                    }`}
                                                            >
                                                                {selectedNotification.actions.smartAudit ? '✓ Creada' : 'Crear Tarea'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Future Actions Placeholder */}
                                    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 border-dashed">
                                        <p className="text-xs text-gray-500 text-center">
                                            <span className="font-bold">Próximamente:</span> Más acciones basadas en otras secciones del dashboard
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card rounded-xl p-12 border border-white/10 flex flex-col items-center justify-center text-center h-full">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                                    <span className="text-4xl">🤖</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Selecciona una Notificación</h3>
                                <p className="text-sm text-gray-400">Elige una notificación de la lista para ver detalles y acciones disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default DumaPage;
