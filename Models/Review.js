const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = new Schema({
    comment: { type: String, index: true },
    userName: { type: String, index: true },
    userEmail: { type: String, index: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    strict: false,
    strictQuery: false,
});

Review.set('autoIndex', true)
const UserReview = mongoose.model('Comment', Review);
module.exports = UserReview;