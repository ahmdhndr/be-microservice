const axios = require('axios');

const { TIMEOUT } = process.env;

module.exports = (baseUrl) => axios.create({
  baseURL: baseUrl,
  timeout: parseInt(TIMEOUT),
});
