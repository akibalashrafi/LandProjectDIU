# LandSure BD: Hackathon Presentation & Demonstration Script 🇧🇩

Follow this exact walkthrough to present all 8 prompt scenarios cleanly during a 3-to-5 minute pitch:

---

## ⏱️ Step 1: Public Portal & Bilingual First Impression (0:00 - 0:45)
1. Open `http://localhost:5173`.
2. Notice the application defaults to **বাংলা (Bangla)** typography with clean civic emerald and navy tones.
3. Click the **"English"** toggle on the navbar. Notice all navigation items, badges, alerts, and hero headers update immediately without page reload. Switch back or stay in preferred language.
4. Point out the clear honesty banner:
   *"ডেমো ডেটা — সরকারি অফিসিয়াল রেকর্ড নয় / DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD"*.
5. In the Hero search box, enter `342` and press **"Verify"** to show instant public cadastral check for Plot 342 in Tejgaon.

---

## ⏱️ Step 2: Scenario 1 & 4 — Document Cryptographic Integrity (0:45 - 1:30)
1. On the Navbar, click **"Public Verification"** (or open `/verify/tok-verify-clean-1001`).
2. Show that this public QR verification page reveals:
   - Clean verification badge: **"File Integrity Passed"**
   - 256-bit SHA-256 fingerprint: `c0f993f9...`
   - Sanitized cadastral metadata (District: Dhaka, Upazila: Tejgaon, Mouza: Tejgaon I/A, Plot: 342).
   - **Privacy Shield Notice:** Sensitive National ID (NID) and phone numbers are completely masked and protected from public harvesting.
3. Show **Scenario 4 (Tampered File)** by searching for token `tok-verify-tamper-1088`:
   - System flags a warning: **"Document Hash Mismatch"**. Explain that if even a single byte or stamp is modified on a scanned deed, the SHA-256 checksum mismatch is detected immediately.

---

## ⏱️ Step 3: Scenario 2 & 3 — Transparent Fraud Detection Engine (1:30 - 2:30)
1. Click **"Quick Demo Login"** on the Navbar and select **"Tanvir Ahmed (Citizen / Seller)"**.
2. Notice the executive Citizen Dashboard:
   - Total recorded parcels, owned decimals, pending transactions, and active warnings.
3. Go to **"My Lands"** -> click on **Plot 1042 (Badda, Gulshan)**:
   - **Scenario 2 (Potential Duplicate Sale):** Show the red alert: *"Two transaction records appear to overlap for the same plot and land share. Total plot area is 6.0 decimals, but combined claims total 8.0 decimals."*
   - Scroll down to show that **Tanvir** claims 4.0 decimals, while **Rafiqul Islam** claims an overlapping 4.0 decimals.
   - Point out the explainability principle: the system presents the exact conflicting numbers and does not label individuals as criminals.
4. Open **Plot 771 (Uttara)** to show **Scenario 3 (Mutation Record Mismatch)**:
   - Deed buyer is recorded as *Karim*, while reference e-Mutation records *Rahim*. Flagged for manual review.

---

## ⏱️ Step 4: Scenario 5, 6 & 7 — Buy/Sell Workflow & Concurrency Protection (2:30 - 3:30)
1. Open **"New Sale Proposal"** (`/dashboard/transactions/new`):
   - Select **Plot 112 (Nasirabad, Chattogram)** where Tanvir's verified share is only **2.5 decimals**.
   - Enter proposed sale area: **4.0 decimals**.
   - Notice the system immediately displays: *"Warning: Proposed area exceeds your verified share!"*
   - Explain **Scenario 5:** the backend rejects any transaction proposing more than the eligible share.
2. Go to **"Transaction History"** (`/dashboard/transactions`):
   - Show **Scenario 6:** `TX-DEMO-2026-006` is in *"Awaiting Official Transfer Evidence"* state where both parties have consented and certified deeds are being uploaded.
   - Show **Scenario 7:** `TX-DEMO-2026-007` is a completed simulated transfer where 1.0 decimal was atomically deducted from Tanvir and added to Farhana Yasmin.

---

## ⏱️ Step 5: Scenario 8 — Zero Silent Admin Updates & Citizen OTP Consent (3:30 - 4:15)
1. While logged in as Tanvir, go to **"Consent Requests"** (`/dashboard/consent-requests`):
   - Notice pending request `REQ-DEMO-2026-001`: An administrator proposed updating the Survey Type on Plot 1042 from *RS* to *BS*.
   - Explain the core principle: **An administrator cannot silently overwrite citizen land records.**
2. Click **"Request OTP & Consent"**:
   - The system triggers an OTP challenge sent to Tanvir's phone (`01711000001`).
   - The mock provider displays code **`123456`**.
   - Enter `123456` and click **"Verify OTP"**.
   - The update is verified, applied to the land record, and stamped into the audit log!

---

## ⏱️ Step 6: Tamper-Evident SHA-256 Audit Trail (4:15 - 5:00)
1. Click **"Quick Demo Login"** -> select **"Anisur Rahman (System Admin)"**.
2. Navigate to **"Admin Panel"** -> **"Audit Logs"** (`/admin/audit-logs`):
   - Click **"Verify SHA-256 Chain"**.
   - Show the green banner: *"Audit Log Chain Cryptographically Valid — 100% of sequential SHA-256 blocks verified with zero broken parent links."*
   - Show how every action (Registration, Upload, Fraud Flag, Admin Request, Citizen OTP, Transfer) has a `Current Event Hash` linked to its `Parent Previous Hash`.
3. Wrap up with the impact statement:
   *"LandSure BD brings transparency, cryptographic certainty, and citizen-governed data protection to land records in Bangladesh."*
