import crypto from 'crypto';
import { db } from '../db/database.js';
import { FraudAlert, AlertSeverity, LandParcel } from '../types/index.js';
import { AuditService } from './auditService.js';

export class FraudDetectionEngine {
  /**
   * Run the complete transparent rule-based fraud detection pipeline across a parcel
   * or all parcels in the system.
   */
  static runComprehensiveAnalysis(parcelId?: string): FraudAlert[] {
    const parcels = parcelId 
      ? db.getParcels().filter(p => p.id === parcelId)
      : db.getParcels();

    const generatedAlerts: FraudAlert[] = [];

    for (const parcel of parcels) {
      const alertsForParcel = this.evaluateParcel(parcel);
      generatedAlerts.push(...alertsForParcel);
    }

    return generatedAlerts;
  }

  static evaluateParcel(parcel: LandParcel): FraudAlert[] {
    const claims = db.getClaims().filter(c => c.parcelId === parcel.id);
    const docs = db.getDocuments().filter(d => d.parcelId === parcel.id);
    const txs = db.getTransactions().filter(t => t.parcelId === parcel.id);
    const existingAlerts = db.getAlerts();

    const alerts: FraudAlert[] = [];

    // Rule 1: Conflicting Ownership Claims & Total Claimed Area Exceeding Parcel Area
    const totalClaimedArea = claims.reduce((sum, c) => sum + c.claimedShare, 0);
    if (totalClaimedArea > parcel.totalArea + 0.001) {
      const alert = this.createOrUpdateAlert({
        category: 'CONFLICTING_OWNERSHIP',
        parcelId: parcel.id,
        severity: 'CRITICAL',
        title: 'Conflicting Ownership Claims / Parcel Area Exceeded',
        explanation: `Total cumulative ownership claims (${totalClaimedArea.toFixed(2)} ${parcel.areaUnit}) exceed the official recorded parcel area (${parcel.totalArea.toFixed(2)} ${parcel.areaUnit}).`,
        conflictingFields: {
          parcelId: parcel.internalParcelId,
          totalParcelArea: `${parcel.totalArea} ${parcel.areaUnit}`,
          totalClaimedArea: `${totalClaimedArea} ${parcel.areaUnit}`,
          excessArea: `${(totalClaimedArea - parcel.totalArea).toFixed(2)} ${parcel.areaUnit}`,
          claimants: claims.map(c => {
            const user = db.getUsers().find(u => u.id === c.userId);
            return `${user?.fullName || c.userId}: ${c.claimedShare} ${parcel.areaUnit} (${c.acquisitionMethod})`;
          })
        },
        evidenceSource: 'LandSure Cadastral Share Reconciliation Rule'
      });
      alerts.push(alert);
    }

    // Rule 2: Potential Duplicate Sale / Multiple Registered Deeds on Same Parcel
    const registeredDeeds = docs.filter(d => d.category === 'REGISTERED_DEED');
    if (registeredDeeds.length > 1) {
      // Check if deeds overlap or have different buyers without chronological mutation chain
      const deedNumbers = registeredDeeds.map(d => d.structuredData?.deedNumber || d.documentId);
      const totalDeedArea = registeredDeeds.reduce((sum, d) => sum + (d.structuredData?.landArea || 0), 0);
      
      if (totalDeedArea > parcel.totalArea) {
        const alert = this.createOrUpdateAlert({
          category: 'DUPLICATE_SALE',
          parcelId: parcel.id,
          severity: 'CRITICAL',
          title: 'Potential Duplicate Sale / Overlapping Transfer',
          explanation: `Multiple registered deed records overlap on Plot ${parcel.plotNumber}. Combined deed area (${totalDeedArea} ${parcel.areaUnit}) exceeds parcel capacity.`,
          conflictingFields: {
            plotNumber: parcel.plotNumber,
            khatianNumber: parcel.khatianNumber,
            mouza: parcel.mouza,
            deedReferences: deedNumbers,
            totalDeedArea: `${totalDeedArea} ${parcel.areaUnit}`,
            parcelArea: `${parcel.totalArea} ${parcel.areaUnit}`
          },
          evidenceSource: 'LandSure Deeds Registry Comparison Engine'
        });
        alerts.push(alert);
      }
    }

    // Rule 3: Mutation Record Mismatch (Deed vs Mutation comparison)
    const mutationDocs = docs.filter(d => d.category === 'MUTATION_ORDER');
    for (const mutation of mutationDocs) {
      for (const deed of registeredDeeds) {
        if (deed.structuredData && mutation.structuredData) {
          const deedBuyer = deed.structuredData.buyerName?.trim().toLowerCase();
          const mutBuyer = mutation.structuredData.buyerName?.trim().toLowerCase();

          // If buyer names differ significantly
          if (deedBuyer && mutBuyer && !deedBuyer.includes(mutBuyer) && !mutBuyer.includes(deedBuyer)) {
            const alert = this.createOrUpdateAlert({
              category: 'MUTATION_MISMATCH',
              parcelId: parcel.id,
              relatedDocId: mutation.id,
              severity: 'HIGH',
              title: 'Mutation Record Mismatch / Name Inconsistency',
              explanation: `Buyer information differs between submitted registered deed (${deed.structuredData.buyerName}) and mutation record (${mutation.structuredData.buyerName}).`,
              conflictingFields: {
                deedDocumentId: deed.documentId,
                deedBuyer: deed.structuredData.buyerName,
                mutationDocumentId: mutation.documentId,
                mutationBuyer: mutation.structuredData.buyerName,
                plotNumber: parcel.plotNumber,
                khatianNumber: parcel.khatianNumber
              },
              evidenceSource: 'e-Mutation vs Sub-Registry Cross Verification'
            });
            alerts.push(alert);
          }
        }
      }
    }

    // Rule 4: Seller Share Exceeded in Transactions
    for (const tx of txs) {
      if (tx.status !== 'CANCELLED' && tx.status !== 'REJECTED') {
        const sellerClaim = claims.find(c => c.userId === tx.sellerId);
        const recordedShare = sellerClaim ? sellerClaim.recordSupportedShare : 0;
        
        if (tx.proposedArea > recordedShare + 0.0001) {
          const alert = this.createOrUpdateAlert({
            category: 'SHARE_EXCEEDED',
            parcelId: parcel.id,
            relatedTxId: tx.txReference,
            severity: 'CRITICAL',
            title: 'Seller Ownership Share Exceeded',
            explanation: `Transaction ${tx.txReference} requests sale of ${tx.proposedArea} ${parcel.areaUnit}, but seller only holds ${recordedShare} ${parcel.areaUnit} verified share.`,
            conflictingFields: {
              transactionRef: tx.txReference,
              proposedSaleArea: `${tx.proposedArea} ${parcel.areaUnit}`,
              sellerVerifiedShare: `${recordedShare} ${parcel.areaUnit}`,
              deficit: `${(tx.proposedArea - recordedShare).toFixed(2)} ${parcel.areaUnit}`
            },
            evidenceSource: 'LandSure Ownership Share Verification Engine'
          });
          alerts.push(alert);
        }
      }
    }

    // Rule 5: File Hash Mismatch / Document Integrity
    for (const doc of docs) {
      if (doc.verificationStatus === 'WARNING' && doc.sha256Hash) {
        const report = db.getReports().find(r => r.documentId === doc.id);
        if (report && !report.fileIntegrityPassed) {
          const alert = this.createOrUpdateAlert({
            category: 'HASH_MISMATCH',
            parcelId: parcel.id,
            relatedDocId: doc.id,
            severity: 'HIGH',
            title: 'Document Hash Checksum Mismatch',
            explanation: `Document ${doc.originalFilename} failed cryptographic verification against official registration repository checksum.`,
            conflictingFields: {
              documentId: doc.documentId,
              filename: doc.originalFilename,
              actualHash: doc.sha256Hash,
              referenceSource: doc.referenceSource || 'National Deed Digital Archive'
            },
            evidenceSource: 'LandSure Cryptographic Audit Engine'
          });
          alerts.push(alert);
        }
      }
    }

    return alerts;
  }

