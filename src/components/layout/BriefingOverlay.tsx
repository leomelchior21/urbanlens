import React from 'react';
import { ScenarioContext } from '@/store/useCrisisStore';
import { Mail, Play, Radar, Search, Siren } from 'lucide-react';

interface BriefingOverlayProps {
  scenario: ScenarioContext;
  onBegin: () => void;
}

export function BriefingOverlay({ scenario, onBegin }: BriefingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <section className="w-full max-w-3xl border border-emerald-400/60 bg-[#050b14]/95 text-slate-100 shadow-[0_0_70px_rgba(16,185,129,0.22)]">
        <div className="border-b border-slate-700 bg-[#07111f] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-emerald-500/60 bg-emerald-500/10 text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                Secure Municipal Email
              </p>
              <h1 className="mt-1 font-mono text-lg font-bold uppercase tracking-[0.2em] text-slate-50">
                Mission Briefing
              </h1>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7">
          <div className="border border-yellow-600/60 bg-[#0a111a] p-4 shadow-[inset_0_0_30px_rgba(234,179,8,0.08)]">
            <div className="mb-4 space-y-1 border-b border-slate-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <p>
                TO: <span className="text-slate-200">Investigation Unit</span>
              </p>
              <p>
                FROM: <span className="text-slate-200">Mayor&apos;s Office Secure Channel</span>
              </p>
              <p>
                SUBJECT: <span className="text-yellow-400">{scenario.code} Municipal Incident Dossier</span>
              </p>
            </div>
            <p className="whitespace-pre-line font-mono text-sm leading-7 text-yellow-100">
              &quot;{scenario.dossier}&quot;
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-slate-700 bg-[#07111f] p-4">
              <Radar className="mb-3 h-5 w-5 text-cyan-400" />
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-100">
                Watch Layers
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Switch city systems and compare which signals appear as the stages advance.
              </p>
            </div>
            <div className="border border-slate-700 bg-[#07111f] p-4">
              <Search className="mb-3 h-5 w-5 text-emerald-400" />
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-100">
                Ignore Noise
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Some posts are false leads. Look for patterns that repeat across systems.
              </p>
            </div>
            <div className="border border-slate-700 bg-[#07111f] p-4">
              <Siren className="mb-3 h-5 w-5 text-red-400" />
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-100">
                Stage 05
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                When the final stage begins, make a crisis guess and identify the root system.
              </p>
            </div>
          </div>

          <button
            onClick={onBegin}
            className="flex w-full items-center justify-center gap-3 border border-emerald-400 bg-emerald-500 px-5 py-4 font-mono text-sm font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-emerald-300"
          >
            <Play className="h-5 w-5" />
            Start Investigation
          </button>
        </div>
      </section>
    </div>
  );
}
