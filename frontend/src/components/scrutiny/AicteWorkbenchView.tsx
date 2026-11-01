import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { AdministrativeStatusBadge, BankStatusBadge } from '../common/StatusBadge';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const AicteWorkbenchView: React.FC = () => {
  const { 
    instruments, 
    setSelectedInstrumentId, 
    setActiveTab, 
    requestBankAttestation, 
    currentUser 
  } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(instruments[0]?.id || '');

  const selectedInst = instruments.find(i => i.id === selectedInstId) || instruments[0];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AICTE Review Queue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review institutional submissions, request bank attestations, and verify statutory compliance
        </p>
      </div>

      {/* Grid: Queue & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Column: Queue */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase">
              Pending Scrutiny ({instruments.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {instruments.map(inst => {
              const isSelected = selectedInstId === inst.id;
              const openDiscs = inst.discrepancies.filter(d => d.status === 'OPEN').length;
              return (
                <div
                  key={inst.id}
                  onClick={() => setSelectedInstId(inst.id)}
                  className={`p-3.5 text-xs cursor-pointer transition ${
                    isSelected ? 'bg-slate-100 border-l-4 border-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-slate-900">
                      {inst.fdrNumber}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {formatINRPlain(inst.amount)}
                    </span>
                  </div>

                  <p className="text-slate-600 truncate mb-1">
                    {inst.institutionName}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <AdministrativeStatusBadge status={inst.administrativeStatus} />
                    {openDiscs > 0 && (
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                        {openDiscs} Flag
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Inspection Detail */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          {selectedInst ? (
            <>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-slate-500 block mb-1">
                    Ref: {selectedInst.fdrNumber} • PID: {selectedInst.aictePid}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedInst.institutionName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <AdministrativeStatusBadge status={selectedInst.administrativeStatus} />
                  <BankStatusBadge status={selectedInst.bankStatus} />
                </div>
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block">Principal Amount</span>
                  <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                    {formatINRPlain(selectedInst.amount)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block">Bank Branch</span>
                  <span className="font-medium text-slate-900 mt-0.5 block truncate">
                    {selectedInst.bankName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block">Maturity Date</span>
                  <span className="font-mono font-medium text-slate-900 mt-0.5 block">
                    {selectedInst.maturityDate}
                  </span>
                </div>
              </div>

              {/* Discrepancy Scrutiny if any */}
              {selectedInst.discrepancies.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                  <h3 className="font-bold text-slate-900">
                    Review Flags & Discrepancies
                  </h3>
                  {selectedInst.discrepancies.map(d => (
                    <div key={d.id} className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{d.fieldName}</span>
                        <span className="text-[10px] uppercase font-mono">{d.severity}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-amber-800">{d.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedInstrumentId(selectedInst.id);
                    setActiveTab('passport');
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View full deposit record →
                </button>

                <div className="flex items-center gap-2">
                  {selectedInst.bankStatus === 'NOT_REQUESTED' && (
                    <button
                      onClick={() => requestBankAttestation(selectedInst.id)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
                    >
                      Request Bank Verification
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedInstrumentId(selectedInst.id);
                      setActiveTab('passport');
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800 transition"
                  >
                    Accept Record
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Select an item from the queue to view details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
