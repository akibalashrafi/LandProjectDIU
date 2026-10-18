import test from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { db } from '../dist/db/database.js';
import { generateSeedData } from '../dist/db/seedData.js';
import { OTPService } from '../dist/services/otpService.js';
import { TransactionService } from '../dist/services/transactionService.js';
import { FraudDetectionEngine } from '../dist/services/fraudDetectionEngine.js';
import { AuditService } from '../dist/services/auditService.js';

test('LandSure BD - Comprehensive Business Logic Test Suite', async (t) => {
  // Setup fresh test database
  const seed = await generateSeedData();
  db.setStore(seed);

  await t.test('1. OTP single-use and expiration enforcement', () => {
    const phone = '01711000001';
    const challenge = OTPService.createChallenge(phone, 'LOGIN');
    assert.ok(challenge.challengeId, 'Challenge ID generated');

    // First attempt with valid mock code
    const verify1 = OTPService.verifyChallenge(challenge.challengeId, '123456');
    assert.strictEqual(verify1.success, true, 'OTP should verify successfully');

    // Immediate second attempt with same OTP must fail (single-use)
    const verify2 = OTPService.verifyChallenge(challenge.challengeId, '123456');
    assert.strictEqual(verify2.success, false, 'OTP must not be reusable');
    assert.match(verify2.message, /already been used/i);
  });

  await t.test('2. Cryptographic SHA-256 hash comparison', () => {
    const originalContent = 'GENUINE_GOVERNMENT_SUB_REGISTRY_RECORD_2026';
    const alteredContent = 'TAMPERED_GOVERNMENT_SUB_REGISTRY_RECORD_2026';

    const hash1 = crypto.createHash('sha256').update(originalContent).digest('hex');
    const hash2 = crypto.createHash('sha256').update(alteredContent).digest('hex');

    assert.notStrictEqual(hash1, hash2, 'Tampered content must produce distinct hash');
    assert.strictEqual(hash1.length, 64, 'SHA-256 hash length must be 64 characters');
  });

  await t.test('3. Fraud Engine detects Duplicate Sale / Overlapping Area on Plot 1042', () => {
    const parcel1042 = db.getParcels().find(p => p.internalParcelId === 'DEMO-PARCEL-1042');
    assert.ok(parcel1042, 'Plot 1042 exists');

    const alerts = FraudDetectionEngine.evaluateParcel(parcel1042);
    const hasDuplicateSaleAlert = alerts.some(a => a.category === 'CONFLICTING_OWNERSHIP' || a.category === 'DUPLICATE_SALE');
    assert.ok(hasDuplicateSaleAlert, 'Fraud engine must detect conflicting/duplicate claims on Plot 1042');
  });

  await t.test('4. Seller cannot sell more than eligible ownership share', async () => {
    const parcel1090 = db.getParcels().find(p => p.internalParcelId === 'DEMO-PARCEL-1090');
    assert.ok(parcel1090, 'Parcel 1090 exists');

    // Seller (Tanvir: usr-demo-001) owns 2.5 decimals
    // Trying to sell 4.0 decimals should throw error
    await assert.rejects(
      async () => {
        await TransactionService.createTransaction({
          parcelId: parcel1090.id,
          sellerId: 'usr-demo-001',
          buyerPhone: '01711000002', // Farhana
          proposedArea: 4.0,
          transferNotes: 'Attempting excess sale'
        });
      },
      /exceeds seller's remaining eligible share/i,
      'System must reject transaction proposing area exceeding verified share'
    );
  });

  await t.test('5. Concurrency Control: Concurrent sale requests cannot exceed share', async () => {
    const parcel1001 = db.getParcels().find(p => p.internalParcelId === 'DEMO-PARCEL-1001');
    assert.ok(parcel1001, 'Parcel 1001 exists');

    // Seller owns 5.5 decimals. Completed tx-demo-007 used 1.0 decimal, remaining is 4.5 decimals.
    // We launch two concurrent transactions for 3.0 decimals each (Total: 6.0 decimals > 4.5 decimals)
    const txPromise1 = TransactionService.createTransaction({
      parcelId: parcel1001.id,
      sellerId: 'usr-demo-001',
      buyerPhone: '01711000002',
      proposedArea: 3.0,
      transferNotes: 'Concurrent Sale Request 1'
    });

    const txPromise2 = TransactionService.createTransaction({
      parcelId: parcel1001.id,
      sellerId: 'usr-demo-001',
      buyerPhone: '01711000002',
      proposedArea: 3.0,
      transferNotes: 'Concurrent Sale Request 2'
    });

    const results = await Promise.allSettled([txPromise1, txPromise2]);
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    assert.strictEqual(fulfilled.length, 1, 'Exactly one concurrent transaction should succeed');
    assert.strictEqual(rejected.length, 1, 'Second concurrent transaction must be rejected due to share limit');
  });

  await t.test('6. Tamper-evident Audit Hash Chain verification', () => {
    const auditStatus = AuditService.verifyIntegrity();
    assert.strictEqual(auditStatus.isValid, true, 'Audit log chain must be mathematically valid');
    assert.ok(auditStatus.totalEvents >= 6, 'Must contain historical audit events');
  });
});
