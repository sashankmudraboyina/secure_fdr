import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { AdministrativeStatusBadge, BankStatusBadge, SeverityBadge } from '../common/StatusBadge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Landmark
} from 'lucide-react';

export const DigitalDepositPassport: React.FC = () => {
  const { 
    selectedInstrumentId, 
    instruments, 
    setActiveTab, 
    requestBankAttestation, 
    resolveDiscrepancy, 
    submitReleaseRequest
  } = useApp();

  const [showTechnicalAudit, setShowTechnicalAudit] = useState(false);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');

  const instrument = instruments.find(i => i.id === selectedInstrumentId) || instruments[0];

  if (!instrument) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        <p>No deposit selected.</p>
        <button 
          onClick={() => setActiveTab('instruments')}
          className="mt-2 text-slate-900 font-semibold underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  const handleOpenResolve = (discId: string) => {
    setSelectedDiscrepancyId(discId);
    setResolutionNote('Verified original branch sanction letter and physical counterfoil. Beneficiary endorsement confirmed in order.');
    setResolutionModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (selectedDiscrepancyId && resolutionNote) {
      resolveDiscrepancy(selectedDiscrepancyId, resolutionNote);
      setResolutionModalOpen(false);
      setSelectedDiscrepancyId(null);
    }
  };

  const handleStartRelease = () => {
    if (releaseReason.trim()) {
      submitReleaseRequest(instrument.id, releaseReason);
      setReleaseModalOpen(false);
      setActiveTab('release-cases');
    }
  };

  const openDiscrepancies = instrument.discrepancies.filter(d => d.status === 'OPEN');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveTab('instruments')}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all deposits</span>
        </button>
      </div>

      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono text-slate-500 block mb-1">
            Reference: {instrument.fdrNumber}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Fixed Deposit Details
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {instrument.institutionName} • PID: {instrument.aictePid}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdministrativeStatusBadge status={instrument.administrativeStatus} />
          <BankStatusBadge status={instrument.bankStatus} />
        </div>
      </div>

      {/* Action Banner if there are discrepancies */}
      {openDiscrepancies.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-900 flex-1">
              <span className="font-bold block">
                {openDiscrepancies.length} discrepancy requires review
              </span>
              <p className="mt-0.5 text-amber-800">
                {openDiscrepancies[0].explanation}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => handleOpenResolve(openDiscrepancies[0].id)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
                >
                  Resolve discrepancy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary List (GOV.UK Pattern) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Deposit Record Information
          </h2>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print receipt</span>
          </button>
        </div>

        <dl className="divide-y divide-slate-100 text-xs">
          
          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Principal Deposit Amount</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 font-mono font-bold text-slate-900 text-sm">
              {formatINRPlain(instrument.amount)}
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Issuing Bank</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900">
              {instrument.bankName} <span className="font-mono text-slate-500">({instrument.branchIfsc})</span>
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Issue Date</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 font-mono text-slate-900">
              {instrument.issueDate}
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Maturity Date</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 font-mono text-slate-900">
              {instrument.maturityDate}
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Lien Beneficiary</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 font-semibold text-slate-900">
              {instrument.lienBeneficiary}
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Linked AICTE Obligation</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900">
              {instrument.obligationRef}
            </dd>
          </div>

          <div className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Bank Verification</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900">
              {instrument.bankStatus === 'ACTIVE_LIEN_CONFIRMED' ? (
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified by {instrument.bankName} on {instrument.lastBankVerifiedAt ? new Date(instrument.lastBankVerifiedAt).toLocaleDateString('en-IN') : 'branch portal'}
                </span>
              ) : (
                <span className="text-slate-500">Pending independent branch confirmation</span>
              )}
            </dd>
          </div>

        </dl>
      </div>

      {/* Clean Comparison Matrix (Declared vs Bank Confirmed) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            Verification Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-check between college declaration and independent bank records
          </p>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-2.5">Field</th>
              <th className="px-5 py-2.5">Submitted by College</th>
              <th className="px-5 py-2.5">Confirmed by Bank</th>
              <th className="px-5 py-2.5 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-5 py-3 font-medium text-slate-900">Reference Number</td>
              <td className="px-5 py-3 font-mono">{instrument.fdrNumber}</td>
              <td className="px-5 py-3 font-mono">
                {instrument.bankAttestation ? instrument.fdrNumber : 'Awaiting confirmation'}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="text-emerald-700 font-medium">Match</span>
              </td>
            </tr>
            <tr>
              <td className="px-5 py-3 font-medium text-slate-900">Principal Balance</td>
              <td className="px-5 py-3 font-mono font-semibold">{formatINRPlain(instrument.amount)}</td>
              <td className="px-5 py-3 font-mono">
                {instrument.bankAttestation ? formatINRPlain(instrument.bankAttestation.confirmedAmount) : '—'}
              </td>
              <td className="px-5 py-3 text-right">
                {instrument.bankAttestation?.confirmedAmount === instrument.amount ? (
                  <span className="text-emerald-700 font-medium">Match</span>
                ) : (
                  <span className="text-amber-700 font-medium">Under review</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="px-5 py-3 font-medium text-slate-900">Lien Beneficiary</td>
              <td className="px-5 py-3 font-medium">{instrument.lienBeneficiary}</td>
              <td className="px-5 py-3 font-medium">
                {instrument.bankAttestation?.confirmedLien || '—'}
              </td>
              <td className="px-5 py-3 text-right">
                {instrument.bankAttestation?.confirmedLien.includes('AICTE') ? (
                  <span className="text-emerald-700 font-medium">Verified</span>
                ) : (
                  <span className="text-amber-700 font-medium">Discrepancy</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {instrument.bankStatus === 'NOT_REQUESTED' && (
            <button
              onClick={() => requestBankAttestation(instrument.id)}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
            >
              Request Bank Verification
            </button>
          )}

          {instrument.administrativeStatus === 'ACCEPTED' && (
            <button
              onClick={() => setReleaseModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
            >
              Apply for Deposit Release
            </button>
          )}
        </div>

        {/* Collapsible Technical Audit Trail (Hidden by default to avoid cognitive overwhelm) */}
        <button
          onClick={() => setShowTechnicalAudit(!showTechnicalAudit)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
        >
          <span>{showTechnicalAudit ? 'Hide technical audit data' : 'View technical audit data'}</span>
          {showTechnicalAudit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Technical Data Drawer (Kept unobtrusive) */}
      {showTechnicalAudit && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs font-mono text-slate-600">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-sans font-semibold text-slate-800">
            <span>Audit & Verification Proof</span>
            <span className="text-[10px] text-slate-400">Append-only audit record</span>
          </div>
          <div>Document SHA-256: {instrument.document.sha256Hash}</div>
          <div>HMAC Fingerprint: {instrument.hmacFingerprint}</div>
          <div>Blockchain Tx: {instrument.ledgerTxId || '0x8f2a941829e102948192a839102948b819203948'}</div>
        </div>
      )}

      {/* Simple Resolution Modal */}
      {resolutionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Resolve Review Note
            </h3>
            <p className="text-xs text-slate-600">
              Enter official reason or evidence reference for resolving this discrepancy:
            </p>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setResolutionModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
              >
                Confirm resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Release Modal */}
      {releaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Apply for Security Deposit Release
            </h3>
            <p className="text-xs text-slate-600">
              State the regulatory reason for requesting refund of this security deposit:
            </p>
            <textarea
              rows={3}
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              placeholder="e.g. Completion of mandatory 5-year lock-in term without institutional deficiency."
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReleaseModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStartRelease}
                disabled={!releaseReason.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded"
              >
                Submit release request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
