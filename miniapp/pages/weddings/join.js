/* eslint-disable @typescript-eslint/no-require-imports */
const { requireLogin } = require('../../utils/auth')
const { request } = require('../../utils/request')

Page({
  data: {
    shortId: '',
    wedding: null,
    loading: false,
    previewLoading: false,
    error: '',
  },

  onShow() {
    requireLogin()
  },

  onShortIdInput(event) {
    this.setData({
      shortId: String(event.detail.value || '').replace(/\D/g, '').slice(0, 6),
      wedding: null,
      error: '',
    })
  },

  async previewWedding() {
    const { shortId } = this.data
    if (shortId.length !== 6) {
      this.setData({ error: '请输入 6 位数字婚礼 ID' })
      return
    }

    this.setData({
      previewLoading: true,
      error: '',
    })

    try {
      const result = await request({
        url: `/weddings/join/${shortId}`,
        auth: false,
      })

      this.setData({
        wedding: result.wedding,
      })
    } catch (error) {
      this.setData({
        error: error.message || '查询失败',
        wedding: null,
      })
    } finally {
      this.setData({
        previewLoading: false,
      })
    }
  },

  async joinWedding() {
    if (!this.data.wedding) {
      await this.previewWedding()
      return
    }

    this.setData({
      loading: true,
      error: '',
    })

    try {
      const result = await request({
        url: `/weddings/join/${this.data.shortId}`,
        method: 'POST',
      })

      wx.redirectTo({
        url: `/pages/weddings/detail?id=${result.wedding.id}`,
      })
    } catch (error) {
      this.setData({
        error: error.message || '加入失败',
      })
    } finally {
      this.setData({
        loading: false,
      })
    }
  },
})
