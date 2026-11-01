# SecureFDR 360 — AICTE Regulatory Assurance & Trust Ledger Portal

**Smart India Hackathon 2026** — Problem Statement ID: **26265**  
**Organization:** All India Council for Technical Education (AICTE)  
**Department:** Regulation Bureau  
**Theme:** Smart Automation / Financial Instrument Assurance  

---

## Live Deployment & Repository

* **GitHub Repository:** [https://github.com/sashankmudraboyina/secure_fdr.git](https://github.com/sashankmudraboyina/secure_fdr.git)
* **Production Deployment:** [https://securefdr-main.vercel.app](https://securefdr-main.vercel.app)

---

## Overview

**SecureFDR 360** is a centralized, auditable financial instrument lifecycle portal designed to streamline the management of security deposits and Fixed Deposit Receipts (FDRs) pledged by higher education technical institutions in India.

The prototype demonstrates four foundational architectural pillars:
1. **Digital Deposit Passport:** A single-pane identity card for each FDR showing declared values, independent bank attestation, and regulatory approvals.
2. **Bank Verification Sandbox:** Direct simulation of Core Banking System (CBS) confirmations with cryptographic keypair signatures (RSA-PSS / ECDSA SHA-256).
3. **Hyperledger Fabric Trust Ledger:** Permissioned blockchain anchoring for document SHA-256 hashes, attestation digests, and state transitions without writing sensitive account numbers to shared ledgers.
4. **Policy-Driven Release Workflow:** Multi-bureau clearance gates (Approval Bureau, PGRC, Vigilance Bureau, Finance Bureau) ensuring human approval authority.

---

## Demographic-First User Experience (Responsive Design)

* **Multi-Device Support:** Fully responsive across mobile, tablet, and desktop viewports with a slide-over mobile navigation drawer, fluid typography, touch-friendly controls, and horizontally scrollable data tables.
* **Higher Education Institution Administrators (Principals, Registrars, Finance Officers):** Clear Indian numbering (`₹ 35,00,000 / 35 Lakhs`), straightforward 3-step wizard with live OCR preview, and a built-in **Regulatory & Banking Terminology Glossary** with bilingual English & Hindi transliterated definitions.
* **AICTE Scrutiny Reviewers & Competent Approvers:** Side-by-side comparison matrix, discrepancy resolution tools, and multi-bureau clearance packs.
* **Bank Verifiers (Branch Managers at SBI, HDFC, PNB):** Dedicated CBS portal with fixture responses and cryptographic signature previews.
* **Auditors & Vigilance Officers:** Immutable event ledger, block heights, and privacy-preserving HMAC duplicate collision graphs.

### Visual Design Integrity (No "AI Slop")
* **Design Inspiration:** Follows the **GOV.UK Design System** and **U.S. Web Design System (USWDS)** for calm, clean, authoritative government portals.
* **Clean Header:** Pure white header without distracting prototype badges or saturated blue banners.
* **Summary Lists & Task Lists:** Standard government patterns for key-value pair summaries and clearance checklists.
* **Zero Childish Emojis:** 100% clean, professional Lucide vector stroke icons.

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

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS with custom GovTech Slate & FinTech color palette
- **Icons:** Lucide React (Clean professional line vectors)
- **Deployment:** Vercel Production
