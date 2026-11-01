# SecureFDR 360 — Build Progress & Architecture Handoff

**Problem Statement:** Smart India Hackathon 2026 — Problem Statement ID 26265  
**Organization:** All India Council for Technical Education (AICTE)  
**Department:** Regulation Bureau  
**Theme:** Smart Automation / Financial Instrument Assurance  

---

## 1. Demographic & Usability Design Principles

The frontend was engineered with acute awareness of the primary user demographics:
1. **Higher Education Institution Administrators (Principals, Registrars, Finance Officers in India):**
   - Often accustomed to portals like AICTE Web Portal, DigiLocker, NeSL, and Samarth.
   - Requires zero ambiguous technical jargon; includes a built-in **Regulatory & Banking Terminology Glossary** with bilingual (English and Hindi transliterated) plain explanations.
   - 4-step guided deposit wizard with instant OCR feedback and Indian currency formatting (`₹ 35,00,000 / 35 Lakhs`).
2. **AICTE Scrutiny Reviewers & Competent Approvers (HQ Regulation Bureau Officers):**
   - Requires immediate visual clarity between **Administrative State** and **Bank CBS Confirmation**.
   - Side-by-side 4-layer comparison matrix (Institution Declared vs OCR Extracted vs Bank Attested vs AICTE Authorized).
   - Multi-bureau clearance tracking pack (Approval Bureau, PGRC, Vigilance Bureau, Finance Bureau).
3. **Scheduled Commercial Bank Verifiers (Branch Managers at SBI, HDFC, PNB):**
   - Direct CBS simulation sandbox console displaying incoming requests, fixture selection, and cryptographic keypair signature preview.
4. **Vigilance Officers & Statutory Auditors:**
   - Full Hyperledger Fabric trust ledger explorer, privacy-preserving HMAC-SHA256 fingerprint collision detection, and immutable event trail.

---

## 2. Zero AI Slop & Aesthetic Standards

- **Restrained Institutional Palette:**
  - Deep Slate / Navy (`#0f172a` / `#1e293b`) for institutional authority.
  - Neutral warm-white card surfaces (`#ffffff`, border `#e2e8f0`).
  - Strict semantic colors: Emerald/Teal for bank-verified lien confirmations; Amber for scrutiny/clarification; Crimson solely for blocking discrepancies and unauthorized encashments.
- **Zero Childish Emojis:**
  - All icons are professional Lucide vector stroke SVGs (`<ShieldCheck />`, `<Landmark />`, `<Scale />`, `<Boxes />`, etc.).
- **Data Integrity:**
  - Distinct separation of administrative states vs bank CBS confirmation states.
  - Tabular numerals (`tabular-nums` and font-mono) for all amounts, dates, IFSC codes, and transaction hashes.

---

## 3. Implemented Modules & Features

| Module | Route / View | Key Features |
|---|---|---|
| **Executive Dashboard** | `dashboard` | Live computed KPIs, corpus amount in INR Lakhs/Crores, bank attestation rate %, maturity watchlist, critical exception alerts, recent Fabric commits. |
| **Deposit Passports** | `instruments` & `passport` | Full repository, dual-status filters, 4-layer comparison matrix, document scan with SHA-256 verification, discrepancy resolution modal. |
| **Add FDR Wizard** | `add-fdr` | 4-step guided process: (1) Obligation link, (2) Document upload, (3) OCR extraction review with confidence %, (4) Duplicate HMAC check & ledger commitment. |
| **AICTE Scrutiny Desk** | `scrutiny` | Reviewer queue, discrepancy resolution workbench, request bank attestation, issue clarification notice to college. |
| **Bank Sandbox Console** | `bank-sandbox` | Multi-bank selector (SBI, HDFC, PNB), CBS test fixtures (Confirmed, Lien Mismatch, Closed/Encashed, Not Found), canonical JSON signing. |
| **Release Cases** | `release-cases` | 6-step release workflow stepper, 4-bureau statutory clearances (Approval, PGRC, Vigilance, Finance), fresh bank revalidation gate, Approver sign-off. |
| **Collateral Intelligence** | `collateral` | HMAC-SHA256 duplicate collision detection, multi-pledge fraud prevention, predecessor-successor replacement lineage. |
| **Trust Ledger Explorer** | `ledger` | Hyperledger Fabric channel `securefdr-channel` blocks, transaction IDs, payload digests, zero-knowledge privacy guarantee. |
| **Policy Rule Engine** | `policies` | Versioned statutory rules (moratorium, lock-in, clearance requirements), explainable PASS/FAIL output. |
| **Glossary & Notifications**| Global Modals | Plain-English & Hindi terminology guide for college principals; real-time regulatory alert feed. |
