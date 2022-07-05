const apiAdapter = require('../../apiAdapter');

const { SERVICE_MEDIA_URL } = process.env;

const api = apiAdapter(SERVICE_MEDIA_URL);

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await api.delete(`/media/${id}`);
    return res.json(media.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ status: 'error', message: 'Service unavailable' });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
