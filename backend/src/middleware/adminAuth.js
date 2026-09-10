/**
 * Simple shared-secret guard for admin endpoints.
 * Send the token in the `x-admin-token` header. Set ADMIN_TOKEN in .env.
 */
module.exports = function adminAuth(req, res, next) {
  const token = req.get('x-admin-token');
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_TOKEN is not configured on the server' });
  }
  if (token !== expected) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing x-admin-token' });
  }
  next();
};
