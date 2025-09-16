const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const bearer = header && header.startsWith('Bearer ')
    ? header.slice(7)
    : (req.cookies && req.cookies.token);
  if (!bearer) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(bearer, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authenticate };


