const axios = require("axios");
const runnAPI = axios.create({
  baseURL: "https://app.runn.io/api/v0",
  headers: { Authorization: `Bearer ${process.env.RUNN_API_KEY}` },
});

module.exports = { runnAPI };
