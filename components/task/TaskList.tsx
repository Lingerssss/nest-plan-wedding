'use client'

import { useRouter } from 'next/navigation'
import { taskApi } from '@/lib/api'
import type { TaskGroupDto, UpdateTaskInput } from '@/types/task'
import TaskItem from './TaskItem'

interface Participant {
  id: string
  username: string
}

interface TaskListProps {
  taskGroups: TaskGroupDto[]
  isOwner: boolean
  participants?: Participant[]
  onTaskUpdate?: () => void
}

function getPhaseLabel(phase: TaskGroupDto['phase']) {
  return phase === 'WEDDING_DAY' ? '婚礼当天安排' : '前期筹备'
}

export default function TaskList({
  taskGroups,
  isOwner,
  participants = [],
  onTaskUpdate,
}: TaskListProps) {
  const router = useRouter()

  const handleTaskUpdate = async (taskId: string, updates: UpdateTaskInput) => {
    try {
      await taskApi.update(taskId, updates)
      router.refresh()
      onTaskUpdate?.()
    } catch (error) {
      console.error('Failed to update task:', error)
      alert('更新任务失败')
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('确定要删除这个任务吗？')) {
      return
    }

    try {
      await taskApi.delete(taskId)
      router.refresh()
      onTaskUpdate?.()
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('删除任务失败')
    }
  }

  // 如果任务列表为空，显示空状态提示
  if (taskGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">还没有任务</h3>
        <p className="text-gray-500 mb-4">
          {isOwner
            ? '点击上方的"添加新任务"按钮开始添加筹备任务吧！'
            : '等待创建人添加筹备任务'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {(['PREPARATION', 'WEDDING_DAY'] as const).map((phase) => {
        const groups = taskGroups.filter((group) => group.phase === phase)
        if (groups.length === 0) {
          return null
        }

        return (
          <section key={phase} className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{getPhaseLabel(phase)}</h3>
            </div>

            {groups.map((group) => (
              <div key={group.key} className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{group.label}</h4>
                <div className="space-y-3">
                  {group.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isOwner={isOwner}
                      participants={participants}
                      onUpdate={(updates) => handleTaskUpdate(task.id, updates)}
                      onDelete={() => handleTaskDelete(task.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
