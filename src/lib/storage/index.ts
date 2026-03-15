import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ReportConfig, Customer, ReportScheduleGroup } from '@/lib/types';

// Use /tmp on Vercel (serverless has a read-only filesystem except /tmp)
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'reports.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const SCHEDULE_GROUPS_FILE = path.join(DATA_DIR, 'schedule-groups.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

function readAll(): ReportConfig[] {
  ensureDataDir();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as ReportConfig[];
}

function writeAll(reports: ReportConfig[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8');
}

export async function getAllReports(): Promise<ReportConfig[]> {
  return readAll();
}

export async function getReportById(id: string): Promise<ReportConfig | null> {
  const reports = readAll();
  return reports.find((r) => r.id === id) || null;
}

export async function createReport(
  data: Omit<ReportConfig, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReportConfig> {
  const reports = readAll();
  const now = new Date().toISOString();
  const report: ReportConfig = {
    ...data,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  reports.push(report);
  writeAll(reports);
  return report;
}

export async function updateReport(
  id: string,
  data: Partial<Omit<ReportConfig, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ReportConfig | null> {
  const reports = readAll();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reports[index] = {
    ...reports[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeAll(reports);
  return reports[index];
}

export async function deleteReport(id: string): Promise<boolean> {
  const reports = readAll();
  const filtered = reports.filter((r) => r.id !== id);
  if (filtered.length === reports.length) return false;
  writeAll(filtered);
  return true;
}

// ── Customers ────────────────────────────────────────────────────────────────

function ensureCustomersFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CUSTOMERS_FILE)) fs.writeFileSync(CUSTOMERS_FILE, '[]', 'utf-8');
}

function readAllCustomers(): Customer[] {
  ensureCustomersFile();
  return JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8')) as Customer[];
}

function writeAllCustomers(customers: Customer[]): void {
  ensureCustomersFile();
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
}

export async function getAllCustomers(): Promise<Customer[]> {
  return readAllCustomers();
}

// ── Schedule Groups ───────────────────────────────────────────────────────────

function ensureScheduleGroupsFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SCHEDULE_GROUPS_FILE)) fs.writeFileSync(SCHEDULE_GROUPS_FILE, '[]', 'utf-8');
}

function readAllScheduleGroups(): ReportScheduleGroup[] {
  ensureScheduleGroupsFile();
  return JSON.parse(fs.readFileSync(SCHEDULE_GROUPS_FILE, 'utf-8')) as ReportScheduleGroup[];
}

function writeAllScheduleGroups(groups: ReportScheduleGroup[]): void {
  ensureScheduleGroupsFile();
  fs.writeFileSync(SCHEDULE_GROUPS_FILE, JSON.stringify(groups, null, 2), 'utf-8');
}

export async function getAllScheduleGroups(): Promise<ReportScheduleGroup[]> {
  return readAllScheduleGroups();
}

export async function createScheduleGroup(
  data: Omit<ReportScheduleGroup, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReportScheduleGroup> {
  const groups = readAllScheduleGroups();
  const now = new Date().toISOString();
  const group: ReportScheduleGroup = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
  groups.push(group);
  writeAllScheduleGroups(groups);
  return group;
}

export async function createCustomer(
  data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Customer> {
  const customers = readAllCustomers();
  const now = new Date().toISOString();
  const customer: Customer = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
  customers.push(customer);
  writeAllCustomers(customers);
  return customer;
}
