# LandSure BD 🇧🇩
## Digital Land Ownership Management, Document Verification & Fraud Detection Platform

**LandSure BD** is a modern, secure, responsive, bilingual web application designed for Bangladesh to protect land ownership records, verify document integrity cryptographically, detect potential fraudulent transactions, and provide transparent administrative governance with mandatory citizen OTP consent.

> **DEMO DATA DISCLAIMER:**
> All Khatians, Plots (Dag), Mouzas, and Deeds in this prototype are fictional sample records for hackathon and technical demonstration. The platform establishes cryptographic document equality and structural discrepancy detection, not official government ownership certification.

---

## 🌟 Key Capabilities

1. **Bilingual Citizen Experience:** Full interface in both **বাংলা (Bangla - Default)** and **English** with persistent language toggle.
2. **Cryptographic Document Ingestion (SHA-256):** Calculates 256-bit hashes upon upload and verifies file equality against registry reference vaults.
3. **Transparent Fraud Detection Engine:**
   - **Potential Duplicate Sales:** Detects overlapping transactions on the same plot exceeding parcel area.
   - **Mutation Record Mismatch:** Identifies buyer or seller name inconsistencies between deeds and e-mutation records.
   - **Share Insufficiency Defense:** Prevents sellers from transferring more than their verified decimal share.
   - **Tampered Document Detection:** Flags files whose checksums deviate from registration references.
4. **Secure Buy/Sell Transaction Workflow:**
   - Mutual consent required from seller and buyer.
   - Database-level concurrency control (`withLock`) preventing race conditions where two concurrent transactions could independently over-allocate the same share.
5. **Zero Silent Administrative Overwrites:**
   - When an Administrator or Land Officer proposes a record modification, the citizen receives an expiring single-use mobile OTP. The change is blocked until verified.
6. **Tamper-Evident Audit Trail:**
   - Cryptographic SHA-256 hash-chaining of all sensitive events (logins, uploads, transfers, alerts, and OTP verifications).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Lucide Icons.
- **Backend:** Node.js (v24), Express.js, TypeScript, REST API, Multer (file processing), QRCode generator.
- **Database:** Prisma ORM schema (PostgreSQL ready) with thread-safe file persistence (`backend/data/store.json`) for zero-friction instant hackathon execution.
- **Security:** Bcrypt password hashing, JWT authentication, SHA-256 hashing, Expiring single-use OTP challenge provider.

---

## 🚀 Quick Start (Windows 11 Setup)

### Prerequisites
- Node.js (v18+) and npm installed.

### 1. Clone & Setup Wrappers (If needed)
If running on Windows PowerShell:
```powershell
# Navigate to project folder
cd "c:\Users\akiba\OneDrive\Microsoft Edge Drop Files\LandProject"

# Add project .bin to PATH if using bundled node
$env:PATH = "$PWD\.bin;" + $env:PATH
```

### 2. Install Dependencies
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Seed Database with Bangladeshi Demo Data
```powershell
cd ../backend
npm run seed
```

### 4. Run Automated Business Logic Tests
```powershell
cd ../backend
npm test
```
*Validates OTP expiration & single-use, SHA-256 checks, duplicate-sale detection, share exhaustion limits, concurrent transfer race protection, and audit hash chain integrity.*

### 5. Launch the Application

In **Terminal 1** (Backend API Server):
```powershell
cd backend
npm run dev
# Server starts on http://localhost:5000
```

In **Terminal 2** (Frontend Client):
```powershell
cd frontend
npm run dev
# Frontend starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 👥 Demo Personas & Credentials

For fast demonstration during presentations, click **"Quick Demo Login"** on the Navbar or use the credentials below:

| Role | Name | Phone | Password | Key Demo Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen (Seller)** | Tanvir Ahmed | `01711000001` | `Password123!` | Clean land record (Plot 342), Duplicate sale warning (Plot 1042), OTP consent request |
| **Citizen (Buyer)** | Farhana Yasmin | `01711000002` | `Password123!` | Receives sale invitation; accepts purchase terms; simulated transfer |
| **Citizen (Claimant)** | Rafiqul Islam | `01711000003` | `Password123!` | Competing overlapping claimant on Plot 1042 |
| **System Admin** | Anisur Rahman | `01811000001` | `AdminPassword123!` | Proposes sensitive record update requiring citizen OTP; audits hash chain |
| **AC Land Reviewer** | Shamima Nasreen | `01911000001` | `ReviewerPassword123!` | Approves verified transactions; executes atomic share re-allocations |

*Default Mock OTP in development mode:* **`123456`**

---

## 📂 Project Structure

```
LandProject/
├── .bin/                       # Windows node/npm execution wrappers
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.prisma   # PostgreSQL Prisma Schema
│   │   │   ├── database.ts     # Concurrency-locked persistent store
│   │   │   ├── seedData.ts     # Realistic Bangladeshi demo dataset
│   │   │   └── seed.ts         # Database seeding script
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT & Role authorization
│   │   ├── routes/
│   │   │   └── api.ts          # Express REST API endpoints
│   │   ├── services/
│   │   │   ├── auditService.ts # SHA-256 hash-chained audit engine
│   │   │   ├── authService.ts  # Bcrypt + JWT authentication
│   │   │   ├── documentService.ts # File hashing & public QR verification
│   │   │   ├── fraudDetectionEngine.ts # Explainable fraud rule engine
│   │   │   ├── otpService.ts   # Expiring single-use OTP challenge engine
│   │   │   └── transactionService.ts # Concurrency-locked share transfer
│   │   ├── types/
│   │   └── server.ts           # Express entrypoint
│   ├── tests/
│   │   └── businessLogic.test.js # Automated test suite (6 critical checks)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # StatusBadge, DemoBanner
│   │   │   └── layout/         # Navbar, Footer, DashboardLayout
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx # User session & quick demo logins
│   │   │   └── LanguageContext.tsx # Persistent বাংলা / English toggle
│   │   ├── i18n/
│   │   │   └── translations.ts # Comprehensive bilingual dictionary
│   │   ├── pages/
│   │   │   ├── public/         # Home, HowItWorks, VerificationRules, PublicVerify, Login, Register, Privacy, Terms
│   │   │   ├── dashboard/      # Overview, MyLands, NewLand, LandDetail, MyDocuments, Upload, Reports, Transactions, NewTx, Alerts, Consent
│   │   │   └── admin/          # AdminOverview, AuditLogs
│   │   ├── App.tsx             # Routing & Protected routes
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── DEMO_SCRIPT.md              # Step-by-step hackathon presentation guide
├── API_DOCUMENTATION.md        # Full REST API documentation
└── README.md
```

---

## 📜 License & Acknowledgements
Built for the Bangladesh Civic Tech & Land Ownership Management Hackathon.
All rights reserved © 2026 LandSure BD.
