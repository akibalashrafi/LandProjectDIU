import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuditService } from './auditService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'demo_landsure_bd_jwt_secret_key_2026_super_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export class AuthService {
    static async register(data) {
        // Check if phone or email already registered
        const existingPhone = db.getUsers().find(u => u.phone === data.phone.trim());
        if (existingPhone) {
            throw new Error('A user with this mobile number is already registered.');
        }
        if (data.email && data.email.trim()) {
            const existingEmail = db.getUsers().find(u => u.email === data.email.trim().toLowerCase());
            if (existingEmail) {
                throw new Error('A user with this email address is already registered.');
            }
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);
        const userId = crypto.randomUUID();
        // Data minimization: mask NID
        let nidMasked = undefined;
        if (data.nid) {
            const cleanNid = data.nid.replace(/\s+/g, '');
            nidMasked = cleanNid.length > 4 ? `${cleanNid.slice(0, 4)}************${cleanNid.slice(-2)}` : '****';
        }
        const newUser = {
            id: userId,
            fullName: data.fullName.trim(),
            phone: data.phone.trim(),
            email: data.email ? data.email.trim().toLowerCase() : undefined,
            passwordHash,
            role: data.role || 'CITIZEN',
            address: data.address?.trim(),
            nidMasked,
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.getUsers().push(newUser);
        db.persistSync();
        AuditService.log({
            actorId: userId,
            actorRole: newUser.role,
            action: 'USER_REGISTERED',
            targetType: 'USER',
            targetId: userId,
            reason: 'Citizen signed up on LandSure BD platform.',
            outcome: 'SUCCESS'
        });
        const token = this.generateToken(newUser);
        const { passwordHash: _, ...safeUser } = newUser;
        return { user: safeUser, token };
    }
    static async login(phone, password) {
        const user = db.getUsers().find(u => u.phone === phone.trim());
        if (!user) {
            AuditService.log({
                actorRole: 'ANONYMOUS',
                action: 'LOGIN_FAILED',
                targetType: 'USER',
                targetId: phone,
                reason: 'User not found.',
                outcome: 'FAILED'
            });
            throw new Error('Invalid phone number or password.');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            AuditService.log({
                actorId: user.id,
                actorRole: user.role,
                action: 'LOGIN_FAILED',
                targetType: 'USER',
                targetId: user.id,
                reason: 'Incorrect password entered.',
                outcome: 'FAILED'
            });
            throw new Error('Invalid phone number or password.');
        }
        AuditService.log({
            actorId: user.id,
            actorRole: user.role,
            action: 'LOGIN_SUCCESS',
            targetType: 'USER',
            targetId: user.id,
            reason: 'User logged in successfully.',
            outcome: 'SUCCESS'
        });
        const token = this.generateToken(user);
        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }
    static generateToken(user) {
        const payload = {
            userId: user.id,
            phone: user.phone,
            role: user.role
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
    static getUserById(id) {
        const user = db.getUsers().find(u => u.id === id);
        if (!user)
            return null;
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}
