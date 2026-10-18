import crypto from 'crypto';
import { db } from '../db/database.js';
import { OTPChallenge } from '../types/index.js';

const MOCK_OTP_ENABLED = process.env.MOCK_OTP_ENABLED !== 'false';
const MOCK_OTP_DEFAULT = process.env.MOCK_OTP_DEFAULT_CODE || '123456';
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);

export class OTPService {
  static createChallenge(phone: string, purpose: OTPChallenge['purpose']): { challengeId: string; mockCode?: string; expiresAt: string } {
    // Generate 6 digit code
    const rawCode = MOCK_OTP_ENABLED ? MOCK_OTP_DEFAULT : Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash('sha256').update(rawCode).digest('hex');
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
    const challengeId = crypto.randomUUID();

    const challenge: OTPChallenge = {
      id: challengeId,
      phone,
      codeHash,
      purpose,
      expiresAt,
      isUsed: false,
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    db.getOtpChallenges().push(challenge);
    db.persistSync();

    if (MOCK_OTP_ENABLED) {
      console.log(`[DEV/MOCK OTP] Generated code for ${phone} (${purpose}): ${rawCode}`);
    } else {
      // In production, integrate external SMS gateway here
      console.log(`[SMS GATEWAY] Dispatched OTP to ${phone}`);
    }

    return {
      challengeId,
      mockCode: MOCK_OTP_ENABLED ? rawCode : undefined,
      expiresAt
    };
  }

  static verifyChallenge(challengeId: string, inputCode: string): { success: boolean; message: string } {
    const challenge = db.getOtpChallenges().find(c => c.id === challengeId);
    if (!challenge) {
      return { success: false, message: 'Invalid or non-existent OTP challenge.' };
    }

    if (challenge.isUsed) {
      return { success: false, message: 'This OTP has already been used. Please request a new one.' };
    }

    if (new Date() > new Date(challenge.expiresAt)) {
      return { success: false, message: 'OTP has expired. Please request a fresh code.' };
    }

    if (challenge.attempts >= 5) {
      return { success: false, message: 'Maximum verification attempts exceeded. Code invalidated.' };
    }

    challenge.attempts += 1;
    const inputHash = crypto.createHash('sha256').update(inputCode.trim()).digest('hex');

    if (inputHash !== challenge.codeHash) {
      db.persistSync();
      return { success: false, message: 'Incorrect OTP code.' };
    }

    // Success: mark as used
    challenge.isUsed = true;
    db.persistSync();
    return { success: true, message: 'OTP verification successful.' };
  }
}
