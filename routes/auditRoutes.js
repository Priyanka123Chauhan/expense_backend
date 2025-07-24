const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authorizeRoles('admin'), getAuditLogs);

module.exports = router;
