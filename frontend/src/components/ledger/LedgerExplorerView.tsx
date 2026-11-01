import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckCircle2 } from 'lucide-react';

export const LedgerExplorerView: React.FC = () => {
  const { ledgerEvents } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = ledgerEvents.filter(evt => {
    const q = searchQuery.toLowerCase();
    return (
      evt.txId.toLowerCase().includes(q) ||
      evt.resourceCode.toLowerCase().includes(q) ||
      evt.eventType.toLowerCase().includes(q) ||
      evt.actorOrg.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Audit & Ledger Trail
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological, append-only record of all deposit submissions, bank attestations, and approval decisions
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search audit trail by event type, deposit reference, or authority..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Events Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Date & Time</th>
              <th className="px-5 py-3">Event Action</th>
              <th className="px-5 py-3">Deposit Reference</th>
              <th className="px-5 py-3">Recording Authority</th>
              <th className="px-5 py-3 text-right">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-3 font-mono text-slate-600">
                  {new Date(evt.timestamp).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-5 py-3 font-medium text-slate-900">
                  {evt.eventType.replace(/_/g, ' ')}
                </td>
                <td className="px-5 py-3 font-mono text-slate-700">
                  {evt.resourceCode}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {evt.actorOrg.replace(/-/g, ' ')}
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
