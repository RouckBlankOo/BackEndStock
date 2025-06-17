const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceName: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
