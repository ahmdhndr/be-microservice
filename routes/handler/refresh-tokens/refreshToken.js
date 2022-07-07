const jwt = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');

const {
  SERVICE_USER_URL,
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_KEY,
} = process.env;

const api = apiAdapter(SERVICE_USER_URL);

// eslint-disable-next-line consistent-return
module.exports = async (req, res) => {
  try {
    const { refresh_token: refreshToken, email } = req.body;
    if (!refreshToken || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid token!',
      });
    }

    await api.get('/refresh_tokens', { params: { refresh_token: refreshToken } });

    jwt.verify(refreshToken, REFRESH_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.statu(403).json({
          status: 'error',
          message: err.message,
        });
      }

      if (email !== decoded.data.email) {
        return res.status(400).json({
          status: 'error',
          message: 'Alamat email tidak valid!',
        });
      }

      const accessToken = jwt.sign({ data: decoded.data }, ACCESS_TOKEN_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRED,
      });
      return res.json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ status: 'error', message: 'Service unavailable' });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
