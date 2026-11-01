import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Info,
  Calendar,
  Lock
} from 'lucide-react';

export const PolicyManagerView: React.FC = () => {
  const { policyRules, togglePolicyRule } = useApp();
  const [selectedRuleId, setSelectedRuleId] = useState<string>(policyRules[0]?.id || '');

  const selectedRule = policyRules.find(r => r.id === selectedRuleId) || policyRules[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Policy & Compliance Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Version: 2026.1-ILLUSTRATIVE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Regulatory Policy Rules & Gate Parameters
          </h1>
          <p className="text-xs text-slate-500">
            Explainable policy rule configurations governing statutory FDR acceptance, lock-in moratoriums, and refund gates.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          <span>Active Rules: {policyRules.filter(r => r.enabled).length} / {policyRules.length}</span>
        </div>
      </div>

      {/* Illustrative Notice Banner (Spec Section 4.3) */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <strong className="block mb-0.5">Prototype Regulatory Notice (Section 4.3):</strong>
          Rules and thresholds displayed below are illustrative demonstration parameters designed for SIH Problem Statement 26265. Production deployment requires formal gazette notification and statutory confirmation by the AICTE Regulation Bureau.
        </div>
      </div>

      {/* Main Grid: Rules List & Rule Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Column: List of Rules */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Configured Rule Registry
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">5 Rules</span>
          </div>

          <div className="p-3 space-y-2 flex-1">
            {policyRules.map((rule) => {
              const isSelected = selectedRuleId === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[11px]">
                      {rule.ruleCode}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      rule.enabled 
                        ? isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  <h4 className={`font-semibold text-xs mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {rule.title}
                  </h4>

                  <span className={`text-[10px] block ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    Category: {rule.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Rule Deep Inspector */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedRule && (
            <>
              <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded">
                      {selectedRule.ruleCode}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Category: {selectedRule.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedRule.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePolicyRule(selectedRule.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      selectedRule.enabled
                        ? 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800'
                        : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {selectedRule.enabled ? 'Rule Enabled' : 'Rule Disabled'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                    Statutory Rule Objective:
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedRule.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                    Configurable Parameters (JSON Snapshot):
                  </h4>
                  <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] border border-slate-800 overflow-x-auto">
                    {JSON.stringify(selectedRule.parameters, null, 2)}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Explainable Evaluation Engine Contract</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Unlike black-box scoring, this deterministic policy engine always returns an explicit statutory explanation (e.g. <em>"PASS — Lock-in period of 60 months satisfied"</em> or <em>"FAIL — Lien registered to State DTE instead of AICTE"</em>).
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
