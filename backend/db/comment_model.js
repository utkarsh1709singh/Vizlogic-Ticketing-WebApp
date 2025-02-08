const mongoose = require('mongoose');
const { getDatabaseConnection } = require('./db');
const commentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who added the comment
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})