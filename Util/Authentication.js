const { verify } = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = 'taskmanagingistheassignment';
  const tokenWithoutBearer = token.replace('Bearer ', '');

  verify(tokenWithoutBearer, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = {
      email: decoded.email,
    };
    next();
  });
}

module.exports = verifyToken;

