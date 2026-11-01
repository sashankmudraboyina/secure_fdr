import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { BankStatus } from '../../types';
import { BankStatusBadge } from '../common/StatusBadge';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export const BankSandboxView: React.FC = () => {
  const { 
    currentUser, 
    instruments, 
    banks, 
    submitBankAttestation, 
    setSelectedInstrumentId, 
    setActiveTab 
  } = useApp();

  const [activeBankId, setActiveBankId] = useState<string>(currentUser.bankId || 'bank-sbi');
  const activeBank = banks.find(b => b.id === activeBankId) || banks[0];

  const bankInstruments = instruments.filter(i => i.bankId === activeBank.id);
  const [selectedForAttest, setSelectedForAttest] = useState<string | null>(bankInstruments[0]?.id || null);

  const [selectedResultStatus, setSelectedResultStatus] = useState<BankStatus>('ACTIVE_LIEN_CONFIRMED');
  const [confirmedAmount, setConfirmedAmount] = useState<number>(3500000);
  const [confirmedLien, setConfirmedLien] = useState('Member Secretary, AICTE, New Delhi');
  const [confirmedMaturity, setConfirmedMaturity] = useState('2030-08-15');
  const [officerNotes, setOfficerNotes] = useState('Verified in branch CBS term deposit ledger. Exclusive lien marked to AICTE.');

  const currentSelectedInst = instruments.find(i => i.id === selectedForAttest);

  const handleSelectPreset = (preset: 'CONFIRMED' | 'LIEN_MISMATCH' | 'CLOSED') => {
    if (!currentSelectedInst) return;

    if (preset === 'CONFIRMED') {
      setSelectedResultStatus('ACTIVE_LIEN_CONFIRMED');
      setConfirmedAmount(currentSelectedInst.amount);
      setConfirmedLien('Member Secretary, AICTE, New Delhi');
      setConfirmedMaturity(currentSelectedInst.maturityDate);
      setOfficerNotes('Verified in branch CBS. Unencumbered lien registered strictly to AICTE.');
    } else if (preset === 'LIEN_MISMATCH') {
      setSelectedResultStatus('ACTIVE_LIEN_MISMATCH');
      setConfirmedAmount(currentSelectedInst.amount);
      setConfirmedLien('Director of Technical Education, Maharashtra');
      setConfirmedMaturity(currentSelectedInst.maturityDate);
      setOfficerNotes('CBS shows lien registered to State Directorate of Technical Education rather than AICTE.');
    } else if (preset === 'CLOSED') {
      setSelectedResultStatus('CLOSED_OR_ENCASHED');
      setConfirmedAmount(0);
      setConfirmedLien('NONE - ACCOUNT CLOSED');
      setConfirmedMaturity(currentSelectedInst.maturityDate);
      setOfficerNotes('Deposit account was liquidated or encashed at the counter.');
    }
  };

  const handleSignAndSubmit = () => {
    if (selectedForAttest) {
      submitBankAttestation(
        selectedForAttest,
        selectedResultStatus,
        confirmedAmount,
        confirmedLien,
        confirmedMaturity,
        officerNotes
      );
      setSelectedInstrumentId(selectedForAttest);
      setActiveTab('passport');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bank Verification Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Independent Core Banking System (CBS) attestation for pledged fixed deposits
          </p>
        </div>

        {/* Bank instance switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs">
          {banks.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBankId(b.id);
                const inst = instruments.find(i => i.bankId === b.id);
                if (inst) setSelectedForAttest(inst.id);
              }}
              className={`px-3 py-1.5 rounded font-medium transition ${
                activeBankId === b.id ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bank's queue */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-900 uppercase">
              {activeBank.name} Requests ({bankInstruments.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
            {bankInstruments.map((inst) => {
              const isSelected = selectedForAttest === inst.id;
              return (
                <div
                  key={inst.id}
                  onClick={() => {
                    setSelectedForAttest(inst.id);
                    setConfirmedAmount(inst.amount);
                    setConfirmedLien(inst.lienBeneficiary);
                    setConfirmedMaturity(inst.maturityDate);
                  }}
                  className={`p-3.5 text-xs cursor-pointer transition ${
                    isSelected ? 'bg-slate-100 border-l-4 border-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-slate-900">
                      {inst.fdrNumber}
                    </span>
                    <span className="font-mono text-slate-500">
                      {formatINRPlain(inst.amount)}
                    </span>
                  </div>

                  <p className="text-slate-600 truncate mb-1">
                    {inst.institutionName}
                  </p>

                  <div className="mt-1">
                    <BankStatusBadge status={inst.bankStatus} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: CBS Attestation Verification Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          {currentSelectedInst ? (
            <>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-slate-500 block mb-1">
                    Deposit Reference: {currentSelectedInst.fdrNumber}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Verify Deposit in Branch Records
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentSelectedInst.institutionName} (PID: {currentSelectedInst.aictePid})
                  </p>
                </div>

                <BankStatusBadge status={currentSelectedInst.bankStatus} />
              </div>

              {/* Quick Preset Selector */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-2">
                  Select branch CBS verification finding:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSelectPreset('CONFIRMED')}
                    className={`p-3 rounded border text-left text-xs transition ${
                      selectedResultStatus === 'ACTIVE_LIEN_CONFIRMED'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">Active & Lien Verified</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Lien registered to AICTE</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('LIEN_MISMATCH')}
                    className={`p-3 rounded border text-left text-xs transition ${
                      selectedResultStatus === 'ACTIVE_LIEN_MISMATCH'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">Lien Mismatch</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Lien marked to other entity</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('CLOSED')}
                    className={`p-3 rounded border text-left text-xs transition ${
                      selectedResultStatus === 'CLOSED_OR_ENCASHED'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-bold">Account Closed / Liquidated</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Prematurely encashed</span>
                  </button>
                </div>
              </div>

              {/* Verified Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    Confirmed Principal Balance (INR)
                  </label>
                  <input
                    type="number"
                    value={confirmedAmount}
                    onChange={(e) => setConfirmedAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    Confirmed Maturity Date
                  </label>
                  <input
                    type="date"
                    value={confirmedMaturity}
                    onChange={(e) => setConfirmedMaturity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-900 block mb-1">
                    Registered Lien Beneficiary in CBS
                  </label>
                  <input
                    type="text"
                    value={confirmedLien}
                    onChange={(e) => setConfirmedLien(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-900 block mb-1">
                    Branch Officer Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Branch Key: {activeBank.keyId}
                </span>

                <button
                  onClick={handleSignAndSubmit}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition"
                >
                  Submit Bank Attestation
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Select a deposit request to verify.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
