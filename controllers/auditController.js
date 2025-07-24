const AuditLog = require('../models/auditLog');

const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getAuditLogs };
