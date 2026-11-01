import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINRPlain } from '../../data/mockData';
import { AdministrativeStatusBadge, BankStatusBadge } from '../common/StatusBadge';
import { Search, Download, PlusCircle } from 'lucide-react';

export const InstrumentListView: React.FC = () => {
  const { instruments, setActiveTab, setSelectedInstrumentId, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => {
      // Role scope check
      if (currentUser.role === 'INSTITUTION_USER' && currentUser.institutionId) {
        if (inst.institutionId !== currentUser.institutionId) return false;
      }
      if (currentUser.role === 'BANK_VERIFIER' && currentUser.bankId) {
        if (inst.bankId !== currentUser.bankId) return false;
      }

      const q = searchQuery.toLowerCase();
      const matchSearch = 
        inst.fdrNumber.toLowerCase().includes(q) ||
        inst.institutionName.toLowerCase().includes(q) ||
        inst.aictePid.toLowerCase().includes(q) ||
        inst.bankName.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (statusFilter !== 'ALL' && inst.administrativeStatus !== statusFilter) return false;

      return true;
    });
  }, [instruments, searchQuery, statusFilter, currentUser]);

  const handleExportCSV = () => {
    const headers = ['Reference Number', 'Institution', 'PID', 'Bank', 'Amount (INR)', 'Maturity Date', 'Status'];
    const rows = filteredInstruments.map(i => [
      i.fdrNumber,
      `"${i.institutionName}"`,
      i.aictePid,
      `"${i.bankName}"`,
      i.amount,
      i.maturityDate,
      i.administrativeStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Security_Deposits_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security Deposits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official repository of fixed deposits pledged under AICTE regulatory requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('add-fdr')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit New Deposit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by deposit number, college name, or PID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white text-slate-700"
          >
            <option value="ALL">All statuses</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="NEEDS_CLARIFICATION">Action needed</option>
            <option value="RELEASE_IN_PROGRESS">Release in progress</option>
            <option value="RELEASED">Released</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Reference Number</th>
                <th className="px-5 py-3">Institution & PID</th>
                <th className="px-5 py-3">Bank</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Maturity Date</th>
                <th className="px-5 py-3">AICTE Status</th>
                <th className="px-5 py-3">Bank Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstruments.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-medium text-slate-900">
                    {inst.fdrNumber}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900 truncate max-w-[200px]" title={inst.institutionName}>
                      {inst.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      PID: {inst.aictePid}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {inst.bankName}
                  </td>
                  <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                    {formatINRPlain(inst.amount)}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-600">
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

              {filteredInstruments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching deposit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
