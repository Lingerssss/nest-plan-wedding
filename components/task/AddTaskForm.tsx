'use client'

import { useState } from 'react'
import { taskApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import type { TaskPhase } from '@/types/task'

interface AddTaskFormProps {
  weddingId: string
}

const PREPARATION_TIME_FRAMES = ['5个月', '3个月', '3周', '1周', '当天']
const WEDDING_DAY_TIME_FRAMES = ['清晨', '接亲', '仪式', '宴席', '收尾']

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '创建任务失败'
}

export default function AddTaskForm({ weddingId }: AddTaskFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [owner, setOwner] = useState('')
  const [phase, setPhase] = useState<TaskPhase>('PREPARATION')
  const [timeFrame, setTimeFrame] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const timeFrames = phase === 'WEDDING_DAY' ? WEDDING_DAY_TIME_FRAMES : PREPARATION_TIME_FRAMES
  const currentGroupIndex = Math.max(timeFrames.indexOf(timeFrame), 0)
  const sortOrder = (phase === 'WEDDING_DAY' ? 500 : 200) + currentGroupIndex * 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !owner || !timeFrame) {
      setError('请填写所有必填字段')
      return
    }

    setLoading(true)

    try {
      await taskApi.create(weddingId, {
        title,
        description: description || undefined,
        owner,
        phase,
        timeFrame,
        status: 'PENDING',
        scheduledAt: phase === 'WEDDING_DAY' ? (scheduledAt || null) : null,
        sortOrder,
      })

      // 重置表单
      setTitle('')
      setDescription('')
      setOwner('')
      setPhase('PREPARATION')
      setTimeFrame('')
      setScheduledAt('')
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium"
      >
        + 添加新任务
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">添加新任务</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务标题 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="例如：确定婚礼宾客"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务描述（可选）
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={3}
            placeholder="任务详细描述..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              负责人 *
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="例如：巩、陆、一起"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              阶段 *
            </label>
            <select
              value={phase}
              onChange={(e) => {
                const nextPhase = e.target.value as TaskPhase
                setPhase(nextPhase)
                setTimeFrame('')
                if (nextPhase !== 'WEDDING_DAY') {
                  setScheduledAt('')
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="PREPARATION">前期筹备</option>
              <option value="WEDDING_DAY">婚礼当天</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时间段 *
            </label>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">请选择</option>
              {timeFrames.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {phase === 'WEDDING_DAY' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              婚礼当天时间（可选）
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : '创建任务'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setTitle('')
              setDescription('')
              setOwner('')
              setPhase('PREPARATION')
              setTimeFrame('')
              setScheduledAt('')
              setError('')
            }}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
