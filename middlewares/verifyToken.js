const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_KEY } = process.env;

module.exports = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  jwt.verify(accessToken, ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({
          status: 'error',
          message: 'Sesi Anda telah habis!',
        });
      }

      return res.status(403).json({ message: err.message });
    }

    const issuedAt = new Date(decoded.iat * 1000).toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
      hour12: false,
    });
    const expiredAt = new Date(decoded.exp * 1000).toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
      hour12: false,
    });
    console.log('tanggal dibuat => ', issuedAt);
    console.log('tanggal expired => ', expiredAt);
    req.user = decoded;
    return next();
  });
};
