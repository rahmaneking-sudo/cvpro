import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function sanitizeUser(user) {
  const { password, verifyToken, resetToken, resetExpires, ...safe } = user;
  return safe;
}
