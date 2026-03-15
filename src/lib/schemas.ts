import { z } from 'zod';

export const fieldMappingSchema = z.object({
  sourcePath: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['string', 'number', 'boolean', 'date', 'unknown']),
  enabled: z.boolean().default(true),
  format: z.string().optional(),
});

export const dashboardElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['table', 'chart']),
  title: z.string().min(1),
  chartType: z.enum(['bar', 'line', 'pie']).optional(),
  categoryField: z.string().optional(),
  valueField: z.string().optional(),
});

export const reportConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Report name is required'),
  description: z.string().default(''),
  fieldMappings: z.array(fieldMappingSchema).min(1, 'At least one field mapping required'),
  dashboardElements: z.array(dashboardElementSchema).default([]),
  templateId: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createReportSchema = reportConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateReportSchema = createReportSchema.partial();

export const generateRequestSchema = z.object({
  reportId: z.string().uuid(),
  format: z.enum(['html', 'pdf', 'excel', 'csv']),
});

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  contractId: z.string().optional(),
  contractedPower: z.string().optional(),
  waterFlowRate: z.string().optional(),
  temperatureMin: z.string().optional(),
  temperatureMax: z.string().optional(),
  humidityMin: z.string().optional(),
  humidityMax: z.string().optional(),
  notes: z.string().optional(),
});
