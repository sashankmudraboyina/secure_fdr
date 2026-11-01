import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { BankStatusBadge } from '../common/StatusBadge';
import { CheckCircle2, Clock, Check } from 'lucide-react';

export const ReleaseWorkspaceView: React.FC = () => {
  const { 
    releaseCases, 
    completeClearanceTask, 
    decideReleaseCase, 
    currentUser 
  } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(releaseCases[0]?.id || '');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [approverRemarks, setApproverRemarks] = useState(
    'Scrutinized all 4 bureau NOCs and fresh bank attestation. Moratorium lock-in period satisfied. Release authorized in accordance with AICTE Approval Process Handbook.'
  );

  const selectedCase = releaseCases.find(c => c.id === selectedCaseId) || releaseCases[0];

  const handleDecision = () => {
    if (selectedCase && approverRemarks) {
      decideReleaseCase(selectedCase.id, decisionType, approverRemarks);
      setApprovalModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-mono text-slate-500 block mb-1">
          Case Ref: {selectedCase?.caseNumber}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Deposit Release Application
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {selectedCase?.institutionName} • PID: {selectedCase?.aictePid}
        </p>
      </div>

      {selectedCase ? (
        <div className="space-y-6">
          
          {/* Key Facts */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Pledged Deposit Reference</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedCase.instrumentCode}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Refund Amount</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  {formatINRPlain(selectedCase.amount)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Stage</span>
                <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
                  {selectedCase.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-900">Reason for release: </strong>
              {selectedCase.reasonForRelease}
            </div>
          </div>

          {/* Task List (GOV.UK Task List Pattern) */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                1. Statutory Bureau Clearances (4 Required)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All 4 statutory units must issue a clearance certificate before release approval
              </p>
            </div>

            <ul className="divide-y divide-slate-100 text-xs">
              {selectedCase.clearanceTasks.map((task) => (
                <li key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {task.title}
                    </span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Assigned: {task.assignedOfficer}
                    </span>
                    {task.decisionNote && (
                      <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                        {task.decisionNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                      task.status === 'CLEARED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {task.status === 'CLEARED' && <Check className="w-3 h-3 text-emerald-600" />}
                      <span>{task.status}</span>
                    </span>

                    {task.status === 'PENDING' && (
                      <button
                        onClick={() => completeClearanceTask(
                          selectedCase.id, 
                          task.id, 
                          'CLEARED', 
                          'Statutory records verified. No deficiency outstanding.'
                        )}
                        className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
                      >
                        Sign NOC
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Bank Revalidation Gate */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between text-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                2. Bank Revalidation Status
              </h2>
              <p className="text-slate-500 mt-0.5">
                Fresh branch attestation verifying active deposit status and AICTE lien
              </p>
            </div>
            <BankStatusBadge status={selectedCase.bankRevalidationStatus} />
          </div>

          {/* Section 3: Approver Action Box */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              3. Final Authorization Order
            </h2>
            <p className="text-xs text-slate-500">
              Formal discharge of the AICTE lien on this fixed deposit. Money is released by the bank to the college upon presentation of this order.
            </p>

            {selectedCase.status === 'READY_FOR_APPROVAL' ? (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setDecisionType('APPROVED');
                    setApprovalModalOpen(true);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition"
                >
                  Authorize Deposit Release
                </button>
                <button
                  onClick={() => {
                    setDecisionType('REJECTED');
                    setApprovalModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition"
                >
                  Reject Application
                </button>
              </div>
            ) : selectedCase.status === 'APPROVED' ? (
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
                <strong className="block">Release Order Issued</strong>
                <p className="mt-0.5">
                  Authorized by {selectedCase.finalDecisionBy} on {new Date(selectedCase.finalDecisionAt || '').toLocaleDateString('en-IN')}.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                All 4 statutory bureau clearances must be completed before approver sign-off.
              </p>
            )}
          </div>

        </div>
      ) : null}

      {/* Approver Sign-off Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {decisionType === 'APPROVED' ? 'Confirm Release Authorization' : 'Reject Release Request'}
            </h3>
            <p className="text-xs text-slate-600">
              Enter official remarks for the regulatory record:
            </p>
            <textarea
              rows={3}
              value={approverRemarks}
              onChange={(e) => setApproverRemarks(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setApprovalModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
              >
                Confirm {decisionType === 'APPROVED' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
