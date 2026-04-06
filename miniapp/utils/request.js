/* eslint-disable @typescript-eslint/no-require-imports */
const { getApiBaseUrl } = require('../config/env')
const { clearSession, getToken } = require('./auth')

function request({ url, method = 'GET', data, auth = true }) {
  const token = getToken()

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getApiBaseUrl()}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      success: (response) => {
        const { statusCode, data: payload } = response

        if (statusCode >= 200 && statusCode < 300) {
          resolve(payload)
          return
        }

        if (statusCode === 401) {
          clearSession()
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }

        reject(new Error(payload?.error || '请求失败'))
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络请求失败'))
      },
    })
  })
}

module.exports = {
  request,
}
