'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldMapper } from './field-mapper';
import { TemplateSelector } from './template-selector';
import { DashboardConfigurator } from './dashboard-configurator';
import { useToast } from '@/components/ui/toast';
import { DetectedField, FieldMapping, DashboardElement, ReportConfig } from '@/lib/types';
import { sampleData } from '@/lib/sample-data';
import { detectFields } from '@/lib/field-detector';

const STEPS = ['Report Details & Fields', 'Dashboard', 'Template & Export'];

interface WizardProps {
  /** If provided, we're editing an existing report */
  existingReport?: ReportConfig;
}

export function Wizard({ existingReport }: WizardProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(existingReport?.name || '');
  const [description, setDescription] = useState(existingReport?.description || '');

  const detectedFields: DetectedField[] = useMemo(() => detectFields(sampleData), []);

  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(
    existingReport?.fieldMappings || []
  );
  const [dashboardElements, setDashboardElements] = useState<DashboardElement[]>(
    existingReport?.dashboardElements || []
  );
  const [templateId, setTemplateId] = useState(existingReport?.templateId || 'default');

  const canProceed = () => {
    switch (step) {
      case 0:
        return name.trim() !== '' && fieldMappings.some((f) => f.enabled);
      case 1:
        return dashboardElements.length > 0;
      case 2:
        return templateId !== '';
      default:
        return false;
    }
  };

  const saveReport = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        fieldMappings: fieldMappings.filter((f) => f.enabled),
        dashboardElements,
        templateId,
      };

      const url = existingReport ? `/api/reports/${existingReport.id}` : '/api/reports';
      const method = existingReport ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const saved = await res.json();
      addToast(`Report "${saved.name}" saved!`, 'success');
      router.push(`/reports/${saved.id}/preview`);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                i <= step ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 text-sm hidden sm:inline ${
                i <= step ? 'text-zinc-100 font-medium' : 'text-zinc-500'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-zinc-800 mx-4" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Report Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monthly Sales Report"
              />
              <Input
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summary of sample data"
              />
            </div>
            <hr className="border-zinc-800" />
            <FieldMapper
              detectedFields={detectedFields}
              fieldMappings={fieldMappings}
              onChange={setFieldMappings}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-200">Configure dashboard elements</h3>
            <DashboardConfigurator
              elements={dashboardElements}
              fieldMappings={fieldMappings}
              onChange={setDashboardElements}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-200">Choose a template</h3>
            <TemplateSelector value={templateId} onChange={setTemplateId} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </Button>

        <div className="flex gap-3">
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button onClick={saveReport} loading={saving} disabled={!canProceed()}>
              {existingReport ? 'Update Report' : 'Save Report'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
