const ensureAuthenticated = require('./auth');

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        ensureAuthenticated(req, res, () => {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }
            next();
        });
    };
};

module.exports = { authorizeRoles };
