import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuditEvent } from '../types/index.js';

export class AuditService {
  static log(entry: {
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
  }): AuditEvent {
    return db.appendAuditEvent(entry);
  }

  static getHistory(targetId?: string, limit: number = 50): AuditEvent[] {
    const events = db.getAuditEvents();
    if (targetId) {
      return events
        .filter(e => e.targetId === targetId || e.actorId === targetId)
        .slice(-limit)
        .reverse();
    }
    return events.slice(-limit).reverse();
  }

  static verifyIntegrity(): { isValid: boolean; brokenAtIndex?: number; totalEvents: number } {
    const events = db.getAuditEvents();
    let prevHash: string | null = null;

    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (e.previousHash !== prevHash) {
        return { isValid: false, brokenAtIndex: i, totalEvents: events.length };
      }

      const payload: string = JSON.stringify({
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

      const computed: string = crypto.createHash('sha256').update(payload).digest('hex');
      if (computed !== e.eventHash) {
        return { isValid: false, brokenAtIndex: i, totalEvents: events.length };
      }

      prevHash = e.eventHash;
    }

    return { isValid: true, totalEvents: events.length };
  }
}
