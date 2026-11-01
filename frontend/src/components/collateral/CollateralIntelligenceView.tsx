import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { 
  GitMerge, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Landmark, 
  ShieldAlert, 
  ArrowRight, 
  FileText, 
  Lock,
  GitBranch
} from 'lucide-react';

export const CollateralIntelligenceView: React.FC = () => {
  const { instruments, setSelectedInstrumentId, setActiveTab } = useApp();

  const [selectedConflict, setSelectedConflict] = useState<string>('conf-01');

  // Find instruments that have duplicate discrepancies or replacement relationships
  const duplicateInstruments = instruments.filter(i => 
    i.discrepancies.some(d => d.ruleCode === 'DUPLICATE_FINGERPRINT')
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
              Vigilance & Risk Analytics
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Privacy-Preserving HMAC Fingerprints
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Collateral Intelligence & Duplicate Detection
          </h1>
          <p className="text-xs text-slate-500">
            Detecting multi-pledge fraud, cross-institution duplicate FDRs, and replacement instrument lineages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>HMAC-SHA256 Secret Masking Active</span>
        </div>
      </div>

      {/* Explanatory Banner for Stakeholders */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-xs border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Multi-Registry Double Pledging Prevention</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Higher education trusts often operate multiple colleges or programs. SecureFDR 360 uses deterministic, privacy-preserving HMAC-SHA256 digests (combining issuing bank code, normalized certificate reference, and issue date) to detect when the same underlying physical FDR is pledged twice—either across different AICTE programs or across different regulatory authorities—without exposing plain account numbers to public blockchains.
            </p>
          </div>

          <div className="text-right text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono shrink-0">
            <span className="text-slate-400 text-[10px] block uppercase">Fingerprint Algorithm</span>
            <span className="text-amber-300 font-bold">HMAC-SHA256(Bank + Ref + Date)</span>
          </div>
        </div>
      </div>

      {/* Primary Case Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Column: Flagged Cases */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Flagged Collateral Conflicts
            </h3>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              1 Active Case
            </span>
          </div>

          <div className="p-3 space-y-2 flex-1">
            <div
              onClick={() => setSelectedConflict('conf-01')}
              className="p-3.5 rounded-xl border border-red-300 bg-red-50/70 cursor-pointer transition hover:bg-red-50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-red-950">
                  COLLISION #CC-2026-991204
                </span>
                <span className="text-[10px] font-bold text-red-800 bg-red-200 px-1.5 py-0.5 rounded">
                  Critical
                </span>
              </div>

              <p className="text-xs text-red-900 font-medium mb-1">
                DEMO-FDR-1006 (Apex Health / National Inst.)
              </p>

              <p className="text-[11px] text-red-800 leading-tight">
                Fingerprint collision: Identical certificate pledged to both AICTE and State Pharmacy Board.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Collateral Relationship Graph & Inspector */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  Conflict ID: CC-2026-991204
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  HMAC Collision Detected
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Cross-Registry Duplicate Certificate Investigation
              </h2>
            </div>

            <button
              onClick={() => {
                setSelectedInstrumentId('fdr-1006');
                setActiveTab('passport');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-2xs"
            >
              Inspect Passport (DEMO-FDR-1006) →
            </button>
          </div>

          {/* Visual Linked Record Flow / Diagram */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
              Collateral Conflict Visual Relationship
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              {/* Node 1: Pledged to AICTE */}
              <div className="p-3 bg-white rounded-lg border border-slate-300 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>AICTE Regulatory Bureau</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono">Inst: AICTE-FDR-2026-001006</p>
                <p className="text-[11px] text-slate-800 font-bold font-mono">Amount: ₹30,00,000</p>
                <div className="text-[10px] text-slate-400 mt-1">Submitted: 2026-10-29</div>
              </div>

              {/* Central Collision Point */}
              <div className="text-center p-3 bg-red-100 rounded-lg border border-red-300 text-red-950">
                <AlertTriangle className="w-6 h-6 text-red-700 mx-auto mb-1 animate-bounce" />
                <span className="font-bold text-xs block">IDENTICAL FINGERPRINT</span>
                <span className="text-[10px] font-mono block text-red-800 truncate">
                  FDR/SBI/2024/991204
                </span>
                <span className="text-[10px] text-red-700">Same Branch & Date</span>
              </div>

              {/* Node 2: Pledged to Pharmacy State Council */}
              <div className="p-3 bg-white rounded-lg border border-slate-300 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Landmark className="w-4 h-4 text-purple-700" />
                  <span>State Pharmacy Council</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono">Reg: SPC-2024-CORPUS-19</p>
                <p className="text-[11px] text-slate-800 font-bold font-mono">Amount: ₹30,00,000</p>
                <div className="text-[10px] text-slate-400 mt-1">Registered: 2024-04-10</div>
              </div>

            </div>
          </div>

          {/* Replacement Instrument Lineage Tree */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-slate-700" />
              <span>Replacement Instrument Lineage (Spec Section 3.5)</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              When an expiring FDR is renewed or replaced, SecureFDR 360 links the predecessor to the successor instrument. The predecessor transitions to <strong className="text-slate-800 font-mono">SUPERSEDED</strong> and its historical audit provenance remains immutable.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-slate-300 text-slate-600">
                <span className="text-[10px] text-slate-400 block font-sans">Predecessor (Original)</span>
                <span className="font-bold text-slate-800">AICTE-FDR-2021-000492</span>
                <span className="text-[10px] text-slate-500 block font-sans">Status: SUPERSEDED</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

              <div className="p-2 bg-white rounded border border-emerald-300 text-slate-900 shadow-2xs">
                <span className="text-[10px] text-emerald-700 block font-sans font-bold">Successor (Active Renewal)</span>
                <span className="font-bold text-slate-900">AICTE-FDR-2026-001001</span>
                <span className="text-[10px] text-emerald-800 block font-sans font-medium">Status: ACCEPTED & BANK VERIFIED</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
