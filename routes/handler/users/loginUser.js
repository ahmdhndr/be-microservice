const jwt = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');

const {
  SERVICE_USER_URL,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_EXPIRED,
} = process.env;

const api = apiAdapter(SERVICE_USER_URL);

module.exports = async (req, res) => {
  try {
    const response = await api.post('/users/login', req.body);
    const user = response.data.data;

    const accessToken = jwt.sign(
      { data: user },
      ACCESS_TOKEN_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRED },
    );

    const refreshToken = jwt.sign(
      { data: user },
      REFRESH_TOKEN_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRED },
    );

    await api.post('/refresh_tokens', { refreshToken, userId: user.id });

    return res.json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ status: 'error', message: 'Service unavailable' });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
