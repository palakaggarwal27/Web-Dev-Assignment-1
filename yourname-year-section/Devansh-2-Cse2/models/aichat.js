const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatSessionSchema = new Schema({
    title: { type: String, default: 'New Chat' },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now },
    lastMessage: { type: Date, default: Date.now }
});

const AiChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessions: [ChatSessionSchema],
    activeSession: { type: Schema.Types.ObjectId },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('AiChat', AiChatSchema);
