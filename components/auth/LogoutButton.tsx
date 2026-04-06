'use client'

import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authApi.logout()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      退出登录
    </button>
  )
}
