export type Role = 'CITIZEN' | 'ADMIN' | 'REVIEWER';

export type VerificationStatus = 
  | 'PENDING'
  | 'FILE_INTEGRITY_PASSED'
  | 'RECORD_MATCH'
  | 'WARNING'
  | 'NEEDS_MANUAL_REVIEW'
  | 'REFERENCE_UNAVAILABLE'
  | 'REJECTED'
  | 'SUPERSEDED';

export type AlertSeverity = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type TransactionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AWAITING_BUYER'
  | 'VERIFICATION_PENDING'
  | 'WARNING'
  | 'NEEDS_MANUAL_REVIEW'
  | 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE'
  | 'APPROVED_FOR_RECORD_UPDATE'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: Role;
  address?: string;
  nidMasked?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OwnershipClaim {
  id: string;
  parcelId: string;
  userId: string;
  claimedShare: number; // e.g. 0.5 for 50%, or 4.0 decimals
  recordSupportedShare: number;
  status: 'CLAIMED' | 'CONFIRMED' | 'DISPUTED';
  acquisitionMethod: 'PURCHASE' | 'INHERITANCE' | 'GIFT' | 'HEBA' | 'ALLOTMENT';
  acquisitionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandParcel {
  id: string;
  internalParcelId: string; // e.g., DEMO-PARCEL-1042
  district: string;
  upazila: string;
  mouza: string;
  jlNumber?: string;
  khatianNumber: string;
  plotNumber: string; // dag number
  surveyType: string; // CS, SA, RS, BS, City Survey
  totalArea: number;
  areaUnit: 'decimal' | 'acre' | 'sqft';
  sourceDeedRef?: string;
  verificationStatus: VerificationStatus;
  notes?: string;
  isDisputed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  documentId: string; // e.g., DOC-DEMO-001
  category: 
    | 'REGISTERED_DEED'
    | 'BAYA_DEED'
    | 'KHATIAN_PORCHA'
    | 'MUTATION_ORDER'
    | 'TAX_RECEIPT'
    | 'MOUZA_MAP'
    | 'NID_COPY';
  parcelId?: string;
  uploaderId: string;
  originalFilename: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  verificationStatus: VerificationStatus;
  reviewNotes?: string;
  version: number;
  referenceSource?: string;
  isDigitallySigned: boolean;
  publicToken: string;
  structuredData?: {
    buyerName?: string;
    sellerName?: string;
    deedNumber?: string;
    khatianNumber?: string;
    plotNumber?: string;
    mouza?: string;
    district?: string;
    upazila?: string;
    deedDate?: string;
    landArea?: number;
    areaUnit?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VerificationReport {
  id: string;
  documentId: string;
  parcelId?: string;
  fileIntegrityPassed: boolean;
  referenceHashMatched: boolean;
  recordMatchStatus: 'MATCHED' | 'MISMATCH' | 'INCONCLUSIVE';
  discrepanciesJson: Array<{
    field: string;
    expected: string;
    actual: string;
    severity: AlertSeverity;
    description: string;
  }>;
  overallStatus: VerificationStatus;
  reviewerNotes?: string;
  verifiedAt: string;
}

export interface FraudAlert {
  id: string;
  alertId: string; // e.g., ALERT-DEMO-001
  category: 
    | 'DUPLICATE_SALE'
    | 'CONFLICTING_OWNERSHIP'
    | 'SHARE_EXCEEDED'
    | 'MUTATION_MISMATCH'
    | 'HASH_MISMATCH'
    | 'CHRONOLOGY_ERROR'
    | 'DISPUTE_FLAG';
  parcelId?: string;
  relatedTxId?: string;
  relatedDocId?: string;
  severity: AlertSeverity;
  title: string;
  explanation: string;
  conflictingFields: Record<string, any>;
  evidenceSource?: string;
  status: AlertStatus;
  reviewerNotes?: string;
  detectedAt: string;
  resolvedAt?: string;
}

export interface LandTransaction {
  id: string;
  txReference: string; // e.g., TX-DEMO-2026-001
  parcelId: string;
  sellerId: string;
  buyerId: string;
  proposedArea: number;
  proposedShare: number; // decimal share fraction or area
  status: TransactionStatus;
  sellerConsent: boolean;
  buyerConsent: boolean;
  rejectionReason?: string;
  transferNotes?: string;
  evidenceDocIds: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUpdateRequest {
  id: string;
  requestId: string;
  parcelId: string;
  targetUserId: string;
  adminAuthorId: string;
  fieldName: string;
  oldValue: string;
  proposedValue: string;
  reason: string;
  status: 'PENDING_USER_CONSENT' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  userOtpRequired: boolean;
  otpVerified: boolean;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OTPChallenge {
  id: string;
  phone: string;
  codeHash: string;
  purpose: 'LOGIN' | 'SENSITIVE_UPDATE' | 'TRANSFER_CONFIRM' | 'REGISTER';
  expiresAt: string;
  isUsed: boolean;
  attempts: number;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  eventHash: string;
  previousHash: string | null;
  actorId?: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  oldValues?: any;
  newValues?: any;
  outcome: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  ipAddress?: string;
  timestamp: string;
}
