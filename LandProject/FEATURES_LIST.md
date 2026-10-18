# LandSure BD: Features & Integration Status

This inventory provides complete transparency regarding what is functional, simulated for demonstration, and planned for official national integration.

---

## ✅ 1. Fully Implemented & Working Features

1. **Bilingual User Experience (i18n):**
   - Immediate toggle between **বাংলা (Bangla - Default)** and **English** across all pages, navigation, cards, tables, alerts, and modal dialogs.
   - Preference persisted in `localStorage`.
2. **Authentication & Role-Based Access Control (RBAC):**
   - User registration and login with bcrypt password hashing and JWT issuance.
   - Three operational roles: `CITIZEN`, `ADMIN`, `REVIEWER`.
   - Data isolation: citizens cannot view another citizen's private records.
3. **One-Click Quick Demo Login Switcher:**
   - Instant switching between Tanvir (Citizen/Seller), Farhana (Citizen/Buyer), Anisur (Admin), and Shamima (AC Land Reviewer) for rapid testing.
4. **Cadastral Land Parcel Management:**
   - Registration and listing with District, Upazila, Mouza, JL, Khatian, Plot (Dag), Survey Type (CS, SA, RS, BS, City Survey), and decimal shares.
5. **Cryptographic Document Ingestion & Verification:**
   - Server-side 256-bit SHA-256 fingerprinting on uploaded PDF/JPEG/PNG files.
   - Generation of non-guessable UUID verification tokens and visual QR codes.
6. **Rule-Based Fraud Detection Engine:**
   - Transparent, explainable alerts with severity levels (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
   - Duplicate sale detection across registered deeds on the same plot.
   - Mutation record mismatch detection (buyer name inconsistency between deed and mutation khatian).
   - Seller share insufficiency enforcement.
   - Document checksum mismatch detection against reference hashes.
7. **Buy & Sell Transaction Module:**
   - Multi-step transaction workflow: Submission -> Buyer Consent -> Evidence Attachment -> Reviewer Approval.
   - Database-level concurrency control (`withLock`) preventing concurrent race conditions.
   - Atomic re-allocation of ownership shares upon verified transfer approval.
8. **Citizen OTP Consent for Administrative Modifications:**
   - Administrators cannot silently rewrite land records.
   - Sensitive update requests trigger mobile OTP challenges requiring citizen confirmation before changes take effect.
9. **Tamper-Evident SHA-256 Hash-Chained Audit Trail:**
   - Append-only event store where each entry contains its own event hash and its parent's hash.
   - Live mathematical integrity verification validator.
10. **Automated Business Logic Test Suite:**
    - 6 end-to-end tests covering OTP single-use, SHA-256 hashing, duplicate-sale fraud detection, share limits, concurrent race protection, and audit hash-chain integrity.

---

## 🔬 2. Simulated Demonstration Components (Clearly Labeled)

1. **Sample Land Records & Personas:**
   - Seeded with realistic Bangladeshi names (e.g. Tanvir Ahmed, Farhana Yasmin, Shamima Nasreen) and locations (Tejgaon, Badda, Uttara, Joydebpur, Nasirabad).
   - Clearly marked with prominent banners: *"DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD"*.
2. **Mock OTP Provider:**
   - Enabled by default in development (`MOCK_OTP_DEFAULT_CODE=123456`) so judges and reviewers can test the sensitive update consent flow without depending on an active physical SMS gateway.
3. **Reference Sub-Registry Manifest:**
   - Simulated government reference hash repository to demonstrate both Scenario 1 (100% hash match) and Scenario 4 (tampered file hash mismatch).

---

## 🔮 3. Future Official Government Integration Points

1. **National e-Mutation (ই-নামজারি) API:**
   - Direct integration with Land Reform Board (ভূমি সংস্কার বোর্ড) mutation APIs for live khatian pull.
2. **National Sub-Registry Document Registry:**
   - Authorized connection to the Directorate of Registration (নিবন্ধন অধিদপ্তর) to verify genuine registered volume deeds.
3. **National SMS Gateway:**
   - Integration with BTCL or local telecommunication SMS gateways (e.g. Teletalk / Grameenphone / Robi) via the existing adapter interface in `otpService.ts`.
4. **Bangla Gov National Single Sign-On (myGov / নাগরিক প্ল্যাটফর্ম):**
   - Single Sign-On integration for citizen national identity verification.
