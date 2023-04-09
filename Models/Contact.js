const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = new Schema({
    comment: { type: String, index: true },
    name: { type: String, index: true },
    email: { type: String, index: true },
    userId: { type: String, index: true },
    company: { type: String, index: true }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    strict: false,
    strictQuery: false,
});

Review.set('autoIndex', true)
const Contact = mongoose.model('Contact', Review);
module.exports = Contact;