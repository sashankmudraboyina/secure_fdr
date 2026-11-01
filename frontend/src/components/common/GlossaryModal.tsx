import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { REGULATORY_GLOSSARY } from '../../data/mockData';
import { X, Search } from 'lucide-react';

export const GlossaryModal: React.FC = () => {
  const { isGlossaryOpen, setIsGlossaryOpen } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isGlossaryOpen) return null;

  const filteredItems = REGULATORY_GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (item.hindiTerm && item.hindiTerm.includes(filterQuery)) ||
    item.simpleExplanation.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Help & Terminology Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear definitions of statutory and banking terms used in this service
            </p>
          </div>
          <button 
            onClick={() => setIsGlossaryOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search terms (e.g. Lien, FDR, PID, Attestation)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {filteredItems.map((item, index) => (
            <div key={index} className={index > 0 ? "pt-4" : ""}>
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {item.term}
                </h3>
                {item.hindiTerm && (
                  <span className="text-xs text-slate-500">
                    {item.hindiTerm}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-1.5">
                {item.simpleExplanation}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-700">AICTE Context: </strong>
                {item.regulatoryContext}
              </p>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching terms found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={() => setIsGlossaryOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
