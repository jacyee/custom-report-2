export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'unknown';

export type OutputFormat = 'html' | 'pdf' | 'excel' | 'csv';

export interface FieldMapping {
  /** Dot-notation path in the JSON object, e.g. "user.name" */
  sourcePath: string;
  label: string;
  type: FieldType;
  enabled: boolean;
  /** Optional format string, e.g. "currency", "date:YYYY-MM-DD", "percent" */
  format?: string;
}

export type ChartType = 'bar' | 'line' | 'pie';

export interface DashboardElement {
  id: string;
  type: 'table' | 'chart';
  title: string;
  chartType?: ChartType;
  /** sourcePath of the category/label field (x-axis) */
  categoryField?: string;
  /** sourcePath of the numeric value field (y-axis) */
  valueField?: string;
}

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  fieldMappings: FieldMapping[];
  dashboardElements: DashboardElement[];
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedField {
  path: string;
  type: FieldType;
  sampleValue: unknown;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export interface GenerateRequest {
  reportId: string;
  format: OutputFormat;
}

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export interface ReportScheduleGroup {
  id: string;
  name: string;
  organisation?: string;
  customerId?: string;
  site?: string;
  page?: string;
  reportingLevel?: 'site' | 'room';
  itemGroup?: string;
  reportType?: 'standard' | 'custom' | 'item-csv';
  frequency?: ScheduleFrequency;
  scheduledTime?: string;
  recipients?: string;
  dataFrom?: string;
  dataTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contractId?: string;
  contractedPower?: string;
  allocatedPower?: string;
  allocatedPowerMin?: string;
  allocatedPowerMax?: string;
  generatorFuelLevel?: string;
  waterFlowRate?: string;
  chilledWaterSupplyTemp?: string;
  chilledWaterSupplyTempMin?: string;
  chilledWaterSupplyTempMax?: string;
  chilledWaterReturnTemp?: string;
  chilledWaterReturnTempMin?: string;
  chilledWaterReturnTempMax?: string;
  temperatureMin?: string;
  temperatureMax?: string;
  humidityMin?: string;
  humidityMax?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
