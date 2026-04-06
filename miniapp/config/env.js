const PROD_API_BASE_URL = 'https://your-web-api-domain.example.com/api'
const DEV_API_BASE_URL = 'http://127.0.0.1:3000/api'

function getApiBaseUrl() {
  return __wxConfig.envVersion === 'release'
    ? PROD_API_BASE_URL
    : DEV_API_BASE_URL
}

module.exports = {
  getApiBaseUrl,
}
