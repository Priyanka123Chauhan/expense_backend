// const mongoose = require('mongoose');

// const AuditLogSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     action: { type: String, required: true },
//     details: { type: String },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('AuditLog', AuditLogSchema);
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
