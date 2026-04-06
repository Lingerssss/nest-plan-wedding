/* eslint-disable @typescript-eslint/no-require-imports */
const { request } = require('../../utils/request')
const { setSession } = require('../../utils/auth')

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    error: '',
  },

  onUsernameInput(event) {
    this.setData({
      username: event.detail.value,
      error: '',
    })
  },

  onPasswordInput(event) {
    this.setData({
      password: event.detail.value,
      error: '',
    })
  },

  async handleLogin() {
    const { username, password } = this.data
    if (!username || !password) {
      this.setData({ error: '请输入用户名和密码' })
      return
    }

    this.setData({ loading: true, error: '' })

    try {
      const result = await request({
        url: '/auth/login',
        method: 'POST',
        auth: false,
        data: {
          username,
          password,
          clientType: 'MINIAPP',
        },
      })

      setSession(result)
      wx.reLaunch({
        url: '/pages/weddings/index',
      })
    } catch (error) {
      this.setData({
        error: error.message || '登录失败',
      })
    } finally {
      this.setData({
        loading: false,
      })
    }
  },
})
