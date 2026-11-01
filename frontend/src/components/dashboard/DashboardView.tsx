import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { AdministrativeStatusBadge, BankStatusBadge } from '../common/StatusBadge';
import { 
  PlusCircle, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    instruments, 
    setActiveTab, 
    setSelectedInstrumentId 
  } = useApp();

  // Role-scoped items
  const userInstruments = instruments.filter(inst => {
    if (currentUser.role === 'INSTITUTION_USER' && currentUser.institutionId) {
      return inst.institutionId === currentUser.institutionId;
    }
    if (currentUser.role === 'BANK_VERIFIER' && currentUser.bankId) {
      return inst.bankId === currentUser.bankId;
    }
    return true;
  });

  const totalAmount = userInstruments.reduce((sum, inst) => sum + inst.amount, 0);
  const actionNeededItems = userInstruments.filter(
    i => i.administrativeStatus === 'NEEDS_CLARIFICATION' || i.discrepancies.some(d => d.status === 'OPEN')
  );

  return (
    <div className="space-y-6">
      
      {/* Page Title & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.organization} • Account: {currentUser.name}
          </p>
        </div>

        <div>
          <button
            onClick={() => setActiveTab('add-fdr')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit New Deposit</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner (GOV.UK style) if any item requires attention */}
      {actionNeededItems.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block">Action required on 1 deposit</span>
              <p className="mt-0.5">
                AICTE Scrutiny Officer has requested clarification regarding the registered lien beneficiary for deposit reference {actionNeededItems[0].fdrNumber}.
              </p>
              <button
                onClick={() => {
                  setSelectedInstrumentId(actionNeededItems[0].id);
                  setActiveTab('passport');
                }}
                className="mt-2 text-xs font-semibold text-amber-950 underline flex items-center gap-1"
              >
                <span>Review clarification notice</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calm 3-Card Summary Grid (Clean Government Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <span className="text-xs font-medium text-slate-500 block">
            Total Pledged Deposit Balance
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {formatINRPlain(totalAmount)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across {userInstruments.length} registered instruments
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <span className="text-xs font-medium text-slate-500 block">
            Bank Verification Status
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {userInstruments.filter(i => i.bankStatus === 'ACTIVE_LIEN_CONFIRMED').length} / {userInstruments.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Independently verified with branch
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <span className="text-xs font-medium text-slate-500 block">
            Statutory Obligations
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            Compliant
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Meets AICTE moratorium guidelines
          </span>
        </div>

      </div>

      {/* Main Table: Registered Security Deposits */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Your Registered Fixed Deposits
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official records submitted and verified by AICTE and issuing scheduled banks
            </p>
          </div>

          <button
            onClick={() => setActiveTab('instruments')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            View all ({userInstruments.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Reference Number</th>
                <th className="px-5 py-3">Bank & Branch</th>
                <th className="px-5 py-3">Principal Amount</th>
                <th className="px-5 py-3">Maturity Date</th>
                <th className="px-5 py-3">AICTE Status</th>
                <th className="px-5 py-3">Bank Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userInstruments.slice(0, 5).map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-medium text-slate-900">
                    {inst.fdrNumber}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {inst.bankName}
                  </td>
                  <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                    {formatINRPlain(inst.amount)}
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono">
                    {inst.maturityDate}
                  </td>
                  <td className="px-5 py-3">
                    <AdministrativeStatusBadge status={inst.administrativeStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <BankStatusBadge status={inst.bankStatus} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedInstrumentId(inst.id);
                        setActiveTab('passport');
                      }}
                      className="text-xs font-semibold text-slate-900 hover:underline"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
