import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';

export const AddFdrWizard: React.FC = () => {
  const { 
    obligations, 
    banks, 
    currentUser, 
    addNewInstrument, 
    setSelectedInstrumentId, 
    setActiveTab,
    instruments 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [selectedObligationId, setSelectedObligationId] = useState<string>(obligations[0]?.id || 'obl-01');
  const [fdrNumber, setFdrNumber] = useState('FDR/SBI/2026/782910');
  const [bankId, setBankId] = useState(banks[0]?.id || 'bank-sbi');
  const [branchIfsc, setBranchIfsc] = useState('SBIN0000300');
  const [amount, setAmount] = useState<number>(3500000);
  const [issueDate, setIssueDate] = useState('2026-09-01');
  const [maturityDate, setMaturityDate] = useState('2034-09-01');
  const [depositorName, setDepositorName] = useState(currentUser.organization);
  const [lienBeneficiary, setLienBeneficiary] = useState('Member Secretary, AICTE, New Delhi');

  // File state
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileSize: string;
    sha256Hash: string;
  } | null>({
    fileName: 'SBI_Special_Deposit_Receipt_35L.pdf',
    fileSize: '1.6 MB',
    sha256Hash: 'a718293847192847192847192847192847192847192847192847192847192847',
  });

  const selectedBank = banks.find(b => b.id === bankId) || banks[0];
  const selectedObligation = obligations.find(o => o.id === selectedObligationId) || obligations[0];

  const handleFinalSubmit = () => {
    const newId = addNewInstrument({
      fdrNumber,
      amount,
      issueDate,
      maturityDate,
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      branchIfsc,
      obligationId: selectedObligation.id,
      obligationRef: selectedObligation.obligationRef,
      depositorName,
      lienBeneficiary,
      document: {
        id: `doc-${Date.now()}`,
        fileName: uploadedFile?.fileName || 'Deposit_Receipt.pdf',
        fileSize: uploadedFile?.fileSize || '1.5 MB',
        mimeType: 'application/pdf',
        uploadDate: new Date().toISOString().split('T')[0],
        sha256Hash: uploadedFile?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        documentType: 'FDR_CERTIFICATE',
        extractedTextPreview: `TERM DEPOSIT RECEIPT. A/c No: 39481928410. Favoring Member Secretary AICTE. Amount: INR ${amount.toLocaleString('en-IN')}`,
        ocrConfidence: 99.2,
      },
    });

    setSelectedInstrumentId(newId);
    setActiveTab('passport');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Top Back / Exit */}
      <div>
        <button
          onClick={() => setActiveTab('instruments')}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel and return to deposits</span>
        </button>
      </div>

      {/* Progress / Step indicator (GOV.UK style) */}
      <div>
        <span className="text-xs font-semibold text-slate-500 block mb-1">
          Step {currentStep} of 3
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {currentStep === 1 && 'Deposit details and statutory obligation'}
          {currentStep === 2 && 'Upload fixed deposit certificate'}
          {currentStep === 3 && 'Check your answers and submit'}
        </h1>
      </div>

      {/* STEP 1: Details */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Select statutory AICTE obligation
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Select which regulatory approval requirement this deposit satisfies.
            </p>
            <select
              value={selectedObligationId}
              onChange={(e) => setSelectedObligationId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            >
              {obligations.map(obl => (
                <option key={obl.id} value={obl.id}>
                  {obl.obligationRef} — {obl.description} (Required: ₹{(obl.requiredAmount/100000).toFixed(0)} Lakhs)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Fixed deposit receipt number
            </label>
            <p className="text-xs text-slate-500 mb-2">
              The reference number printed on your physical bank advice.
            </p>
            <input
              type="text"
              value={fdrNumber}
              onChange={(e) => setFdrNumber(e.target.value)}
              className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Issuing bank
              </label>
              <select
                value={bankId}
                onChange={(e) => {
                  setBankId(e.target.value);
                  const b = banks.find(x => x.id === e.target.value);
                  if (b) setBranchIfsc(b.ifscCode);
                }}
                className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                {banks.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Branch IFSC code
              </label>
              <input
                type="text"
                value={branchIfsc}
                onChange={(e) => setBranchIfsc(e.target.value)}
                className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Principal deposit amount (INR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-xs font-mono font-bold p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Formatted: {formatINRPlain(amount)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Issue date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Maturity date
              </label>
              <input
                type="date"
                value={maturityDate}
                onChange={(e) => setMaturityDate(e.target.value)}
                className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Registered statutory lien beneficiary
            </label>
            <input
              type="text"
              value={lienBeneficiary}
              onChange={(e) => setLienBeneficiary(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Must state exactly: "Member Secretary, AICTE, New Delhi"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition inline-flex items-center gap-1.5"
            >
              <span>Continue to document upload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: Upload */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Upload fixed deposit receipt scan
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Upload a clear PDF or image scan of the signed deposit advice issued by your bank branch. Maximum file size: 10 MB.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">
                {uploadedFile ? uploadedFile.fileName : 'Choose file or drag here'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                PDF, PNG, or JPG
              </p>
            </div>
          </div>

          {uploadedFile && (
            <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900">{uploadedFile.fileName}</span>
                <span className="text-slate-500 ml-2">({uploadedFile.fileSize})</span>
              </div>
              <span className="text-emerald-700 font-medium">Ready</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition inline-flex items-center gap-1.5"
            >
              <span>Continue to review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Check Answers & Submit */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Deposit Reference</dt>
              <dd className="sm:col-span-2 font-mono font-semibold text-slate-900">{fdrNumber}</dd>
            </div>
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Principal Amount</dt>
              <dd className="sm:col-span-2 font-mono font-bold text-slate-900">{formatINRPlain(amount)}</dd>
            </div>
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Issuing Bank</dt>
              <dd className="sm:col-span-2 text-slate-900">{selectedBank.name} ({branchIfsc})</dd>
            </div>
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Maturity Date</dt>
              <dd className="sm:col-span-2 font-mono text-slate-900">{maturityDate}</dd>
            </div>
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Lien Beneficiary</dt>
              <dd className="sm:col-span-2 font-semibold text-slate-900">{lienBeneficiary}</dd>
            </div>
            <div className="py-2.5 sm:grid sm:grid-cols-3">
              <dt className="text-slate-500">Uploaded File</dt>
              <dd className="sm:col-span-2 text-slate-900">{uploadedFile?.fileName}</dd>
            </div>
          </dl>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition"
            >
              Submit fixed deposit declaration
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
