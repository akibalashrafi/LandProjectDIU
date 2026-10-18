# LandSure BD: REST API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization: Bearer <token>` header.

---

## 1. Authentication & Profile
- `POST /auth/register` — Register new citizen account.
  - Body: `{ fullName, phone, email?, password, address?, nid? }`
- `POST /auth/login` — Sign in and obtain JWT token.
  - Body: `{ phone, password }`
- `POST /auth/request-otp` — Generate single-use expiring OTP challenge.
  - Body: `{ phone, purpose: 'LOGIN' | 'SENSITIVE_UPDATE' | 'TRANSFER_CONFIRM' }`
- `POST /auth/verify-otp` — Verify challenge code.
  - Body: `{ challengeId, code }`
- `GET /users/me` — Get current user profile and dashboard statistics.

## 2. Public Verification
- `GET /public/verify/:token` — Retrieve sanitized cryptographic verification summary for a document token.
- `GET /public/parcel-check?plot=<plot>&mouza=<mouza>` — Public search for parcel verification status.

## 3. Land Parcels
- `GET /lands` — List user's registered parcels (or all parcels if Admin/Reviewer with `?all=true`).
- `POST /lands` — Register a new land parcel.
  - Body: `{ district, upazila, mouza, jlNumber, khatianNumber, plotNumber, surveyType, totalArea, areaUnit, claimedShare, acquisitionMethod, acquisitionDate, sourceDeedRef, notes }`
- `GET /lands/:id` — View deep parcel details including co-owners, documents, fraud alerts, and transactions.

## 4. Documents & Integrity
- `POST /documents` — Upload deed, mutation, or porcha file (multipart/form-data).
  - Form Fields: `file` (PDF/JPEG/PNG), `category`, `parcelId`, `structuredDataJson`, `referenceHash?`, `referenceSource?`
- `GET /documents` — List user's uploaded documents.
- `GET /documents/:id` — Inspect document and verification report.

## 5. Fraud Detection Engine
- `GET /fraud/alerts` — List active fraud alerts on user's land parcels (or all for staff).
- `POST /fraud/check/:parcelId` — Trigger instant re-evaluation of all rules across a parcel.
- `PATCH /fraud/alerts/:id/resolve` — (Admin/Reviewer) Record findings and resolve alert.

## 6. Transactions
- `GET /transactions` — List user's active sales and purchase proposals.
- `POST /transactions` — Initiate sale proposal to buyer phone.
  - Body: `{ parcelId, buyerPhone, proposedArea, transferNotes }`
- `POST /transactions/:id/accept` — Buyer confirms terms and provides consent.
- `POST /transactions/:id/evidence` — Attach certified deed or tax receipt.
- `POST /transactions/:id/approve` — (Admin/Reviewer) Execute atomic ownership transfer.

## 7. Admin & Citizen OTP Consent
- `GET /admin/dashboard` — Platform overview KPIs and recent queues.
- `GET /admin/users` — Staff user management.
- `GET /admin/update-requests` — List sensitive update requests.
- `POST /admin/update-requests` — Admin creates update request.
  - Body: `{ parcelId, targetUserId, fieldName, oldValue, proposedValue, reason }`
- `POST /admin/update-requests/:id/request-otp` — Citizen requests OTP for the update.
- `POST /admin/update-requests/:id/confirm-otp` — Citizen submits OTP to apply the change.
- `GET /admin/audit-logs` — Tamper-evident SHA-256 hash-chained log viewer with integrity validator.
