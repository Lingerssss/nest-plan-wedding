/* eslint-disable @typescript-eslint/no-require-imports */
const { requireLogin } = require('../../utils/auth')
const { request } = require('../../utils/request')

const STATUS_OPTIONS = [
  { label: '待处理', value: 'PENDING' },
  { label: '进行中', value: 'IN_PROGRESS' },
  { label: '已完成', value: 'COMPLETED' },
]

Page({
  data: {
    weddingId: '',
    wedding: null,
    taskSummary: {
      total: 0,
      completed: 0,
    },
    loading: false,
    error: '',
    statusLabels: STATUS_OPTIONS.map((item) => item.label),
  },

  onLoad(query) {
    if (!requireLogin()) {
      return
    }

    this.setData({
      weddingId: query.id || '',
    })
  },

  onShow() {
    if (!this.data.weddingId) {
      return
    }

    this.loadWedding()
  },

  async loadWedding() {
    this.setData({
      loading: true,
      error: '',
    })

    try {
      const result = await request({
        url: `/weddings/${this.data.weddingId}`,
      })
      const taskGroups = (result.wedding.taskGroups || []).map((group) => ({
        ...group,
        tasks: (group.tasks || []).map((task) => ({
          ...task,
          statusIndex: this.getTaskStatusIndex(task.status),
        })),
      }))
      const tasks = result.wedding.tasks || []
      const completed = tasks.filter((task) => task.status === 'COMPLETED').length

      this.setData({
        wedding: {
          ...result.wedding,
          taskGroups,
        },
        taskSummary: {
          total: tasks.length,
          completed,
        },
      })
    } catch (error) {
      this.setData({
        error: error.message || '加载婚礼详情失败',
      })
    } finally {
      this.setData({
        loading: false,
      })
    }
  },

  getTaskStatusIndex(status) {
    return Math.max(
      STATUS_OPTIONS.findIndex((item) => item.value === status),
      0
    )
  },

  async onTaskStatusChange(event) {
    const { taskId } = event.currentTarget.dataset
    const index = Number(event.detail.value || 0)
    const selected = STATUS_OPTIONS[index]

    try {
      await request({
        url: `/tasks/${taskId}`,
        method: 'PUT',
        data: {
          status: selected.value,
        },
      })

      wx.showToast({
        title: '状态已更新',
        icon: 'success',
      })

      await this.loadWedding()
    } catch (error) {
      wx.showToast({
        title: error.message || '更新失败',
        icon: 'none',
      })
    }
  },
})
