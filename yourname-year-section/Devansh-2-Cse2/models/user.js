const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Hash the password with a salt round of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
module.exports= mongoose.model('User', UserSchema);