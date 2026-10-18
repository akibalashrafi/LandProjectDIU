import { AuthService } from '../services/authService.js';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
    }
    try {
        const payload = AuthService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }
}
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Action requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user.role}`
            });
        }
        next();
    };
}
