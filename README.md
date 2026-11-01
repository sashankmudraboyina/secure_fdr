# SecureFDR 360 — AICTE Regulatory Assurance & Trust Ledger Portal

**Smart India Hackathon 2026** — Problem Statement ID: **26265**  
**Organization:** All India Council for Technical Education (AICTE)  
**Department:** Regulation Bureau  
**Theme:** Smart Automation / Financial Instrument Assurance  

---

## Overview

**SecureFDR 360** is a centralized, auditable financial instrument lifecycle portal designed to streamline the management of security deposits and Fixed Deposit Receipts (FDRs) pledged by higher education technical institutions in India.

The prototype demonstrates four foundational architectural pillars:
1. **Digital Deposit Passport:** A single-pane tamper-evident identity card for each FDR showing declared values, OCR extraction, independent bank attestation, and regulatory approvals.
2. **Bank Verification Sandbox:** Direct simulation of Core Banking System (CBS) confirmations with cryptographic keypair signatures (RSA-PSS / ECDSA SHA-256).
3. **Hyperledger Fabric Trust Ledger:** Permissioned blockchain anchoring for document SHA-256 hashes, attestation digests, and state transitions without writing sensitive account numbers to shared ledgers.
4. **Policy-Driven Release Workflow:** Multi-bureau clearance gates (Approval Bureau, PGRC, Vigilance Bureau, Finance Bureau) ensuring human approval authority.

---

## Demographic-First User Experience

This frontend prototype was purposefully engineered for its primary user demographics:
- **Higher Education Institution Administrators (Principals, Registrars, Finance Officers):** Clear Indian numbering (`₹ 35,00,000 / 35 Lakhs`), straightforward 4-step wizard with live OCR preview, and a built-in **Regulatory & Banking Terminology Glossary** with bilingual English & Hindi transliterated definitions.
- **AICTE Scrutiny Reviewers & Competent Approvers:** Side-by-side 4-layer comparison matrix, discrepancy resolution tools, and multi-bureau clearance packs.
- **Bank Verifiers (Branch Managers at SBI, HDFC, PNB):** Dedicated CBS portal with fixture responses and cryptographic signature previews.
- **Auditors & Vigilance Officers:** Immutable event ledger, block heights, and privacy-preserving HMAC duplicate collision graphs.

### Visual Design Integrity (No "AI Slop")
- **Palette:** Deep Slate / Navy (`#0f172a` / `#1e293b`), crisp neutral white cards (`#ffffff`, border `#e2e8f0`), restrained emerald for verified attestations, amber for review, and crimson for critical breaches.
- **Typography:** Inter with tabular numerals (`font-mono` / `tabular-nums`) for currency amounts, IFSC codes, dates, and cryptographic digests.
- **Icons:** 100% clean, professional Lucide vector stroke icons—zero childish emojis or saturated gradient cards.

---

## Quick Start Instructions

### Prerequisites
- **Node.js:** v18+ (tested on v24.16.0)
- **npm:** v9+ (tested on 11.13.0)

### 1. Install & Build
```bash
# From workspace root:
npm run build
```

### 2. Run the Development Server
```bash
# From workspace root:
npm run dev

# Or directly from the frontend directory:
cd frontend
npm run dev
```

The application will boot at `http://localhost:3000`.

---

## 1-Click Persona Switcher

The top institutional header includes an instant **Prototype Persona Switcher** dropdown. You can switch between all 5 roles on the fly:
1. **Higher Education Institution (Registrar):** Dr. Arvind Deshmukh (VJTI Mumbai)
2. **AICTE Scrutiny Reviewer (Regulation Bureau):** Smt. Neha Sharma (AICTE HQ, New Delhi)
3. **AICTE Competent Approver (Advisor / Bureau Head):** Prof. K. Radhakrishnan (AICTE Regulation Bureau)
4. **Scheduled Commercial Bank Verifier:** Rajesh Verma (State Bank of India, Nariman Point Commercial Branch)
5. **Statutory Auditor & Vigilance Inspector:** Shri S. Ramanathan (Office of the Principal Director of Audit)

---

## Test Fixtures & Pre-seeded Scenarios

The prototype comes pre-seeded with representative fixtures covering all SIH problem statement criteria:
- **DEMO-FDR-1001:** Baseline compliant instrument (₹35 Lakhs, State Bank of India, Active Lien Confirmed, Blockchain Block #142).
- **DEMO-FDR-1002:** Beneficiary mismatch discrepancy (HDFC Bank CBS shows lien marked to State DTE instead of Member Secretary AICTE).
- **DEMO-FDR-1003:** Critical unauthorized encashment alert (Punjab National Bank CBS attestation reports the college liquidated the corpus prematurely).
- **DEMO-FDR-1004:** Unregistered certificate (SBI CBS reports account not found in branch records).
- **DEMO-FDR-1005 & REL-2026-0042:** Complete release & refund workflow with 4 cleared bureau NOCs ready for Competent Approver sign-off.
- **DEMO-FDR-1006:** Collateral conflict (HMAC-SHA256 fingerprint collision detecting an identical certificate pledged across multiple regulatory registries).

---

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS with custom GovTech Slate & FinTech color palette
- **Icons:** Lucide React (Clean professional line vectors)
- **State Management:** React Context API with immutable state transitions and simulated Fabric event stream
