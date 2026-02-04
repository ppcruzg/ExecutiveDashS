
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ProcessCompliance from './components/ProcessCompliance';
import ProductExhibition from './components/ProductExhibition';
import SalesCorrelationChart from './components/SalesCorrelationChart';
import StaffingEfficiency from './components/StaffingEfficiency';
import ROIColdChain from './components/ROIColdChain';
import ExecutiveBrain from './components/ExecutiveBrain';
import { OperationalStatus } from './types';

import { useTheme } from './context/ThemeContext';


// Sub-component: SOWIntegrator for automated SOW validation
// Local SOWIntegrator removed in favor of ExecutiveBrain component

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`h-screen w-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f8fafc]'}`}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <h1 className="text-xl font-light tracking-[0.2em] text-text-main animate-pulse">SUCURSAL ESMERALDA</h1>
          <p className="text-[10px] text-text-muted mt-2 tracking-widest uppercase">Cargando Inteligencia Operativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen grid-bg flex flex-col p-4 md:p-6 overflow-hidden transition-colors duration-500">
      <Header
        storeName="SUCURSAL ESMERALDA"
        location="Ciudad Juárez, MX"
        globalStatus={OperationalStatus.OPTIMAL}
      />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-4 max-h-[calc(100vh-120px)] overflow-y-auto md:overflow-hidden pb-4">
        {/* Row 1: Left Pillar (Discipline) & Center Pillar (Sales) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <MetricCard
            title="DISCIPLINA OPERATIVA"
            subtitle="Cumplimiento de Procesos Programados"
            className="flex-1"
          >
            <ProcessCompliance />
          </MetricCard>

          <MetricCard
            title="EXHIBICIÓN"
            subtitle="Análisis de Huecos y Oportunidad de Venta"
            status={OperationalStatus.CRITICAL}
            className="flex-1"
          >
            <ProductExhibition />
          </MetricCard>
        </div>

        {/* Center: Main Sales Impact */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <MetricCard
            title="CORRELACIÓN VENTAS VS ENTORNO"
            subtitle="Análisis de Condiciones Controladas"
            status={OperationalStatus.AT_RISK}
            className="flex-1"
          >
            <SalesCorrelationChart />
          </MetricCard>

          <MetricCard
            title="ESTABILIDAD OPERATIVA"
            subtitle="Merma Evitada & Eficiencia Térmica"
            status={OperationalStatus.AT_RISK}
            className="flex-1"
          >
            <ROIColdChain />
          </MetricCard>
        </div>

        {/* Right: Staffing & SOW Integrator */}
        <div className="md:col-span-3 flex flex-col gap-4 overflow-hidden">
          <MetricCard
            title="EFICIENCIA DE PLANTILLA"
            subtitle="Operación Efectiva vs Dotación"
            status={OperationalStatus.CRITICAL}
            className="flex-1 overflow-hidden"
          >
            <StaffingEfficiency />
          </MetricCard>

          <MetricCard
            title="CONTROL CENTER"
            subtitle="Executive AI Intelligence & Action"
            status={OperationalStatus.CRITICAL}
            className="flex-1 overflow-hidden shadow-2xl shadow-rose-900/10"
          >
            <ExecutiveBrain />
          </MetricCard>
        </div>
      </main>

      <footer className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-text-muted opacity-60">
        <div>Duma OS Engine v2.4.0</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          System Pulse: Active
        </div>
        <div>© 2024 Sidon Sense Technology</div>
      </footer>
    </div>
  );
};

export default App;
