import React, { createContext, useContext, useState } from 'react';
import { 
  User, 
  UserRole, 
  Instrument, 
  ReleaseCase, 
  LedgerEvent, 
  InAppNotification, 
  PolicyRule, 
  DepositObligation, 
  Bank, 
  Institution,
  AdministrativeStatus,
  BankStatus
} from '../types';
import { 
  DEMO_USERS, 
  DEMO_INSTITUTIONS, 
  DEMO_BANKS, 
  DEMO_OBLIGATIONS, 
  INITIAL_INSTRUMENTS, 
  INITIAL_RELEASE_CASES, 
  INITIAL_LEDGER_EVENTS, 
  INITIAL_NOTIFICATIONS, 
  POLICY_RULES 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard'
  | 'instruments'
  | 'passport'
  | 'add-fdr'
  | 'scrutiny'
  | 'bank-sandbox'
  | 'release-cases'
  | 'collateral'
  | 'ledger'
  | 'policies';

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedInstrumentId: string | null;
  setSelectedInstrumentId: (id: string | null) => void;
  selectedReleaseCaseId: string | null;
  setSelectedReleaseCaseId: (id: string | null) => void;
  
  // Entities
  instruments: Instrument[];
  obligations: DepositObligation[];
  releaseCases: ReleaseCase[];
  ledgerEvents: LedgerEvent[];
  notifications: InAppNotification[];
  banks: Bank[];
  institutions: Institution[];
  policyRules: PolicyRule[];
  
  // Responsive mobile menu
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Glossary Modal
  isGlossaryOpen: boolean;
  setIsGlossaryOpen: (open: boolean) => void;
  
  // Notification Drawer
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  
  // Actions
  addNewInstrument: (newInst: Partial<Instrument>) => string;
  requestBankAttestation: (instrumentId: string) => void;
  submitBankAttestation: (
    instrumentId: string, 
    status: BankStatus, 
    confirmedAmount: number, 
    confirmedLien: string, 
    confirmedMaturity: string,
    notes: string
  ) => void;
  resolveDiscrepancy: (discrepancyId: string, resolutionNote: string) => void;
  submitReleaseRequest: (instrumentId: string, reason: string) => string;
  completeClearanceTask: (caseId: string, taskId: string, status: 'CLEARED' | 'FLAGGED', note: string) => void;
  decideReleaseCase: (caseId: string, decision: 'APPROVED' | 'REJECTED', remarks: string) => void;
  togglePolicyRule: (ruleId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>('fdr-1001');
  const [selectedReleaseCaseId, setSelectedReleaseCaseId] = useState<string | null>('rel-2026-0042');
  
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [obligations] = useState<DepositObligation[]>(DEMO_OBLIGATIONS);
  const [releaseCases, setReleaseCases] = useState<ReleaseCase[]>(INITIAL_RELEASE_CASES);
  const [ledgerEvents, setLedgerEvents] = useState<LedgerEvent[]>(INITIAL_LEDGER_EVENTS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [banks] = useState<Bank[]>(DEMO_BANKS);
  const [institutions] = useState<Institution[]>(DEMO_INSTITUTIONS);
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>(POLICY_RULES);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const switchRole = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    if (role === 'BANK_VERIFIER') {
      setActiveTab('bank-sandbox');
    } else if (role === 'AICTE_REVIEWER') {
      setActiveTab('scrutiny');
    } else if (role === 'AICTE_APPROVER') {
      setActiveTab('release-cases');
    } else if (role === 'AUDITOR') {
      setActiveTab('ledger');
    } else {
      setActiveTab('dashboard');
    }
    setIsMobileMenuOpen(false);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addNewInstrument = (newInst: Partial<Instrument>): string => {
    const id = `fdr-${Date.now()}`;
    const codeNumber = Math.floor(100000 + Math.random() * 900000);
    const instrumentCode = `AICTE-FDR-2026-00${codeNumber}`;
    const txId = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const blockNum = 160 + ledgerEvents.length;

    const fullInstrument: Instrument = {
      id,
      instrumentCode,
      fdrNumber: newInst.fdrNumber || `FDR/NEW/${Date.now().toString().slice(-6)}`,
      hmacFingerprint: `hmac256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      institutionId: newInst.institutionId || currentUser.institutionId || 'inst-01',
      institutionName: newInst.institutionName || currentUser.organization,
      aictePid: newInst.aictePid || '1-1049281',
      obligationId: newInst.obligationId || 'obl-01',
      obligationRef: newInst.obligationRef || 'OBL-2022-ENG-041',
      bankId: newInst.bankId || 'bank-sbi',
      bankName: newInst.bankName || 'State Bank of India',
      branchIfsc: newInst.branchIfsc || 'SBIN0000300',
      amount: newInst.amount || 2500000,
      currency: 'INR',
      issueDate: newInst.issueDate || '2026-10-01',
      maturityDate: newInst.maturityDate || '2031-10-01',
      depositorName: newInst.depositorName || currentUser.organization,
      lienBeneficiary: newInst.lienBeneficiary || 'Member Secretary, AICTE, New Delhi',
      administrativeStatus: 'SUBMITTED',
      bankStatus: 'NOT_REQUESTED',
      isCurrent: true,
      document: newInst.document || {
        id: `doc-${Date.now()}`,
        fileName: 'FDR_Deposit_Certificate.pdf',
        fileSize: '1.5 MB',
        mimeType: 'application/pdf',
        uploadDate: new Date().toISOString().split('T')[0],
        sha256Hash: 'a718293847192847192847192847192847192847192847192847192847192847',
        documentType: 'FDR_CERTIFICATE',
        extractedTextPreview: 'Term Deposit Receipt. Favoring Member Secretary AICTE.',
        ocrConfidence: 98.4,
      },
      extractedOcr: newInst.extractedOcr,
      discrepancies: newInst.discrepancies || [],
      ledgerTxId: txId,
      blockNumber: blockNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInstruments(prev => [fullInstrument, ...prev]);

    const newLedgerEvent: LedgerEvent = {
      id: `evt-${Date.now()}`,
      resourceType: 'INSTRUMENT',
      resourceId: id,
      resourceCode: instrumentCode,
      eventType: 'INSTRUMENT_REGISTERED',
      txId,
      blockNumber: blockNum,
      channel: 'securefdr-channel',
      actorOrg: 'INSTITUTION-MSP',
      payloadDigest: fullInstrument.hmacFingerprint,
      timestamp: new Date().toISOString(),
    };

    setLedgerEvents(prev => [newLedgerEvent, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'AICTE_REVIEWER',
        type: 'BANK_ATTESTATION',
        title: `New Deposit Submitted: ${instrumentCode}`,
        message: `${fullInstrument.institutionName} has submitted a new FDR for ₹${(fullInstrument.amount / 100000).toFixed(0)} Lakhs. Scrutiny required.`,
        resourceId: id,
        isRead: false,
        createdAt: new Date().toISOString(),
        severity: 'INFO',
      },
      ...prev
    ]);

    return id;
  };

  const requestBankAttestation = (instrumentId: string) => {
    setInstruments(prev => prev.map(inst => {
      if (inst.id === instrumentId) {
        return {
          ...inst,
          bankStatus: 'PENDING',
          updatedAt: new Date().toISOString(),
        };
      }
      return inst;
    }));

    const inst = instruments.find(i => i.id === instrumentId);
    if (inst) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'BANK_VERIFIER',
          type: 'BANK_ATTESTATION',
          title: `Lien Verification Requested: ${inst.fdrNumber}`,
          message: `AICTE has requested branch lien attestation for deposit reference ${inst.fdrNumber} (${inst.bankName}).`,
          resourceId: inst.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          severity: 'INFO',
        },
        ...prev
      ]);
    }
  };

  const submitBankAttestation = (
    instrumentId: string, 
    status: BankStatus, 
    confirmedAmount: number, 
    confirmedLien: string, 
    confirmedMaturity: string,
    notes: string
  ) => {
    const txId = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const blockNum = 165 + ledgerEvents.length;

    setInstruments(prev => prev.map(inst => {
      if (inst.id === instrumentId) {
        const canonical = JSON.stringify({
          accountStatus: status === 'ACTIVE_LIEN_CONFIRMED' ? 'ACTIVE' : 'IRREGULAR',
          amount: confirmedAmount,
          fdrRef: inst.fdrNumber,
          lien: confirmedLien,
          maturityDate: confirmedMaturity,
          nonce: Math.random().toString(36).substring(7),
        });

        const newDiscrepancies = [...inst.discrepancies];
        if (confirmedAmount !== inst.amount && confirmedAmount > 0) {
          newDiscrepancies.push({
            id: `disc-${Date.now()}-amt`,
            instrumentId: inst.id,
            fieldName: 'Amount',
            sourceA: 'Declared Value',
            sourceB: 'Bank Attestation',
            valueA: `₹${inst.amount.toLocaleString('en-IN')}`,
            valueB: `₹${confirmedAmount.toLocaleString('en-IN')}`,
            severity: 'HIGH',
            ruleCode: 'AMOUNT_MISMATCH',
            explanation: 'Bank attestation reports a different principal balance than declared by institution.',
            status: 'OPEN',
          });
        }
        if (status === 'ACTIVE_LIEN_MISMATCH') {
          newDiscrepancies.push({
            id: `disc-${Date.now()}-lien`,
            instrumentId: inst.id,
            fieldName: 'Lien Beneficiary',
            sourceA: 'Declared AICTE Beneficiary',
            sourceB: 'Bank CBS Attestation',
            valueA: inst.lienBeneficiary,
            valueB: confirmedLien,
            severity: 'CRITICAL',
            ruleCode: 'LIEN_NOT_CONFIRMED',
            explanation: 'Bank records demonstrate lien is NOT registered to Member Secretary AICTE.',
            status: 'OPEN',
          });
        }
        if (status === 'CLOSED_OR_ENCASHED') {
          newDiscrepancies.push({
            id: `disc-${Date.now()}-closed`,
            instrumentId: inst.id,
            fieldName: 'Deposit Status',
            sourceA: 'Active Declaration',
            sourceB: 'Bank Confirmation',
            valueA: 'Claimed Active',
            valueB: 'Account Closed / Liquidated',
            severity: 'CRITICAL',
            ruleCode: 'BANK_STATUS_CLOSED',
            explanation: 'Deposit was encashed or closed in bank records.',
            status: 'OPEN',
          });
        }

        return {
          ...inst,
          bankStatus: status,
          lastBankVerifiedAt: new Date().toISOString(),
          discrepancies: newDiscrepancies,
          bankAttestation: {
            requestId: `REQ-AUTO-${Date.now().toString().slice(-4)}`,
            keyId: 'demo-sbi-rsa-2026-v1',
            resultStatus: status,
            verifiedAt: new Date().toISOString(),
            bankName: inst.bankName,
            confirmedAmount,
            confirmedLien,
            confirmedMaturity,
            accountStatus: status === 'ACTIVE_LIEN_CONFIRMED' ? 'ACTIVE' : (status === 'CLOSED_OR_ENCASHED' ? 'ENCASHED' : 'FROZEN'),
            signatureCanonicalJson: canonical,
            signatureHex: `3045022100${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
            signatureValid: true,
            notes,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return inst;
    }));

    const inst = instruments.find(i => i.id === instrumentId);
    if (inst) {
      setLedgerEvents(prev => [
        {
          id: `evt-${Date.now()}`,
          resourceType: 'BANK_ATTESTATION',
          resourceId: inst.id,
          resourceCode: inst.instrumentCode,
          eventType: 'BANK_ATTESTATION_RECORDED',
          txId,
          blockNumber: blockNum,
          channel: 'securefdr-channel',
          actorOrg: 'SBI-BANK-MSP',
          payloadDigest: `sha256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
    }
  };

  const resolveDiscrepancy = (discrepancyId: string, resolutionNote: string) => {
    setInstruments(prev => prev.map(inst => {
      const updatedDisc = inst.discrepancies.map(disc => {
        if (disc.id === discrepancyId) {
          return {
            ...disc,
            status: 'RESOLVED' as const,
            resolvedBy: currentUser.name,
            resolutionNote,
            resolvedAt: new Date().toISOString(),
          };
        }
        return disc;
      });
      return { ...inst, discrepancies: updatedDisc };
    }));

    setLedgerEvents(prev => [
      {
        id: `evt-${Date.now()}`,
        resourceType: 'DISCREPANCY',
        resourceId: discrepancyId,
        resourceCode: discrepancyId,
        eventType: 'DISCREPANCY_RESOLVED',
        txId: `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        blockNumber: 170 + ledgerEvents.length,
        channel: 'securefdr-channel',
        actorOrg: 'AICTE-REGULATION-MSP',
        payloadDigest: `sha256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        timestamp: new Date().toISOString(),
      },
      ...prev
    ]);
  };

  const submitReleaseRequest = (instrumentId: string, reason: string): string => {
    const inst = instruments.find(i => i.id === instrumentId);
    if (!inst) return '';

    const newCaseId = `rel-${Date.now()}`;
    const caseNumber = `REL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: ReleaseCase = {
      id: newCaseId,
      caseNumber,
      instrumentId: inst.id,
      instrumentCode: inst.instrumentCode,
      institutionId: inst.institutionId,
      institutionName: inst.institutionName,
      aictePid: inst.aictePid,
      amount: inst.amount,
      status: 'CLEARANCE_PENDING',
      reasonForRelease: reason,
      submittedAt: new Date().toISOString(),
      clearanceTasks: [
        {
          id: `cl-${Date.now()}-1`,
          releaseCaseId: newCaseId,
          bureau: 'APPROVAL_BUREAU',
          title: 'Approval Bureau Norms Verification (No EOA Deficiencies)',
          assignedOfficer: 'Dr. S. K. Mahajan (Director, Approval Bureau)',
          status: 'PENDING',
        },
        {
          id: `cl-${Date.now()}-2`,
          releaseCaseId: newCaseId,
          bureau: 'PGRC',
          title: 'Public Grievance Redressal Cell (PGRC) Scrutiny',
          assignedOfficer: 'Smt. Anjali Roy (Joint Director, PGRC)',
          status: 'PENDING',
        },
        {
          id: `cl-${Date.now()}-3`,
          releaseCaseId: newCaseId,
          bureau: 'VIGILANCE_BUREAU',
          title: 'Chief Vigilance Officer (CVO) Inquiry Check',
          assignedOfficer: 'Shri Vinod Kumar (CVO, AICTE)',
          status: 'PENDING',
        },
        {
          id: `cl-${Date.now()}-4`,
          releaseCaseId: newCaseId,
          bureau: 'FINANCE_BUREAU',
          title: 'AICTE Regulatory Fee Dues & Penalty Clearance',
          assignedOfficer: 'Shri R. P. Gupta (Finance Officer)',
          status: 'PENDING',
        }
      ],
      policyChecks: [
        {
          ruleCode: 'RULE-FDR-LOCKIN-01',
          ruleTitle: 'Minimum Statutory Lock-in Period Check',
          status: 'PASS',
          explanation: 'Maturity analysis confirms minimum regulatory lock-in duration has been satisfied.',
          mandatory: true,
        },
        {
          ruleCode: 'RULE-LIEN-STATUS',
          ruleTitle: 'Bank Revalidation & Active Lien Integrity',
          status: inst.bankStatus === 'ACTIVE_LIEN_CONFIRMED' ? 'PASS' : 'NEEDS_HUMAN_REVIEW',
          explanation: `Bank status currently: ${inst.bankStatus}. Fresh revalidation required before final approval.`,
          mandatory: true,
        },
        {
          ruleCode: 'RULE-MULTI-BUREAU-NOC',
          ruleTitle: 'All Statutory Bureau Clearances Granted',
          status: 'NEEDS_HUMAN_REVIEW',
          explanation: 'Clearance tasks in progress across 4 statutory bureaus.',
          mandatory: true,
        }
      ],
      bankRevalidationStatus: inst.bankStatus,
    };

    setReleaseCases(prev => [newCase, ...prev]);
    setInstruments(prev => prev.map(i => i.id === instrumentId ? { ...i, administrativeStatus: 'RELEASE_IN_PROGRESS' } : i));

    return newCaseId;
  };

  const completeClearanceTask = (caseId: string, taskId: string, status: 'CLEARED' | 'FLAGGED', note: string) => {
    setReleaseCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedTasks = c.clearanceTasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status,
              completedAt: new Date().toISOString(),
              decisionNote: note,
              evidenceDocName: `NOC_${t.bureau}_Verification.pdf`,
            };
          }
          return t;
        });

        const allCleared = updatedTasks.every(t => t.status === 'CLEARED');
        const nextStatus = allCleared ? 'READY_FOR_APPROVAL' : c.status;

        return {
          ...c,
          clearanceTasks: updatedTasks,
          status: nextStatus,
        };
      }
      return c;
    }));
  };

  const decideReleaseCase = (caseId: string, decision: 'APPROVED' | 'REJECTED', remarks: string) => {
    const txId = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    const blockNum = 175 + ledgerEvents.length;

    setReleaseCases(prev => prev.map(c => {
      if (c.id === caseId) {
        setInstruments(insts => insts.map(inst => {
          if (inst.id === c.instrumentId) {
            return {
              ...inst,
              administrativeStatus: decision === 'APPROVED' ? 'RELEASED' : 'ACCEPTED',
              updatedAt: new Date().toISOString(),
            };
          }
          return inst;
        }));

        return {
          ...c,
          status: decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
          finalDecisionBy: currentUser.name,
          finalDecisionAt: new Date().toISOString(),
          decisionRemarks: remarks,
          ledgerTxId: txId,
        };
      }
      return c;
    }));

    const theCase = releaseCases.find(c => c.id === caseId);
    if (theCase) {
      setLedgerEvents(prev => [
        {
          id: `evt-${Date.now()}`,
          resourceType: 'RELEASE_CASE',
          resourceId: theCase.id,
          resourceCode: theCase.caseNumber,
          eventType: decision === 'APPROVED' ? 'RELEASE_AUTHORIZED' : 'CLEARANCE_GRANTED',
          txId,
          blockNumber: blockNum,
          channel: 'securefdr-channel',
          actorOrg: 'AICTE-REGULATION-MSP',
          payloadDigest: `sha256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
    }
  };

  const togglePolicyRule = (ruleId: string) => {
    setPolicyRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        activeTab,
        setActiveTab,
        selectedInstrumentId,
        setSelectedInstrumentId,
        selectedReleaseCaseId,
        setSelectedReleaseCaseId,
        instruments,
        obligations,
        releaseCases,
        ledgerEvents,
        notifications,
        banks,
        institutions,
        policyRules,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isGlossaryOpen,
        setIsGlossaryOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        markNotificationRead,
        addNewInstrument,
        requestBankAttestation,
        submitBankAttestation,
        resolveDiscrepancy,
        submitReleaseRequest,
        completeClearanceTask,
        decideReleaseCase,
        togglePolicyRule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
