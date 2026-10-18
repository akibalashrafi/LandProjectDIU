import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuthService } from '../services/authService.js';
import { OTPService } from '../services/otpService.js';
import { AuditService } from '../services/auditService.js';
import { DocumentService } from '../services/documentService.js';
import { FraudDetectionEngine } from '../services/fraudDetectionEngine.js';
import { TransactionService } from '../services/transactionService.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
export const router = express.Router();
// Configure Multer for in-memory file uploads with 10MB limit
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file format. Only PDF, JPEG, and PNG files are accepted.'));
        }
    }
});
/* ==========================================================================
   PUBLIC & VERIFICATION ENDPOINTS
   ========================================================================== */
/**
 * Public document verification by QR token
 */
router.get('/public/verify/:token', (req, res) => {
    const result = DocumentService.getPublicVerification(req.params.token);
    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Verification token not found or record has been revoked.'
        });
    }
    return res.json({ success: true, data: result });
});
/**
 * Public search for parcel verification overview (safe public summary)
 */
router.get('/public/parcel-check', (req, res) => {
    const { plot, khatian, mouza, district } = req.query;
    if (!plot) {
        return res.status(400).json({ success: false, message: 'Plot number is required.' });
    }
    const parcels = db.getParcels().filter(p => {
        let match = p.plotNumber.toLowerCase() === String(plot).trim().toLowerCase();
        if (khatian)
            match = match && p.khatianNumber.toLowerCase() === String(khatian).trim().toLowerCase();
        if (mouza)
            match = match && p.mouza.toLowerCase().includes(String(mouza).trim().toLowerCase());
        return match;
    });
    const safeResults = parcels.map(p => ({
        internalParcelId: p.internalParcelId,
        district: p.district,
        upazila: p.upazila,
        mouza: p.mouza,
        plotNumber: p.plotNumber,
        khatianNumber: p.khatianNumber,
        surveyType: p.surveyType,
        totalArea: p.totalArea,
        areaUnit: p.areaUnit,
        verificationStatus: p.verificationStatus,
        isDisputed: p.isDisputed,
        hasActiveFraudAlerts: db.getAlerts().some(a => a.parcelId === p.id && a.status === 'OPEN'),
        disclaimer: 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD'
    }));
    return res.json({ success: true, data: safeResults });
});
/* ==========================================================================
   AUTHENTICATION & USER PROFILE
   ========================================================================== */
router.post('/auth/register', async (req, res) => {
    try {
        const { fullName, phone, email, password, address, nid } = req.body;
        if (!fullName || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Full name, mobile number, and password are required.' });
        }
        const result = await AuthService.register({
            fullName,
            phone,
            email,
            password,
            address,
            nid
        });
        return res.status(201).json({ success: true, ...result });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.post('/auth/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Mobile number and password are required.' });
        }
        const result = await AuthService.login(phone, password);
        return res.json({ success: true, ...result });
    }
    catch (err) {
        return res.status(401).json({ success: false, message: err.message });
    }
});
router.post('/auth/request-otp', (req, res) => {
    const { phone, purpose } = req.body;
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }
    const challenge = OTPService.createChallenge(phone, purpose || 'LOGIN');
    return res.json({
        success: true,
        message: 'OTP challenge generated.',
        data: challenge
    });
});
router.post('/auth/verify-otp', (req, res) => {
    const { challengeId, code } = req.body;
    if (!challengeId || !code) {
        return res.status(400).json({ success: false, message: 'Challenge ID and code are required.' });
    }
    const result = OTPService.verifyChallenge(challengeId, code);
    return res.json({ success: result.success, message: result.message });
});
router.get('/users/me', authenticateToken, (req, res) => {
    const user = AuthService.getUserById(req.user.userId);
    if (!user)
        return res.status(404).json({ success: false, message: 'User not found.' });
    // Add summary statistics for current user
    const userClaims = db.getClaims().filter(c => c.userId === user.id);
    const userParcels = db.getParcels().filter(p => userClaims.some(c => c.parcelId === p.id));
    const userDocs = db.getDocuments().filter(d => d.uploaderId === user.id);
    const userTxs = db.getTransactions().filter(t => t.sellerId === user.id || t.buyerId === user.id);
    const activeAlerts = db.getAlerts().filter(a => userParcels.some(p => p.id === a.parcelId) && a.status === 'OPEN');
    const pendingRequests = db.getAdminRequests().filter(r => r.targetUserId === user.id && r.status === 'PENDING_USER_CONSENT');
    const totalRecordedArea = userClaims.reduce((sum, c) => sum + c.recordSupportedShare, 0);
    return res.json({
        success: true,
        data: {
            user,
            stats: {
                totalParcels: userParcels.length,
                totalOwnedArea: Number(totalRecordedArea.toFixed(2)),
                totalDocuments: userDocs.length,
                pendingDocuments: userDocs.filter(d => d.verificationStatus === 'PENDING').length,
                documentsWithWarnings: userDocs.filter(d => d.verificationStatus === 'WARNING').length,
                pendingTransactions: userTxs.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && t.status !== 'REJECTED').length,
                completedTransactions: userTxs.filter(t => t.status === 'COMPLETED').length,
                activeAlertsCount: activeAlerts.length,
                pendingConsentRequests: pendingRequests.length
            }
        }
    });
});
/* ==========================================================================
   LAND RECORD MANAGEMENT
   ========================================================================== */
