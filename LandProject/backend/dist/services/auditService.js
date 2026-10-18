import crypto from 'crypto';
import { db } from '../db/database.js';
export class AuditService {
    static log(entry) {
        return db.appendAuditEvent(entry);
    }
    static getHistory(targetId, limit = 50) {
        const events = db.getAuditEvents();
        if (targetId) {
            return events
                .filter(e => e.targetId === targetId || e.actorId === targetId)
                .slice(-limit)
                .reverse();
        }
        return events.slice(-limit).reverse();
    }
    static verifyIntegrity() {
        const events = db.getAuditEvents();
        let prevHash = null;
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (e.previousHash !== prevHash) {
                return { isValid: false, brokenAtIndex: i, totalEvents: events.length };
            }
            const payload = JSON.stringify({
                id: e.id,
                previousHash: e.previousHash,
                actorId: e.actorId,
                actorRole: e.actorRole,
                action: e.action,
                targetType: e.targetType,
                targetId: e.targetId,
                reason: e.reason,
                oldValues: e.oldValues,
                newValues: e.newValues,
                outcome: e.outcome,
                ipAddress: e.ipAddress,
                timestamp: e.timestamp
            });
            const computed = crypto.createHash('sha256').update(payload).digest('hex');
            if (computed !== e.eventHash) {
                return { isValid: false, brokenAtIndex: i, totalEvents: events.length };
            }
            prevHash = e.eventHash;
        }
        return { isValid: true, totalEvents: events.length };
    }
}
