const apiAdapter = require('../../apiAdapter');

const { SERVICE_USER_URL } = process.env;

const api = apiAdapter(SERVICE_USER_URL);

module.exports = async (req, res) => {
  try {
    const { id } = req.user.data;
    const response = await api.get(`/users/${id}`);
    return res.json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ status: 'error', message: 'Service unavailable' });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
