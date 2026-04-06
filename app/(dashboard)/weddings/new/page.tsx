'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { weddingApi } from '@/lib/api'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '创建失败，请重试'
}

export default function NewWeddingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [existingWeddingsCount, setExistingWeddingsCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  // 检查是否已有婚礼
  useEffect(() => {
    const checkExistingWeddings = async () => {
      try {
        const data = await weddingApi.getAll()
        const count = data.weddings?.length || 0
        setExistingWeddingsCount(count)
        setShowWarning(count > 0)
      } catch (error) {
        console.error('Failed to check existing weddings:', error)
      }
    }
    checkExistingWeddings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 如果已有婚礼，需要确认
    if (existingWeddingsCount > 0) {
      const confirmed = window.confirm(
        `您已经有一个备婚事项了。确定要创建第二个备婚事项吗？\n\n通常一个人只需要一个备婚事项，如果您需要修改现有事项，建议返回列表进行编辑。`
      )
      if (!confirmed) {
        return
      }
    }

    setLoading(true)

    try {
      console.log('Creating wedding:', { name, weddingDate })
      const response = await weddingApi.create(name, weddingDate)
      console.log('Wedding created:', response)
      
      if (!response.wedding || !response.wedding.id) {
        throw new Error('创建成功但返回数据异常')
      }
      
      const weddingId = response.wedding.id
      console.log('Redirecting to wedding:', weddingId)
      
      router.push(`/weddings/${weddingId}`)
      router.refresh()
    } catch (err) {
      console.error('Failed to create wedding:', err)
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/weddings"
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          ← 返回列表
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">创建新婚礼</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {showWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>提示：</strong>您已经有一个备婚事项了。通常一个人只需要一个备婚事项。
                    如果您需要修改现有事项，建议返回列表进行编辑。
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              婚礼名称 *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="例如：小巩和小陆的婚礼"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-2">
              婚礼日期 *
            </label>
            <input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              required
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建'}
            </button>
            <Link
              href="/weddings"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
