const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    role: String,
    isActive: String,
    otp: String,
    timeStamp: Date,
    forgot_password_token: String,
    two_step_auth: Boolean,
});

module.exports = mongoose.model('User', userSchema);