const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrganizationSchema = new Schema({
    token: { type: String, index: true },
    otp: { type: String, index: true },
    email: { type: String, index: true },
    status: { type: Boolean, default: true, index: true },
    used: { type: Boolean, default: false, index: true },
    expired: { type: Boolean, default: false, index: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    collection: 'forgot_links',
    strict: false,
    strictQuery: false,
});

OrganizationSchema.set('autoIndex', true)
const ForgotLinks = mongoose.model('ForgotLinks', OrganizationSchema);
module.exports = ForgotLinks;