const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text (as requested)
  role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

