import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  User,
  LandParcel,
  OwnershipClaim,
  Document,
  VerificationReport,
  FraudAlert,
  LandTransaction,
  AdminUpdateRequest,
  OTPChallenge,
  AuditEvent
} from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

export interface DatabaseStore {
  users: User[];
  parcels: LandParcel[];
  ownershipClaims: OwnershipClaim[];
  documents: Document[];
  verificationReports: VerificationReport[];
  fraudAlerts: FraudAlert[];
  transactions: LandTransaction[];
  adminUpdateRequests: AdminUpdateRequest[];
  otpChallenges: OTPChallenge[];
  auditEvents: AuditEvent[];
}

const initialStore: DatabaseStore = {
  users: [],
  parcels: [],
  ownershipClaims: [],
  documents: [],
  verificationReports: [],
  fraudAlerts: [],
  transactions: [],
  adminUpdateRequests: [],
  otpChallenges: [],
  auditEvents: []
};

class Database {
  private store: DatabaseStore;
  private isLoaded = false;
  private lockPromise: Promise<void> = Promise.resolve();

  constructor() {
    this.store = { ...initialStore };
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.store = JSON.parse(raw);
        this.isLoaded = true;
      } catch (err) {
        console.error('Failed to parse database store, initializing default store', err);
        this.store = { ...initialStore };
        this.persistSync();
      }
    } else {
      this.persistSync();
    }
  }

  public persistSync() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = `${STORE_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(this.store, null, 2), 'utf-8');
    fs.renameSync(tempPath, STORE_PATH);
  }

  public async withLock<T>(action: () => Promise<T> | T): Promise<T> {
    const prevLock = this.lockPromise;
    let resolveLock: () => void;
    this.lockPromise = new Promise(resolve => {
      resolveLock = resolve;
    });

    await prevLock;
    try {
      const result = await action();
      this.persistSync();
      return result;
    } finally {
      resolveLock!();
    }
  }

  // Generic Getters
  public getUsers() { return this.store.users; }
  public getParcels() { return this.store.parcels; }
  public getClaims() { return this.store.ownershipClaims; }
  public getDocuments() { return this.store.documents; }
  public getReports() { return this.store.verificationReports; }
  public getAlerts() { return this.store.fraudAlerts; }
  public getTransactions() { return this.store.transactions; }
  public getAdminRequests() { return this.store.adminUpdateRequests; }
  public getOtpChallenges() { return this.store.otpChallenges; }
  public getAuditEvents() { return this.store.auditEvents; }

  // Setters for direct seed loading
  public setStore(newStore: DatabaseStore) {
    this.store = newStore;
    this.persistSync();
  }

  // Audit event hash-chain addition
  public appendAuditEvent(event: Omit<AuditEvent, 'id' | 'eventHash' | 'previousHash' | 'timestamp'>): AuditEvent {
    const lastEvent = this.store.auditEvents[this.store.auditEvents.length - 1];
    const previousHash = lastEvent ? lastEvent.eventHash : null;
    const timestamp = new Date().toISOString();
    const id = crypto.randomUUID();

    const payload = JSON.stringify({
      id,
      previousHash,
      actorId: event.actorId,
      actorRole: event.actorRole,
      action: event.action,
      targetType: event.targetType,
      targetId: event.targetId,
      reason: event.reason,
      oldValues: event.oldValues,
      newValues: event.newValues,
      outcome: event.outcome,
      ipAddress: event.ipAddress,
      timestamp
    });

    const eventHash = crypto.createHash('sha256').update(payload).digest('hex');

    const fullEvent: AuditEvent = {
      ...event,
      id,
      eventHash,
      previousHash,
      timestamp
    };

    this.store.auditEvents.push(fullEvent);
    this.persistSync();
    return fullEvent;
  }
}

export const db = new Database();
