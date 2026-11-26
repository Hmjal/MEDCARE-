const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'medcare_jwt_secret_2026';

// Verify JWT token from Authorization: Bearer <token>
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No or invalid token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No or invalid token' });
  }
}

// Role-based authorization middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access denied' });
    }
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
