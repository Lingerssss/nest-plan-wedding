import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Countdown from '@/components/Countdown'
import TaskList from '@/components/task/TaskList'
import AddTaskForm from '@/components/task/AddTaskForm'
import ShareWedding from '@/components/ShareWedding'
import { AppError } from '@/lib/server/errors/app-error'
import { getWeddingDetail } from '@/lib/server/services/wedding-service'
import type { WeddingDetailDto } from '@/types/wedding'

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  let wedding: WeddingDetailDto | null = null
  let errorTitle: string | null = null
  let errorMessage: string | null = null

  try {
    wedding = await getWeddingDetail(user.id, id)
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw error
    }

    errorTitle = error.code === 'FORBIDDEN' ? '无权访问' : '加载失败'
    errorMessage = error.message || '无法加载婚礼信息，请稍后重试'
  }

  if (!wedding) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorTitle}</h1>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Link href="/weddings" className="text-pink-600 hover:text-pink-700">
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  const weddingDate = new Date(wedding.weddingDate)
  const totalTasks = wedding.tasks.length
  const completedTasks = wedding.tasks.filter((task) => task.status === 'COMPLETED').length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const isOwner = wedding.role === 'OWNER'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/weddings"
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          ← 返回列表
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{wedding.name}</h1>
        <p className="text-lg text-gray-600">
          婚礼日期：{weddingDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="mb-8">
        <Countdown weddingDate={weddingDate} />
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">筹备进度</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            已完成 {completedTasks} / {totalTasks} 项任务
          </span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-pink-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 显示所有参与者 */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">参与者</h2>
        <div className="flex flex-wrap gap-3">
          {wedding.participants.map((participant) => (
            <div
              key={participant.id}
              className={`px-4 py-2 rounded-lg ${
                participant.userId === wedding.createdById
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              <span className="font-medium">{participant.username}</span>
              {participant.userId === wedding.createdById && (
                <span className="ml-2 text-xs">(创建人)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOwner && wedding.shortId && (
        <ShareWedding shortId={wedding.shortId} weddingName={wedding.name} />
      )}

      {isOwner && (
        <div className="mb-8">
          <AddTaskForm weddingId={id} />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">任务列表</h2>
        <TaskList
          taskGroups={wedding.taskGroups}
          isOwner={isOwner}
          participants={wedding.participants.map((participant) => ({
            id: participant.userId,
            username: participant.username,
          }))}
        />
      </div>
    </div>
  )
}
