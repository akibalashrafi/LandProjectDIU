import crypto from 'crypto';
import QRCode from 'qrcode';
import { db } from '../db/database.js';
import { Document, VerificationReport, VerificationStatus } from '../types/index.js';
import { AuditService } from './auditService.js';
import { FraudDetectionEngine } from './fraudDetectionEngine.js';

export class DocumentService {
  /**
   * Process a document upload: compute SHA-256 hash, compare with trusted reference,
   * generate secure random QR verification token, and create initial verification report.
   */
  static async processDocument(data: {
    category: Document['category'];
    parcelId?: string;
    uploaderId: string;
    originalFilename: string;
    storagePath: string;
    fileSizeBytes: number;
    mimeType: string;
    fileBuffer: Buffer;
    structuredData?: Document['structuredData'];
    referenceHash?: string;
    referenceSource?: string;
  }): Promise<{ document: Document; report: VerificationReport; qrDataUrl: string }> {
    const sha256Hash = crypto.createHash('sha256').update(data.fileBuffer).digest('hex');
    const docCount = db.getDocuments().length + 1;
    const documentId = `DOC-DEMO-${String(docCount).padStart(3, '0')}`;
    const publicToken = crypto.randomUUID();

    // Check trusted reference hash if available
    let referenceHashMatched = false;
    let fileIntegrityPassed = false;
    let status: VerificationStatus = 'PENDING';

    if (data.referenceHash) {
      if (sha256Hash.toLowerCase() === data.referenceHash.toLowerCase()) {
        referenceHashMatched = true;
        fileIntegrityPassed = true;
        status = 'FILE_INTEGRITY_PASSED';
      } else {
        referenceHashMatched = false;
        fileIntegrityPassed = false;
        status = 'WARNING';
      }
    } else {
      // Reference unavailable
      fileIntegrityPassed = true;
      status = 'REFERENCE_UNAVAILABLE';
    }

    const newDoc: Document = {
      id: crypto.randomUUID(),
      documentId,
      category: data.category,
      parcelId: data.parcelId,
      uploaderId: data.uploaderId,
      originalFilename: data.originalFilename,
      storagePath: data.storagePath,
      fileSizeBytes: data.fileSizeBytes,
      mimeType: data.mimeType,
      sha256Hash,
      verificationStatus: status,
      reviewNotes: referenceHashMatched 
        ? 'SHA-256 matches trusted government registry reference hash.'
        : data.referenceHash ? 'SHA-256 does NOT match expected reference hash.' : 'No external cryptographic reference available.',
      version: 1,
      referenceSource: data.referenceSource || 'National Land Records Digital Archive (Simulated)',
      isDigitallySigned: false,
      publicToken,
      structuredData: data.structuredData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.getDocuments().push(newDoc);

    // Create Verification Report
    const report: VerificationReport = {
      id: crypto.randomUUID(),
      documentId: newDoc.id,
      parcelId: data.parcelId,
      fileIntegrityPassed,
      referenceHashMatched,
      recordMatchStatus: referenceHashMatched ? 'MATCHED' : (data.referenceHash ? 'MISMATCH' : 'INCONCLUSIVE'),
      discrepanciesJson: [],
      overallStatus: status,
      reviewerNotes: newDoc.reviewNotes,
      verifiedAt: new Date().toISOString()
    };

    // If parcel exists, perform structured record comparison
    if (data.parcelId) {
      const parcel = db.getParcels().find(p => p.id === data.parcelId);
      if (parcel && data.structuredData) {
        if (data.structuredData.plotNumber && data.structuredData.plotNumber !== parcel.plotNumber) {
          report.discrepanciesJson.push({
            field: 'Plot Number (দাগ নম্বর)',
            expected: parcel.plotNumber,
            actual: data.structuredData.plotNumber,
            severity: 'HIGH',
            description: 'Document plot number does not match registered parcel plot number.'
          });
          report.overallStatus = 'NEEDS_MANUAL_REVIEW';
          newDoc.verificationStatus = 'NEEDS_MANUAL_REVIEW';
        }

        if (data.structuredData.khatianNumber && data.structuredData.khatianNumber !== parcel.khatianNumber) {
          report.discrepanciesJson.push({
            field: 'Khatian Number (খতিয়ান নম্বর)',
            expected: parcel.khatianNumber,
            actual: data.structuredData.khatianNumber,
            severity: 'HIGH',
            description: 'Document khatian number does not match registered parcel khatian.'
          });
          report.overallStatus = 'NEEDS_MANUAL_REVIEW';
          newDoc.verificationStatus = 'NEEDS_MANUAL_REVIEW';
        }
      }
    }

    db.getReports().push(report);
    db.persistSync();

    // Trigger fraud engine check if parcel is linked
    if (data.parcelId) {
      FraudDetectionEngine.runComprehensiveAnalysis(data.parcelId);
    }

    // Generate QR code for public verification
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${publicToken}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 2,
      width: 256,
      color: {
        dark: '#064e3b', // Deep emerald green
        light: '#ffffff'
      }
    });

    AuditService.log({
      actorId: data.uploaderId,
      actorRole: 'CITIZEN',
      action: 'DOCUMENT_PROCESSED',
      targetType: 'DOCUMENT',
      targetId: newDoc.documentId,
      reason: `Uploaded ${data.originalFilename}; SHA-256: ${sha256Hash.slice(0, 16)}...`,
      outcome: 'SUCCESS'
    });

    return { document: newDoc, report, qrDataUrl };
  }

  /**
   * Public Safe Verification: returns sanitized public metadata without NID or sensitive contact info
   */
  static getPublicVerification(token: string) {
    const doc = db.getDocuments().find(d => d.publicToken === token);
    if (!doc) return null;

    const parcel = doc.parcelId ? db.getParcels().find(p => p.id === doc.parcelId) : null;
    const report = db.getReports().find(r => r.documentId === doc.id);

    return {
      publicToken: token,
      documentId: doc.documentId,
      category: doc.category,
      originalFilename: doc.originalFilename,
      sha256Hash: doc.sha256Hash,
      verificationStatus: doc.verificationStatus,
      isDigitallySigned: doc.isDigitallySigned,
      verifiedAt: report?.verifiedAt || doc.createdAt,
      referenceSource: doc.referenceSource,
      parcelSummary: parcel ? {
        district: parcel.district,
        upazila: parcel.upazila,
        mouza: parcel.mouza,
        khatianNumber: parcel.khatianNumber,
        plotNumber: parcel.plotNumber,
        surveyType: parcel.surveyType
      } : null,
      disclaimer: 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD. Digital integrity check establishes file equality with sample reference, not legal ownership.'
    };
  }
}
