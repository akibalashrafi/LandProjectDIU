import crypto from 'crypto';
import { db } from '../db/database.js';
import { LandTransaction, TransactionStatus } from '../types/index.js';
import { AuditService } from './auditService.js';
import { FraudDetectionEngine } from './fraudDetectionEngine.js';

export class TransactionService {
  /**
   * Initiate a buy/sell transaction request with strict concurrency locking and share validation.
   */
  static async createTransaction(data: {
    parcelId: string;
    sellerId: string;
    buyerPhone: string;
    proposedArea: number;
    transferNotes?: string;
  }): Promise<LandTransaction> {
    return db.withLock(async () => {
      const parcel = db.getParcels().find(p => p.id === data.parcelId);
      if (!parcel) {
        throw new Error('Land parcel not found.');
      }

      // Check seller's claim
      const sellerClaim = db.getClaims().find(c => c.parcelId === data.parcelId && c.userId === data.sellerId);
      if (!sellerClaim) {
        throw new Error('Seller does not have an active ownership claim on this parcel.');
      }

      // Calculate already committed / pending sales on this parcel by seller
      const pendingTxs = db.getTransactions().filter(t => 
        t.parcelId === data.parcelId &&
        t.sellerId === data.sellerId &&
        t.status !== 'COMPLETED' &&
        t.status !== 'REJECTED' &&
        t.status !== 'CANCELLED'
      );

      const alreadyCommittedArea = pendingTxs.reduce((sum, t) => sum + t.proposedArea, 0);
      const remainingEligibleShare = sellerClaim.recordSupportedShare - alreadyCommittedArea;

      if (data.proposedArea > remainingEligibleShare + 0.0001) {
        throw new Error(
          `Proposed sale area (${data.proposedArea} ${parcel.areaUnit}) exceeds seller's remaining eligible share (${remainingEligibleShare.toFixed(2)} ${parcel.areaUnit}). Already committed in pending requests: ${alreadyCommittedArea.toFixed(2)} ${parcel.areaUnit}.`
        );
      }

      // Find or verify buyer by phone
      const buyer = db.getUsers().find(u => u.phone === data.buyerPhone.trim());
      if (!buyer) {
        throw new Error(`Buyer with mobile number ${data.buyerPhone} is not registered on LandSure BD.`);
      }

      if (buyer.id === data.sellerId) {
        throw new Error('Seller and Buyer cannot be the same account.');
      }

      const txCount = db.getTransactions().length + 1;
      const currentYear = new Date().getFullYear();
      const txReference = `TX-DEMO-${currentYear}-${String(txCount).padStart(3, '0')}`;

      const newTx: LandTransaction = {
        id: crypto.randomUUID(),
        txReference,
        parcelId: data.parcelId,
        sellerId: data.sellerId,
        buyerId: buyer.id,
        proposedArea: data.proposedArea,
        proposedShare: data.proposedArea,
        status: 'SUBMITTED',
        sellerConsent: true,
        buyerConsent: false,
        transferNotes: data.transferNotes,
        evidenceDocIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.getTransactions().push(newTx);
      db.persistSync();

      // Run fraud checks on the parcel
      FraudDetectionEngine.runComprehensiveAnalysis(data.parcelId);

      AuditService.log({
        actorId: data.sellerId,
        actorRole: 'CITIZEN',
        action: 'TRANSACTION_INITIATED',
        targetType: 'TRANSACTION',
        targetId: txReference,
        reason: `Initiated sale of ${data.proposedArea} ${parcel.areaUnit} to ${buyer.fullName}.`,
        outcome: 'SUCCESS'
      });

      return newTx;
    });
  }

  /**
   * Buyer provides formal consent and acceptance of the transaction request
   */
  static async buyerAccept(txId: string, buyerId: string): Promise<LandTransaction> {
    return db.withLock(async () => {
      const tx = db.getTransactions().find(t => t.id === txId || t.txReference === txId);
      if (!tx) throw new Error('Transaction not found.');

      if (tx.buyerId !== buyerId) {
        throw new Error('Unauthorized: You are not the assigned buyer for this transaction.');
      }

      if (tx.status !== 'SUBMITTED' && tx.status !== 'AWAITING_BUYER') {
        throw new Error(`Transaction is currently in '${tx.status}' state and cannot be accepted.`);
      }

      tx.buyerConsent = true;
      tx.status = 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE';
      tx.updatedAt = new Date().toISOString();

      db.persistSync();

      AuditService.log({
        actorId: buyerId,
        actorRole: 'CITIZEN',
        action: 'TRANSACTION_BUYER_CONSENT',
        targetType: 'TRANSACTION',
        targetId: tx.txReference,
        reason: 'Buyer confirmed purchase terms and consented to proceeding with evidence verification.',
        outcome: 'SUCCESS'
      });

      return tx;
    });
  }

  /**
   * Attach evidence document to transaction
   */
  static async attachEvidence(txId: string, docId: string, actorId: string): Promise<LandTransaction> {
    const tx = db.getTransactions().find(t => t.id === txId || t.txReference === txId);
    if (!tx) throw new Error('Transaction not found.');

    if (tx.sellerId !== actorId && tx.buyerId !== actorId) {
      throw new Error('Unauthorized to attach evidence to this transaction.');
    }

    if (!tx.evidenceDocIds.includes(docId)) {
      tx.evidenceDocIds.push(docId);
      tx.updatedAt = new Date().toISOString();
      db.persistSync();
    }

    return tx;
  }

  /**
   * Authorized Reviewer or Admin approves and executes simulated ownership transfer
   */
  static async approveAndExecuteTransfer(
    txId: string, 
    reviewerId: string, 
    reviewerRole: string,
    notes?: string
  ): Promise<LandTransaction> {
    return db.withLock(async () => {
      const tx = db.getTransactions().find(t => t.id === txId || t.txReference === txId);
      if (!tx) throw new Error('Transaction not found.');

      if (tx.status === 'COMPLETED') {
        throw new Error('Transaction has already been executed and completed.');
      }

      if (!tx.sellerConsent || !tx.buyerConsent) {
        throw new Error('Cannot approve transfer: Both seller and buyer consent are mandatory.');
      }

      const parcel = db.getParcels().find(p => p.id === tx.parcelId);
      if (!parcel) throw new Error('Land parcel not found.');

      const sellerClaim = db.getClaims().find(c => c.parcelId === tx.parcelId && c.userId === tx.sellerId);
      if (!sellerClaim || sellerClaim.recordSupportedShare < tx.proposedArea) {
        tx.status = 'REJECTED';
        tx.rejectionReason = 'Seller verified share is insufficient to fulfill this transfer.';
        db.persistSync();
        throw new Error(tx.rejectionReason);
      }

      // Re-allocate ownership shares
      sellerClaim.claimedShare -= tx.proposedArea;
      sellerClaim.recordSupportedShare -= tx.proposedArea;
      sellerClaim.updatedAt = new Date().toISOString();

      let buyerClaim = db.getClaims().find(c => c.parcelId === tx.parcelId && c.userId === tx.buyerId);
      if (buyerClaim) {
        buyerClaim.claimedShare += tx.proposedArea;
        buyerClaim.recordSupportedShare += tx.proposedArea;
        buyerClaim.updatedAt = new Date().toISOString();
      } else {
        buyerClaim = {
          id: crypto.randomUUID(),
          parcelId: tx.parcelId,
          userId: tx.buyerId,
          claimedShare: tx.proposedArea,
          recordSupportedShare: tx.proposedArea,
          status: 'CONFIRMED',
          acquisitionMethod: 'PURCHASE',
          acquisitionDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.getClaims().push(buyerClaim);
      }

      tx.status = 'COMPLETED';
      tx.completedAt = new Date().toISOString();
      tx.transferNotes = notes || 'Simulated demonstration ownership transfer executed upon official evidence verification.';
      tx.updatedAt = new Date().toISOString();

      db.persistSync();

      // Log high-priority immutable audit event
      AuditService.log({
        actorId: reviewerId,
        actorRole: reviewerRole,
        action: 'OWNERSHIP_SHARE_TRANSFERRED',
        targetType: 'TRANSACTION',
        targetId: tx.txReference,
        reason: `Approved transfer of ${tx.proposedArea} ${parcel.areaUnit} on Plot ${parcel.plotNumber}. Seller remaining: ${sellerClaim.recordSupportedShare}, Buyer acquired: ${buyerClaim.recordSupportedShare}.`,
        oldValues: { sellerPreviousShare: sellerClaim.recordSupportedShare + tx.proposedArea },
        newValues: { sellerNewShare: sellerClaim.recordSupportedShare, buyerNewShare: buyerClaim.recordSupportedShare },
        outcome: 'SUCCESS'
      });

      return tx;
    });
  }
}
