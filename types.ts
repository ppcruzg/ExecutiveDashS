
// Fix: Added missing React import to resolve 'Cannot find namespace React' error in MetricCardProps
import React from 'react';

export enum OperationalStatus {
  OPTIMAL = 'OPTIMAL',
  AT_RISK = 'AT_RISK',
  CRITICAL = 'CRITICAL'
}

export interface MetricCardProps {
  title: string;
  subtitle?: string;
  status?: OperationalStatus;
  children: React.ReactNode;
  className?: string;
}

export interface ProcessData {
  time: string;
  scheduled: number;
  real: number;
}

export interface SalesCorrelation {
  hour: string;
  sales: number;
  temperature: number;
  idealSales: number;
}

export interface ROIData {
  preventedWaste: number;
  costImpact: number;
  events: { time: string; temp: number; impact: number }[];
}

// Added for SOW Integrator functionality
export interface SOWValidationResult {
  status: 'VALIDADO' | 'INCOMPLETO';
  project_summary: string;
  device_count: number;
  handover_checklist: string[];
}
