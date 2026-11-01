import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  PlusCircle, 
  ShieldCheck, 
  Landmark, 
  Scale, 
  Boxes,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    instruments, 
    releaseCases,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const openDiscrepanciesCount = instruments.reduce(
    (acc, inst) => acc + inst.discrepancies.filter(d => d.status === 'OPEN').length, 
    0
  );
  const pendingBankCount = instruments.filter(i => i.bankStatus === 'PENDING').length;
  const readyReleaseCount = releaseCases.filter(r => r.status === 'READY_FOR_APPROVAL').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'instruments',
      label: 'Security Deposits',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      count: instruments.length,
    },
    {
      id: 'add-fdr',
      label: 'Submit New Deposit',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'scrutiny',
      label: 'AICTE Review Queue',
      icon: <ShieldCheck className="w-4 h-4" />,
      count: openDiscrepanciesCount > 0 ? openDiscrepanciesCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'bank-sandbox',
      label: 'Bank Verifications',
      icon: <Landmark className="w-4 h-4" />,
      count: pendingBankCount > 0 ? pendingBankCount : undefined,
      badgeColor: 'bg-slate-200 text-slate-800',
    },
    {
      id: 'release-cases',
      label: 'Release Requests',
      icon: <Scale className="w-4 h-4" />,
      count: readyReleaseCount > 0 ? readyReleaseCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'ledger',
      label: 'Audit & Ledger Trail',
      icon: <Boxes className="w-4 h-4" />,
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full select-none py-4">
      {/* Scope info */}
      <div className="px-5 pb-3 mb-2 border-b border-slate-100">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
          Current Organization
        </span>
        <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
          {currentUser.organization.split('(')[0].trim()}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs font-medium transition ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-slate-800 text-slate-200' : item.badgeColor || 'bg-slate-100 text-slate-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clean footer */}
      <div className="px-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
        AICTE Approval Process Handbook
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Aligned to w-64 matching header) */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-[calc(100vh-64px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer (Slide-over) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