  private static createOrUpdateAlert(data: {
    category: FraudAlert['category'];
    parcelId?: string;
    relatedTxId?: string;
    relatedDocId?: string;
    severity: AlertSeverity;
    title: string;
    explanation: string;
    conflictingFields: Record<string, any>;
    evidenceSource?: string;
  }): FraudAlert {
    const existing = db.getAlerts().find(a => 
      a.category === data.category && 
      a.parcelId === data.parcelId &&
      a.status !== 'RESOLVED' &&
      a.status !== 'DISMISSED'
    );

    if (existing) {
      existing.title = data.title;
      existing.explanation = data.explanation;
      existing.conflictingFields = data.conflictingFields;
      existing.severity = data.severity;
      db.persistSync();
      return existing;
    }

    const alertCount = db.getAlerts().length + 1;
    const alertId = `ALERT-DEMO-${String(alertCount).padStart(3, '0')}`;
    const newAlert: FraudAlert = {
      id: crypto.randomUUID(),
      alertId,
      category: data.category,
      parcelId: data.parcelId,
      relatedTxId: data.relatedTxId,
      relatedDocId: data.relatedDocId,
      severity: data.severity,
      title: data.title,
      explanation: data.explanation,
      conflictingFields: data.conflictingFields,
      evidenceSource: data.evidenceSource,
      status: 'OPEN',
      detectedAt: new Date().toISOString()
    };

    db.getAlerts().push(newAlert);
    db.persistSync();

    AuditService.log({
      actorRole: 'SYSTEM',
      action: 'FRAUD_ALERT_DETECTED',
      targetType: 'FRAUD_ALERT',
      targetId: alertId,
      reason: data.explanation,
      outcome: 'SUCCESS'
    });

    return newAlert;
  }
}
