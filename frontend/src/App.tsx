import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlossaryModal } from './components/common/GlossaryModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { InstrumentListView } from './components/instruments/InstrumentListView';
import { DigitalDepositPassport } from './components/instruments/DigitalDepositPassport';
import { AddFdrWizard } from './components/instruments/AddFdrWizard';
import { AicteWorkbenchView } from './components/scrutiny/AicteWorkbenchView';
import { BankSandboxView } from './components/bank/BankSandboxView';
import { ReleaseWorkspaceView } from './components/release/ReleaseWorkspaceView';
import { CollateralIntelligenceView } from './components/collateral/CollateralIntelligenceView';
import { LedgerExplorerView } from './components/ledger/LedgerExplorerView';
import { PolicyManagerView } from './components/policy/PolicyManagerView';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'instruments':
        return <InstrumentListView />;
      case 'passport':
        return <DigitalDepositPassport />;
      case 'add-fdr':
        return <AddFdrWizard />;
      case 'scrutiny':
        return <AicteWorkbenchView />;
      case 'bank-sandbox':
        return <BankSandboxView />;
      case 'release-cases':
        return <ReleaseWorkspaceView />;
      case 'collateral':
        return <CollateralIntelligenceView />;
      case 'ledger':
        return <LedgerExplorerView />;
      case 'policies':
        return <PolicyManagerView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Official Clean White Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex">
        {/* Responsive Navigation */}
        <Sidebar />

        {/* Primary Viewport with responsive padding */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Modals & Drawers */}
      <GlossaryModal />
      <NotificationDrawer />
    </div>
  );
};

export default AppContent;
