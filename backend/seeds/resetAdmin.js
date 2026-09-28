const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

async function resetAdmin() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD (minimum 12 characters) in the environment.');
  }
  await mongoose.connect(MONGODB_URI);
  try {
    await User.deleteMany({ role: 'admin' });
    await User.create({ name: process.env.ADMIN_NAME || 'RoomDekho Admin', email: ADMIN_EMAIL.trim().toLowerCase(), password: ADMIN_PASSWORD, role: 'admin', isVerified: true });
    console.log('Admin account reset.');
  } finally {
    await mongoose.disconnect();
  }
}
resetAdmin().catch((error) => { console.error(error.message); process.exitCode = 1; });
