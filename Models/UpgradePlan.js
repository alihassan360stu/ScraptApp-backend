const mongoose = require('mongoose');
const { Schema } = mongoose;

const UpgradePlan = new Schema({
    name: { type: String, index: true },
    account: { type: Number, index: true },
    amount: { type: Number, index: true },
    email: { type: String, index: true },
    contact: { type: Number, index: true },
    allow: { type: Boolean, default: false, index: true },
    p_method: { type: String, index: true },
    plane_text: { type: String, index: true },
    userId: { type: String, index: true },
    plane: { type: Number, index: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    strict: false,
    strictQuery: false,
});

UpgradePlan.set('autoIndex', true)
const Plane = mongoose.model('Subscribe_Plan', UpgradePlan);
module.exports = Plane;
