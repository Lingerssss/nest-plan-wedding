/* eslint-disable @typescript-eslint/no-require-imports */
const { getCurrentUser, requireLogin } = require('../../utils/auth')
const { request } = require('../../utils/request')

Page({
  data: {
    user: null,
    weddings: [],
    loading: false,
    error: '',
  },

  onShow() {
    if (!requireLogin()) {
      return
    }

    this.setData({
      user: getCurrentUser(),
    })

    this.loadWeddings()
  },

  async loadWeddings() {
    this.setData({
      loading: true,
      error: '',
    })

    try {
      const result = await request({
        url: '/weddings',
      })

      this.setData({
        weddings: result.weddings || [],
      })
    } catch (error) {
      this.setData({
        error: error.message || '加载婚礼失败',
      })
    } finally {
      this.setData({
        loading: false,
      })
    }
  },

  goToJoin() {
    wx.navigateTo({
      url: '/pages/weddings/join',
    })
  },

  goToDetail(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/weddings/detail?id=${id}`,
    })
  },
})
