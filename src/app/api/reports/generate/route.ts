import { NextRequest, NextResponse } from 'next/server';
import { generateRequestSchema } from '@/lib/schemas';
import { getReportById } from '@/lib/storage';
import { sampleData } from '@/lib/sample-data';
import {
  prepareTemplateData,
  renderTemplate,
  generatePdf,
  generateExcel,
  generateCsv,
} from '@/lib/report-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { reportId, format } = parsed.data;

    // Load report config
    const report = await getReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const rawData = sampleData;

    // Prepare template data
    const templateData = prepareTemplateData(
      rawData,
      report.fieldMappings,
      report.name,
      report.description
    );

    switch (format) {
      case 'html': {
        const html = renderTemplate(report.templateId, templateData);
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `inline; filename="${report.name}.html"`,
          },
        });
      }

      case 'pdf': {
        const html = renderTemplate(report.templateId, templateData);
        const pdfBuffer = await generatePdf(html);
        return new NextResponse(new Uint8Array(pdfBuffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${report.name}.pdf"`,
          },
        });
      }

      case 'excel': {
        const excelBuffer = await generateExcel(templateData);
        return new NextResponse(new Uint8Array(excelBuffer), {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${report.name}.xlsx"`,
          },
        });
      }

      case 'csv': {
        const csv = generateCsv(templateData);
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${report.name}.csv"`,
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
