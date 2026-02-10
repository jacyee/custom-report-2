import ExcelJS from 'exceljs';
import { TemplateData } from './template-renderer';

/**
 * Generate an Excel file from template data
 */
export async function generateExcel(data: TemplateData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Custom Report Generator';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(data.title || 'Report');

  // Define columns
  sheet.columns = data.columns.map((col) => ({
    header: col.label,
    key: col.key,
    width: Math.max(col.label.length + 4, 15),
  }));

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
  headerRow.height = 24;

  // Add data rows
  for (const row of data.rows) {
    const values: Record<string, unknown> = {};
    for (const col of data.columns) {
      let value = row[col.key];

      // Apply formatting
      if (col.format === 'currency' && typeof value === 'number') {
        // ExcelJS handles number formatting natively
        values[col.key] = value;
      } else if (col.format === 'percent' && typeof value === 'number') {
        values[col.key] = value;
      } else {
        values[col.key] = value ?? '';
      }
    }
    const addedRow = sheet.addRow(values);

    // Apply number formats
    for (let i = 0; i < data.columns.length; i++) {
      const col = data.columns[i];
      const cell = addedRow.getCell(i + 1);
      if (col.format === 'currency') {
        cell.numFmt = '$#,##0.00';
      } else if (col.format === 'percent') {
        cell.numFmt = '0.0%';
      } else if (col.format === 'date' || col.format?.startsWith('date:')) {
        cell.numFmt = 'yyyy-mm-dd';
      }
    }
  }

  // Alternate row colors
  for (let i = 2; i <= data.rows.length + 1; i++) {
    const row = sheet.getRow(i);
    if (i % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
    }
  }

  // Auto-filter
  if (data.columns.length > 0) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: data.columns.length },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
