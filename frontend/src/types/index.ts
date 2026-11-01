export type UserRole = 
  | 'INSTITUTION_USER' 
  | 'AICTE_REVIEWER' 
  | 'AICTE_APPROVER' 
  | 'BANK_VERIFIER' 
  | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  institutionId?: string;
  bankId?: string;
  avatarInitials: string;
}

export type AdministrativeStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'NEEDS_CLARIFICATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SUPERSEDED'
  | 'RELEASE_IN_PROGRESS'
  | 'RELEASED'
  | 'CLOSED';

export type BankStatus = 
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'ACTIVE_LIEN_CONFIRMED'
  | 'ACTIVE_LIEN_MISMATCH'
  | 'NOT_FOUND'
  | 'CLOSED_OR_ENCASHED'
  | 'MATURITY_MISMATCH'
  | 'EXPIRED_OR_MATURED'
  | 'UNKNOWN_OR_STALE';

export type DiscrepancySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DiscrepancyStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ACCEPTED_WITH_REASON';

export interface Discrepancy {
  id: string;
  instrumentId: string;
  fieldName: string;
  sourceA: string; // e.g. "Institution Declared"
  sourceB: string; // e.g. "OCR Extracted" or "Bank Attestation"
  valueA: string;
  valueB: string;
  severity: DiscrepancySeverity;
  ruleCode: string;
  explanation: string;
  status: DiscrepancyStatus;
  resolvedBy?: string;
  resolutionNote?: string;
  resolvedAt?: string;
}

export interface Institution {
  id: string;
  aictePid: string; // Permanent Institute ID
  legalName: string;
  trustName: string;
  category: 'ENGINEERING_COLLEGE' | 'MANAGEMENT_INSTITUTE' | 'POLYTECHNIC' | 'PHARMACY';
  state: string;
  city: string;
  status: 'ACTIVE' | 'PROVISIONAL' | 'DEFUNCT';
}

export interface Bank {
  id: string;
  bankCode: string; // e.g. "SBI", "HDFC", "PNB"
  name: string;
  branchName: string;
  ifscCode: string;
  keyId: string;
  publicKeyFingerprint: string;
  isSandboxed: boolean;
}

export interface DepositObligation {
  id: string;
  institutionId: string;
  institutionName: string;
  obligationRef: string; // e.g. "OBL-2024-ENG-082"
  description: string;
  category: string;
  requiredAmount: number;
  currency: string;
  status: 'FULFILLED' | 'PENDING_RENEWAL' | 'SHORTFALL' | 'RELEASE_REQUESTED';
}

export interface InstrumentDocument {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  uploadDate: string;
  sha256Hash: string;
  documentType: 'FDR_CERTIFICATE' | 'BANK_SANCTION_LETTER' | 'BOARD_RESOLUTION' | 'RELEASE_NOC';
  extractedTextPreview?: string;
  ocrConfidence?: number;
}

export interface ExtractedOcrData {
  fdrNumber: string;
  confidenceFdr: number;
  bankName: string;
  confidenceBank: number;
  branchIfsc: string;
  confidenceIfsc: number;
  amount: number;
  confidenceAmount: number;
  issueDate: string;
  maturityDate: string;
  depositorName: string;
  lienBeneficiary: string;
  confidenceLien: number;
  extractionEngine: string;
  extractedAt: string;
}

export interface BankAttestation {
  requestId: string;
  keyId: string;
  resultStatus: BankStatus;
  verifiedAt: string;
  bankName: string;
  confirmedAmount: number;
  confirmedLien: string;
  confirmedMaturity: string;
  accountStatus: 'ACTIVE' | 'FROZEN' | 'ENCASHED' | 'NOT_TRACED';
  signatureCanonicalJson: string;
  signatureHex: string;
  signatureValid: boolean;
  notes?: string;
}

