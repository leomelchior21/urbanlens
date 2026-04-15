import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { ScenarioContext, SystemType } from '@/store/useCrisisStore';

const SYMPTOM_OPTIONS = [
  { code: 'CRISIS-01', label: 'Water collapse in ABC' },
  { code: 'CRISIS-02', label: 'Heat wave in the east zone' },
  { code: 'CRISIS-03', label: 'Tiete river flood' },
  { code: 'CRISIS-04', label: 'Cascading blackout downtown' },
  { code: 'CRISIS-05', label: 'Waste collapse in Guarulhos' },
  { code: 'CRISIS-06', label: 'Landslide in Parelheiros' },
  { code: 'CRISIS-07', label: 'Air crisis in the metro region' },
  { code: 'CRISIS-08', label: 'Mobility collapse on Paulista axis' },
  { code: 'CRISIS-09', label: 'Water shortage in Cantareira' },
  { code: 'CRISIS-10', label: 'Public health emergency' },
];

const ROOT_CAUSE_OPTIONS: { system: SystemType; label: string }[] = [
  { system: 'Temperature', label: 'Temperature / heat stress' },
  { system: 'Air', label: 'Air quality / atmosphere' },
  { system: 'Water', label: 'Water / hydrology' },
  { system: 'Energy', label: 'Energy grid' },
  { system: 'Mobility', label: 'Mobility / transit' },
  { system: 'Waste', label: 'Waste / sanitation' },
  { system: 'Vegetation', label: 'Vegetation / canopy' },
  { system: 'Soil', label: 'Soil / terrain' },
  { system: 'Social', label: 'Social panic / civic pulse' },
  { system: 'Health', label: 'Public health system' },
];

interface CrisisQuizOverlayProps {
  scenario: ScenarioContext;
  onClose: () => void;
}

function choiceClasses(isSelected: boolean, isCorrect: boolean, isWrongAfterSubmit: boolean) {
  if (isCorrect) {
    return 'border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.16)]';
  }

  if (isWrongAfterSubmit) {
    return 'border-red-500 bg-red-500/15 text-red-100';
  }

  if (isSelected) {
    return 'border-yellow-400 bg-yellow-500/15 text-yellow-100';
  }

  return 'border-slate-700 bg-[#07111f] text-slate-300 hover:border-slate-400 hover:text-slate-50';
}

export function CrisisQuizOverlay({ scenario, onClose }: CrisisQuizOverlayProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [selectedRoot, setSelectedRoot] = useState<SystemType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctSymptom = useMemo(
    () => SYMPTOM_OPTIONS.find((option) => option.code === scenario.code),
    [scenario.code]
  );
  const correctRoot = ROOT_CAUSE_OPTIONS.find((option) => option.system === scenario.rootCauseSystem);

  const symptomIsCorrect = selectedSymptom === scenario.code;
  const rootIsCorrect = selectedRoot === scenario.rootCauseSystem;
  const canSubmit = Boolean(selectedSymptom && selectedRoot);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-red-500/70 bg-[#050b14]/95 text-slate-100 shadow-[0_0_80px_rgba(239,68,68,0.24)] custom-scrollbar">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-red-900/70 bg-[#16070a] px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">
              Stage 05 Assessment
            </p>
            <h1 className="mt-1 font-mono text-xl font-black uppercase tracking-[0.2em] text-red-100">
              Guess the Crisis
            </h1>
          </div>
          <button
            onClick={onClose}
            className="border border-red-900 bg-black/30 p-2 text-red-200 transition-colors hover:border-red-400 hover:text-white"
            title="Close quiz"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-7 p-5 sm:p-7">
          <div className="border border-slate-700 bg-[#07111f] p-4">
            <p className="font-mono text-sm leading-6 text-slate-300">
              Use the map signals, intercepts, and stage progression to choose the observed crisis and the hidden root system. False leads are part of the exercise.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.22em] text-slate-100">
              1. What symptom was observed?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {SYMPTOM_OPTIONS.map((option) => {
                const isSelected = selectedSymptom === option.code;
                const isCorrect = submitted && option.code === scenario.code;
                const isWrongAfterSubmit = submitted && isSelected && option.code !== scenario.code;

                return (
                  <button
                    key={option.code}
                    onClick={() => {
                      if (!submitted) setSelectedSymptom(option.code);
                    }}
                    className={`min-h-14 border px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors ${choiceClasses(isSelected, isCorrect, isWrongAfterSubmit)}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.22em] text-slate-100">
              2. What root cause was observed?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROOT_CAUSE_OPTIONS.map((option) => {
                const isSelected = selectedRoot === option.system;
                const isCorrect = submitted && option.system === scenario.rootCauseSystem;
                const isWrongAfterSubmit = submitted && isSelected && option.system !== scenario.rootCauseSystem;

                return (
                  <button
                    key={option.system}
                    onClick={() => {
                      if (!submitted) setSelectedRoot(option.system);
                    }}
                    className={`min-h-14 border px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors ${choiceClasses(isSelected, isCorrect, isWrongAfterSubmit)}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {submitted && (
            <div className={`border p-4 ${symptomIsCorrect && rootIsCorrect ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <div className="flex items-start gap-3">
                {symptomIsCorrect && rootIsCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
                )}
                <div>
                  <h3 className="font-mono text-sm font-black uppercase tracking-[0.2em] text-slate-50">
                    {symptomIsCorrect && rootIsCorrect ? 'Correct' : 'Review the pattern'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Observed symptom: <span className="text-slate-50">{correctSymptom?.label ?? scenario.title}</span>.
                  </p>
                  <p className="text-sm leading-6 text-slate-300">
                    Root cause: <span className="text-slate-50">{correctRoot?.label ?? scenario.rootCauseSystem}</span>.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {scenario.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {!submitted ? (
              <button
                disabled={!canSubmit}
                onClick={() => setSubmitted(true)}
                className="flex-1 border border-red-500 bg-red-600 px-5 py-4 font-mono text-sm font-black uppercase tracking-[0.22em] text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-600"
              >
                Submit Guess
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 border border-emerald-500 bg-emerald-500 px-5 py-4 font-mono text-sm font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-emerald-300"
              >
                Return to Map
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
