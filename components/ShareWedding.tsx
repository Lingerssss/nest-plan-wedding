'use client'

import { useState } from 'react'

interface ShareWeddingProps {
  shortId: string
  weddingName: string
}

export default function ShareWedding({ shortId, weddingName }: ShareWeddingProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = shortId
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Fallback copy failed:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">邀请他人加入</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            婚礼ID（分享给他人）
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-2xl tracking-wider text-center">
              {shortId}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
            >
              {copied ? '已复制！' : '复制'}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          其他人可以通过这个 6 位数字 ID 加入“{weddingName}”的婚礼筹备。让他们访问“加入婚礼”页面并输入此 ID。
        </p>
      </div>
    </div>
  )
}
