'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { weddingApi } from '@/lib/api'
import type { WeddingListItemDto } from '@/types/wedding'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '加载婚礼列表失败'
}

export default function WeddingListClient() {
  const [weddings, setWeddings] = useState<WeddingListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWeddings() {
      try {
        const data = await weddingApi.getAll()
        if (!cancelled) {
          setWeddings(data.weddings)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadWeddings()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">我的婚礼</h1>
        <div className="flex gap-3">
          <Link
            href="/weddings/join"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            加入婚礼
          </Link>
          <Link
            href="/weddings/new"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            创建新婚礼
          </Link>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded mb-6" />
              <div className="h-2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && weddings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">还没有创建任何婚礼</p>
          <Link
            href="/weddings/new"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            创建第一个婚礼 →
          </Link>
        </div>
      )}

      {!loading && !error && weddings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => {
            const weddingDate = new Date(wedding.weddingDate)
            const now = new Date()
            const daysLeft = Math.ceil(
              (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
            const totalTasks = wedding.taskSummary.total
            const completedTasks = wedding.taskSummary.completed
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

            return (
              <Link
                key={wedding.id}
                href={`/weddings/${wedding.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {wedding.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  婚礼日期：{weddingDate.toLocaleDateString('zh-CN')}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>倒计时：{daysLeft > 0 ? `还有${daysLeft}天` : '已过期'}</span>
                    <span>
                      {completedTasks}/{totalTasks} 完成
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  创建人：{wedding.creatorName || '未知'}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