export interface Instrument {
  id: string;
  instrumentCode: string; // AICTE-FDR-2026-000184
  fdrNumber: string; // Off-chain real ref e.g. "FDR/SBI/2024/991204"
  hmacFingerprint: string; // Hash of bank + ref + issue date
  institutionId: string;
  institutionName: string;
  aictePid: string;
  obligationId: string;
  obligationRef: string;
  bankId: string;
  bankName: string;
  branchIfsc: string;
  amount: number;
  currency: string;
  issueDate: string;
  maturityDate: string;
  depositorName: string;
  lienBeneficiary: string; // e.g. "Member Secretary, AICTE, New Delhi"
  
  // Strict separation of state
  administrativeStatus: AdministrativeStatus;
  bankStatus: BankStatus;
  lastBankVerifiedAt?: string;
  
  isCurrent: boolean;
  supersededBy?: string;
  supersedes?: string;
  
  document: InstrumentDocument;
  extractedOcr?: ExtractedOcrData;
  bankAttestation?: BankAttestation;
  discrepancies: Discrepancy[];
  
  // Ledger anchor
  ledgerTxId?: string;
  blockNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export type ReleaseCaseStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_CHECK'
  | 'CLEARANCE_PENDING'
  | 'BANK_REVALIDATION_PENDING'
  | 'READY_FOR_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type ClearanceBureau = 
  | 'PGRC' // Public Grievance Redressal Cell
  | 'VIGILANCE_BUREAU' // AICTE Vigilance
  | 'APPROVAL_BUREAU' // Approval Bureau (Deficiency check)
  | 'FINANCE_BUREAU'; // Finance Bureau (Accounts clearance)

export interface ClearanceTask {
  id: string;
  releaseCaseId: string;
  bureau: ClearanceBureau;
  title: string;
  assignedOfficer: string;
  status: 'PENDING' | 'CLEARED' | 'FLAGGED';
  completedAt?: string;
  decisionNote?: string;
  evidenceDocName?: string;
}

export interface PolicyCheckItem {
  ruleCode: string;
  ruleTitle: string;
  status: 'PASS' | 'FAIL' | 'NEEDS_HUMAN_REVIEW';
  explanation: string;
  mandatory: boolean;
}

export interface ReleaseCase {
  id: string;
  caseNumber: string; // e.g. "REL-2026-0042"
  instrumentId: string;
  instrumentCode: string;
  institutionId: string;
  institutionName: string;
  aictePid: string;
  amount: number;
  status: ReleaseCaseStatus;
  reasonForRelease: string;
  submittedAt: string;
  clearanceTasks: ClearanceTask[];
  policyChecks: PolicyCheckItem[];
  bankRevalidationStatus: BankStatus;
  finalDecisionBy?: string;
  finalDecisionAt?: string;
  decisionRemarks?: string;
  ledgerTxId?: string;
}

export interface LedgerEvent {
  id: string;
  resourceType: 'INSTRUMENT' | 'BANK_ATTESTATION' | 'DISCREPANCY' | 'RELEASE_CASE' | 'POLICY_UPDATE';
  resourceId: string;
  resourceCode: string;
  eventType: 
    | 'INSTRUMENT_REGISTERED'
    | 'DOCUMENT_HASH_COMMITTED'
    | 'BANK_ATTESTATION_RECORDED'
    | 'DISCREPANCY_FLAGGED'
    | 'DISCREPANCY_RESOLVED'
    | 'CLEARANCE_GRANTED'
    | 'RELEASE_AUTHORIZED'
    | 'INSTRUMENT_SUPERSEDED';
  txId: string;
  blockNumber: number;
  channel: string;
  actorOrg: 'AICTE-REGULATION-MSP' | 'SBI-BANK-MSP' | 'HDFC-BANK-MSP' | 'PNB-BANK-MSP' | 'INSTITUTION-MSP';
  payloadDigest: string;
  timestamp: string;
}

export interface InAppNotification {
  id: string;
  recipientRole: UserRole | 'ALL';
  type: 'DISCREPANCY' | 'MATURITY_ALERT' | 'BANK_ATTESTATION' | 'CLEARANCE_REQUIRED' | 'RELEASE_DECISION';
  title: string;
  message: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface PolicyRule {
  id: string;
  ruleCode: string;
  title: string;
  description: string;
  category: string;
  parameters: Record<string, any>;
  mandatory: boolean;
  enabled: boolean;
  version: string;
}
