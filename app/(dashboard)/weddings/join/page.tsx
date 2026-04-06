'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { WeddingPreviewDto } from '@/types/wedding'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '请求失败，请重试'
}

export default function JoinWeddingPage() {
  const router = useRouter()
  const [shortId, setShortId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [weddingInfo, setWeddingInfo] = useState<WeddingPreviewDto | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  // 预览婚礼信息
  const handlePreview = async () => {
    if (!shortId || shortId.length !== 6 || !/^\d+$/.test(shortId)) {
      setError('请输入6位数字婚礼ID')
      setWeddingInfo(null)
      return
    }

    setPreviewLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/weddings/join/${shortId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '获取婚礼信息失败')
      }

      setWeddingInfo(data.wedding)
    } catch (err) {
      setError(getErrorMessage(err))
      setWeddingInfo(null)
    } finally {
      setPreviewLoading(false)
    }
  }

  // 加入婚礼
  const handleJoin = async () => {
    if (!shortId || shortId.length !== 6 || !/^\d+$/.test(shortId)) {
      setError('请输入6位数字婚礼ID')
      return
    }

    if (!weddingInfo) {
      await handlePreview()
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/weddings/join/${shortId}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '加入失败')
      }

      // 加入成功，跳转到婚礼详情页
      router.push(`/weddings/${data.wedding.id}`)
      router.refresh()
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">加入婚礼筹备</h1>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="shortId" className="block text-sm font-medium text-gray-700 mb-2">
              婚礼ID（6位）*
            </label>
            <div className="flex gap-2">
            <input
              id="shortId"
              type="text"
              inputMode="numeric"
              value={shortId}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                setShortId(value)
                setWeddingInfo(null)
                setError('')
              }}
              placeholder="例如：123456"
              maxLength={6}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-lg tracking-wider text-center"
            />
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewLoading || shortId.length !== 6}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {previewLoading ? '查询中...' : '查询'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              请输入6位数字婚礼ID，ID由创建人提供
            </p>
          </div>

          {weddingInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                婚礼信息
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">名称：</span>
                  {weddingInfo.name}
                </p>
                <p>
                  <span className="font-medium">婚礼日期：</span>
                  {new Date(weddingInfo.weddingDate).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="font-medium">创建人：</span>
                  {weddingInfo.creatorName || '未知'}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleJoin}
              disabled={loading || !shortId || shortId.length !== 6}
              className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '加入中...' : '加入婚礼'}
            </button>
            <Link
              href="/weddings"
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              取消
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