router.get('/lands', authenticateToken, (req, res) => {
    const { all } = req.query;
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    if (all === 'true' && isStaff) {
        const parcels = db.getParcels();
        return res.json({ success: true, data: parcels });
    }
    // Regular user gets parcels where they have an ownership claim
    const userClaims = db.getClaims().filter(c => c.userId === req.user.userId);
    const parcels = db.getParcels().filter(p => userClaims.some(c => c.parcelId === p.id));
    const enrichedParcels = parcels.map(p => {
        const claim = userClaims.find(c => c.parcelId === p.id);
        const docs = db.getDocuments().filter(d => d.parcelId === p.id);
        const alerts = db.getAlerts().filter(a => a.parcelId === p.id && a.status === 'OPEN');
        return {
            ...p,
            userClaim: claim,
            documentCount: docs.length,
            activeAlertsCount: alerts.length
        };
    });
    return res.json({ success: true, data: enrichedParcels });
});
router.post('/lands', authenticateToken, (req, res) => {
    try {
        const { district, upazila, mouza, jlNumber, khatianNumber, plotNumber, surveyType, totalArea, areaUnit, claimedShare, acquisitionMethod, acquisitionDate, sourceDeedRef, notes } = req.body;
        if (!district || !upazila || !mouza || !khatianNumber || !plotNumber || !totalArea) {
            return res.status(400).json({ success: false, message: 'Please provide all mandatory land location and plot fields.' });
        }
        const parcelCount = db.getParcels().length + 1001;
        const internalParcelId = `DEMO-PARCEL-${parcelCount}`;
        const parcelId = crypto.randomUUID();
        const newParcel = {
            id: parcelId,
            internalParcelId,
            district: district.trim(),
            upazila: upazila.trim(),
            mouza: mouza.trim(),
            jlNumber: jlNumber?.trim(),
            khatianNumber: khatianNumber.trim(),
            plotNumber: plotNumber.trim(),
            surveyType: surveyType || 'RS',
            totalArea: parseFloat(totalArea),
            areaUnit: areaUnit || 'decimal',
            sourceDeedRef: sourceDeedRef?.trim(),
            verificationStatus: 'PENDING',
            notes: notes?.trim(),
            isDisputed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.getParcels().push(newParcel);
        // Create initial ownership claim for the user
        const shareAmount = claimedShare ? parseFloat(claimedShare) : parseFloat(totalArea);
        const newClaim = {
            id: crypto.randomUUID(),
            parcelId: parcelId,
            userId: req.user.userId,
            claimedShare: shareAmount,
            recordSupportedShare: shareAmount, // initial claimed
            status: 'CLAIMED',
            acquisitionMethod: acquisitionMethod || 'PURCHASE',
            acquisitionDate: acquisitionDate || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.getClaims().push(newClaim);
        db.persistSync();
        // Run fraud check
        FraudDetectionEngine.runComprehensiveAnalysis(parcelId);
        AuditService.log({
            actorId: req.user.userId,
            actorRole: req.user.role,
            action: 'PARCEL_CREATED',
            targetType: 'LAND_PARCEL',
            targetId: internalParcelId,
            reason: `User recorded plot ${plotNumber}, Khatian ${khatianNumber}, Mouza ${mouza}.`,
            outcome: 'SUCCESS'
        });
        return res.status(201).json({ success: true, data: { parcel: newParcel, claim: newClaim } });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.get('/lands/:id', authenticateToken, (req, res) => {
    const parcel = db.getParcels().find(p => p.id === req.params.id || p.internalParcelId === req.params.id);
    if (!parcel) {
        return res.status(404).json({ success: false, message: 'Land parcel not found.' });
    }
    // Authorization check: User must own a share or be Admin/Reviewer
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    const userClaim = db.getClaims().find(c => c.parcelId === parcel.id && c.userId === req.user.userId);
    if (!isStaff && !userClaim) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view details of this parcel.' });
    }
    const allClaims = db.getClaims().filter(c => c.parcelId === parcel.id).map(c => {
        const owner = db.getUsers().find(u => u.id === c.userId);
        return {
            ...c,
            ownerName: owner?.fullName,
            ownerPhoneMasked: owner ? `${owner.phone.slice(0, 3)}****${owner.phone.slice(-3)}` : undefined
        };
    });
    const docs = db.getDocuments().filter(d => d.parcelId === parcel.id);
    const alerts = db.getAlerts().filter(a => a.parcelId === parcel.id);
    const txs = db.getTransactions().filter(t => t.parcelId === parcel.id);
    const updateRequests = db.getAdminRequests().filter(r => r.parcelId === parcel.id);
    return res.json({
        success: true,
        data: {
            parcel,
            claims: allClaims,
            userClaim,
            documents: docs,
            alerts,
            transactions: txs,
            updateRequests
        }
    });
});
/* ==========================================================================
   DOCUMENT MANAGEMENT & VERIFICATION
   ========================================================================== */
router.post('/documents', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Document file is required.' });
        }
        const { category, parcelId, structuredDataJson, referenceHash, referenceSource } = req.body;
        if (!category) {
            return res.status(400).json({ success: false, message: 'Document category is required.' });
        }
        let structuredData = undefined;
        if (structuredDataJson) {
            try {
                structuredData = JSON.parse(structuredDataJson);
            }
            catch (e) {
                // ignore parse error or keep raw
            }
        }
        const result = await DocumentService.processDocument({
            category,
            parcelId: parcelId || undefined,
            uploaderId: req.user.userId,
            originalFilename: req.file.originalname,
            storagePath: `/uploads/${Date.now()}_${req.file.originalname}`,
            fileSizeBytes: req.file.size,
            mimeType: req.file.mimetype,
            fileBuffer: req.file.buffer,
            structuredData,
            referenceHash: referenceHash?.trim() || undefined,
            referenceSource: referenceSource?.trim() || undefined
        });
        return res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.get('/documents', authenticateToken, (req, res) => {
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    const docs = isStaff
        ? db.getDocuments()
        : db.getDocuments().filter(d => d.uploaderId === req.user.userId);
    const enriched = docs.map(d => {
        const report = db.getReports().find(r => r.documentId === d.id);
        const parcel = d.parcelId ? db.getParcels().find(p => p.id === d.parcelId) : null;
        return {
            ...d,
            report,
            parcelSummary: parcel ? `${parcel.plotNumber} (${parcel.mouza}, ${parcel.district})` : null
        };
    });
    return res.json({ success: true, data: enriched });
});
router.get('/documents/:id', authenticateToken, (req, res) => {
    const doc = db.getDocuments().find(d => d.id === req.params.id || d.documentId === req.params.id);
    if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found.' });
    }
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    if (!isStaff && doc.uploaderId !== req.user.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this document.' });
    }
    const report = db.getReports().find(r => r.documentId === doc.id);
    const parcel = doc.parcelId ? db.getParcels().find(p => p.id === doc.parcelId) : null;
    return res.json({ success: true, data: { document: doc, report, parcel } });
});
/* ==========================================================================
   FRAUD ALERTS & DETECTION
   ========================================================================== */
router.get('/fraud/alerts', authenticateToken, (req, res) => {
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    if (isStaff) {
        const allAlerts = db.getAlerts().map(a => {
            const parcel = a.parcelId ? db.getParcels().find(p => p.id === a.parcelId) : null;
            return { ...a, parcel };
        });
        return res.json({ success: true, data: allAlerts });
    }
    // Regular user gets alerts related to their parcels
    const userClaims = db.getClaims().filter(c => c.userId === req.user.userId);
    const userParcelIds = userClaims.map(c => c.parcelId);
    const userAlerts = db.getAlerts()
        .filter(a => a.parcelId && userParcelIds.includes(a.parcelId))
        .map(a => {
        const parcel = db.getParcels().find(p => p.id === a.parcelId);
        return { ...a, parcel };
    });
    return res.json({ success: true, data: userAlerts });
});
router.post('/fraud/check/:parcelId', authenticateToken, (req, res) => {
    const alerts = FraudDetectionEngine.runComprehensiveAnalysis(req.params.parcelId);
    return res.json({
        success: true,
        message: `Evaluation completed. Found ${alerts.length} active alerts.`,
        data: alerts
    });
});
router.patch('/fraud/alerts/:id/resolve', authenticateToken, requireRole('ADMIN', 'REVIEWER'), (req, res) => {
    const alert = db.getAlerts().find(a => a.id === req.params.id || a.alertId === req.params.id);
    if (!alert) {
        return res.status(404).json({ success: false, message: 'Fraud alert not found.' });
    }
    const { status, reviewerNotes } = req.body;
    alert.status = status || 'RESOLVED';
    alert.reviewerNotes = reviewerNotes || 'Resolved after official inquiry and evidence review.';
    alert.resolvedAt = new Date().toISOString();
    db.persistSync();
    AuditService.log({
        actorId: req.user.userId,
        actorRole: req.user.role,
        action: 'FRAUD_ALERT_RESOLVED',
        targetType: 'FRAUD_ALERT',
        targetId: alert.alertId,
        reason: alert.reviewerNotes,
        outcome: 'SUCCESS'
    });
    return res.json({ success: true, data: alert });
});
/* ==========================================================================
   TRANSACTIONS (BUY / SELL WORKFLOW)
   ========================================================================== */
router.get('/transactions', authenticateToken, (req, res) => {
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    const txs = isStaff
        ? db.getTransactions()
        : db.getTransactions().filter(t => t.sellerId === req.user.userId || t.buyerId === req.user.userId);
    const enriched = txs.map(t => {
        const parcel = db.getParcels().find(p => p.id === t.parcelId);
        const seller = db.getUsers().find(u => u.id === t.sellerId);
        const buyer = db.getUsers().find(u => u.id === t.buyerId);
        return {
            ...t,
            parcel,
            sellerName: seller?.fullName,
            buyerName: buyer?.fullName
        };
    });
    return res.json({ success: true, data: enriched });
});
router.post('/transactions', authenticateToken, async (req, res) => {
    try {
        const { parcelId, buyerPhone, proposedArea, transferNotes } = req.body;
        if (!parcelId || !buyerPhone || !proposedArea) {
            return res.status(400).json({ success: false, message: 'Parcel, buyer mobile number, and proposed area are required.' });
        }
        const tx = await TransactionService.createTransaction({
            parcelId,
            sellerId: req.user.userId,
            buyerPhone,
            proposedArea: parseFloat(proposedArea),
            transferNotes
        });
        return res.status(201).json({ success: true, data: tx });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.post('/transactions/:id/accept', authenticateToken, async (req, res) => {
    try {
        const tx = await TransactionService.buyerAccept(req.params.id, req.user.userId);
        return res.json({ success: true, message: 'Transaction accepted and confirmed by buyer.', data: tx });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.post('/transactions/:id/evidence', authenticateToken, async (req, res) => {
    try {
        const { documentId } = req.body;
        if (!documentId)
            return res.status(400).json({ success: false, message: 'Document ID is required.' });
        const tx = await TransactionService.attachEvidence(req.params.id, documentId, req.user.userId);
        return res.json({ success: true, message: 'Evidence document linked.', data: tx });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
router.post('/transactions/:id/approve', authenticateToken, requireRole('ADMIN', 'REVIEWER'), async (req, res) => {
    try {
        const { notes } = req.body;
        const tx = await TransactionService.approveAndExecuteTransfer(req.params.id, req.user.userId, req.user.role, notes);
        return res.json({ success: true, message: 'Transfer approved and ownership records updated.', data: tx });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
/* ==========================================================================
   ADMIN UPDATES & SECURE CITIZEN OTP CONSENT
   ========================================================================== */
router.get('/admin/update-requests', authenticateToken, (req, res) => {
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'REVIEWER';
    const requests = isStaff
        ? db.getAdminRequests()
        : db.getAdminRequests().filter(r => r.targetUserId === req.user.userId);
    const enriched = requests.map(r => {
        const parcel = db.getParcels().find(p => p.id === r.parcelId);
        const targetUser = db.getUsers().find(u => u.id === r.targetUserId);
        const admin = db.getUsers().find(u => u.id === r.adminAuthorId);
        return { ...r, parcel, targetUserName: targetUser?.fullName, adminName: admin?.fullName };
    });
    return res.json({ success: true, data: enriched });
});
router.post('/admin/update-requests', authenticateToken, requireRole('ADMIN'), (req, res) => {
    try {
        const { parcelId, targetUserId, fieldName, oldValue, proposedValue, reason } = req.body;
        if (!parcelId || !targetUserId || !fieldName || !proposedValue || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        const reqCount = db.getAdminRequests().length + 1;
        const currentYear = new Date().getFullYear();
        const requestId = `REQ-DEMO-${currentYear}-${String(reqCount).padStart(3, '0')}`;
        const newRequest = {
            id: crypto.randomUUID(),
            requestId,
            parcelId,
            targetUserId,
            adminAuthorId: req.user.userId,
            fieldName,
            oldValue: oldValue || '',
            proposedValue,
            reason,
            status: 'PENDING_USER_CONSENT',
            userOtpRequired: true,
            otpVerified: false,
            reviewedBy: req.user.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.getAdminRequests().push(newRequest);
        db.persistSync();
        AuditService.log({
            actorId: req.user.userId,
            actorRole: 'ADMIN',
            action: 'ADMIN_UPDATE_REQUEST_CREATED',
            targetType: 'ADMIN_REQUEST',
            targetId: requestId,
            reason: `Proposed ${fieldName}: '${oldValue}' -> '${proposedValue}'. Requires citizen consent.`,
            outcome: 'SUCCESS'
        });
        return res.status(201).json({ success: true, data: newRequest });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
/**
 * Citizen requests OTP to confirm an admin update request
 */
router.post('/admin/update-requests/:id/request-otp', authenticateToken, (req, res) => {
    const request = db.getAdminRequests().find(r => r.id === req.params.id || r.requestId === req.params.id);
    if (!request)
        return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.targetUserId !== req.user.userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }
    const user = db.getUsers().find(u => u.id === request.targetUserId);
    if (!user)
        return res.status(404).json({ success: false, message: 'Citizen user not found.' });
    const challenge = OTPService.createChallenge(user.phone, 'SENSITIVE_UPDATE');
    return res.json({ success: true, message: 'OTP challenge sent to registered phone.', data: challenge });
});
/**
 * Citizen confirms the update request with OTP
 */
router.post('/admin/update-requests/:id/confirm-otp', authenticateToken, (req, res) => {
    const request = db.getAdminRequests().find(r => r.id === req.params.id || r.requestId === req.params.id);
    if (!request)
        return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.targetUserId !== req.user.userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Unauthorized to consent to this request.' });
    }
    const { challengeId, code } = req.body;
    const verifyRes = OTPService.verifyChallenge(challengeId, code);
    if (!verifyRes.success) {
        return res.status(400).json({ success: false, message: verifyRes.message });
    }
    request.otpVerified = true;
    request.status = 'APPROVED';
    request.updatedAt = new Date().toISOString();
    // Apply update to parcel
    const parcel = db.getParcels().find(p => p.id === request.parcelId);
    if (parcel) {
        if (request.fieldName.toLowerCase().includes('survey')) {
            parcel.surveyType = request.proposedValue;
        }
        else if (request.fieldName.toLowerCase().includes('area')) {
            parcel.totalArea = parseFloat(request.proposedValue);
        }
        else if (request.fieldName.toLowerCase().includes('plot')) {
            parcel.plotNumber = request.proposedValue;
        }
        parcel.updatedAt = new Date().toISOString();
        request.status = 'APPLIED';
    }
    db.persistSync();
    AuditService.log({
        actorId: req.user.userId,
        actorRole: req.user.role,
        action: 'ADMIN_UPDATE_APPLIED_WITH_OTP',
        targetType: 'ADMIN_REQUEST',
        targetId: request.requestId,
        reason: `Citizen verified via OTP; applied change '${request.fieldName}' to '${request.proposedValue}'.`,
        oldValues: { [request.fieldName]: request.oldValue },
        newValues: { [request.fieldName]: request.proposedValue },
        outcome: 'SUCCESS'
    });
    return res.json({ success: true, message: 'Update approved and applied to parcel.', data: request });
});
/* ==========================================================================
   ADMIN AUDIT LOGS & PLATFORM STATS
   ========================================================================== */
router.get('/admin/audit-logs', authenticateToken, requireRole('ADMIN', 'REVIEWER'), (req, res) => {
    const logs = AuditService.getHistory(undefined, 100);
    const integrity = AuditService.verifyIntegrity();
    return res.json({ success: true, data: { logs, integrity } });
});
router.get('/admin/dashboard', authenticateToken, requireRole('ADMIN', 'REVIEWER'), (req, res) => {
    const users = db.getUsers();
    const parcels = db.getParcels();
    const docs = db.getDocuments();
    const alerts = db.getAlerts();
    const txs = db.getTransactions();
    const requests = db.getAdminRequests();
    return res.json({
        success: true,
        data: {
            stats: {
                totalUsers: users.length,
                totalParcels: parcels.length,
                totalDocuments: docs.length,
                openFraudAlerts: alerts.filter(a => a.status === 'OPEN').length,
                pendingReviewDocs: docs.filter(d => d.verificationStatus === 'NEEDS_MANUAL_REVIEW').length,
                pendingTransactions: txs.filter(t => t.status === 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE').length,
                pendingUpdateRequests: requests.filter(r => r.status === 'PENDING_USER_CONSENT').length,
                auditChainStatus: AuditService.verifyIntegrity()
            },
            recentAlerts: alerts.slice(-5).reverse(),
            recentTransactions: txs.slice(-5).reverse(),
            recentAuditEvents: db.getAuditEvents().slice(-5).reverse()
        }
    });
});
router.get('/admin/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
    const safeUsers = db.getUsers().map(({ passwordHash, ...u }) => u);
    return res.json({ success: true, data: safeUsers });
});
