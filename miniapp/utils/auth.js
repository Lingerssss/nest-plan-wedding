const TOKEN_KEY = 'accessToken'
const USER_KEY = 'currentUser'

function setSession(session) {
  wx.setStorageSync(TOKEN_KEY, session.accessToken || '')
  wx.setStorageSync(USER_KEY, session.user || null)
  getApp().globalData.user = session.user || null
}

function clearSession() {
  wx.removeStorageSync(TOKEN_KEY)
  wx.removeStorageSync(USER_KEY)
  getApp().globalData.user = null
}

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || ''
}

function getCurrentUser() {
  const app = getApp()
  if (app.globalData.user) {
    return app.globalData.user
  }

  const user = wx.getStorageSync(USER_KEY) || null
  app.globalData.user = user
  return user
}

function requireLogin() {
  const token = getToken()
  if (!token) {
    wx.redirectTo({
      url: '/pages/login/index',
    })
    return false
  }

  return true
}

module.exports = {
  clearSession,
  getCurrentUser,
  getToken,
  requireLogin,
  setSession,
}
