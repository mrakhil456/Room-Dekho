const User = require('../models/User');

async function ensureAdmin() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');

  if (!email || !password) {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD are not set. Admin auto-provisioning is disabled.');
    return null;
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    let changed = false;

    if (existing.role !== 'admin') {
      existing.role = 'admin';
      changed = true;
      console.log(`Existing account ${email} promoted to admin.`);
    }

    if (!existing.isVerified) {
      existing.isVerified = true;
      changed = true;
    }

    // Keep the configured ADMIN_PASSWORD usable for the provisioned admin.
    // Mongoose's save hook hashes the new plaintext password.
    const passwordMatches = await existing.comparePassword(password);
    if (!passwordMatches) {
      existing.password = password;
      changed = true;
      console.log(`Admin password synchronized for ${email}.`);
    }

    if (changed) await existing.save();
    return existing;
  }

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'RoomDekho Admin',
    email,
    password,
    role: 'admin',
    isVerified: true,
  });

  console.log(`Admin account provisioned: ${email}`);
  return admin;
}

module.exports = ensureAdmin;
