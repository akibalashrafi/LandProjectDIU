import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');
const initialStore = {
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
    store;
    isLoaded = false;
    lockPromise = Promise.resolve();
    constructor() {
        this.store = { ...initialStore };
        this.init();
    }
    init() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs.existsSync(STORE_PATH)) {
            try {
                const raw = fs.readFileSync(STORE_PATH, 'utf-8');
                this.store = JSON.parse(raw);
                this.isLoaded = true;
            }
            catch (err) {
                console.error('Failed to parse database store, initializing default store', err);
                this.store = { ...initialStore };
                this.persistSync();
            }
        }
        else {
            this.persistSync();
        }
    }
    persistSync() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        const tempPath = `${STORE_PATH}.tmp.${Date.now()}`;
        fs.writeFileSync(tempPath, JSON.stringify(this.store, null, 2), 'utf-8');
        fs.renameSync(tempPath, STORE_PATH);
    }
    async withLock(action) {
        const prevLock = this.lockPromise;
        let resolveLock;
        this.lockPromise = new Promise(resolve => {
            resolveLock = resolve;
        });
        await prevLock;
        try {
            const result = await action();
            this.persistSync();
            return result;
        }
        finally {
            resolveLock();
        }
    }
    // Generic Getters
    getUsers() { return this.store.users; }
    getParcels() { return this.store.parcels; }
    getClaims() { return this.store.ownershipClaims; }
    getDocuments() { return this.store.documents; }
    getReports() { return this.store.verificationReports; }
    getAlerts() { return this.store.fraudAlerts; }
    getTransactions() { return this.store.transactions; }
    getAdminRequests() { return this.store.adminUpdateRequests; }
    getOtpChallenges() { return this.store.otpChallenges; }
    getAuditEvents() { return this.store.auditEvents; }
    // Setters for direct seed loading
    setStore(newStore) {
        this.store = newStore;
        this.persistSync();
    }
    // Audit event hash-chain addition
    appendAuditEvent(event) {
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
        const fullEvent = {
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
