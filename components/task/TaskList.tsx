'use client'

import { useEffect, useState } from 'react'
import { taskApi } from '@/lib/api'
import type { TaskDto, TaskGroupDto, UpdateTaskInput } from '@/types/task'
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

function groupTasksForDisplay(tasks: TaskDto[]): TaskGroupDto[] {
  const grouped = new Map<string, TaskGroupDto>()

  for (const task of tasks) {
    const key = `${task.phase}:${task.timeFrame}`
    const existing = grouped.get(key)

    if (existing) {
      existing.tasks.push(task)
      continue
    }

    grouped.set(key, {
      key,
      label: task.timeFrame,
      phase: task.phase,
      tasks: [task],
    })
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      tasks: [...group.tasks].sort((a, b) => {
        const aTime = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
        const bTime = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
        return a.sortOrder - b.sortOrder || aTime - bTime || a.createdAt.localeCompare(b.createdAt)
      }),
    }))
    .sort((a, b) => {
      const phaseCompare = a.phase.localeCompare(b.phase)
      if (phaseCompare !== 0) {
        return phaseCompare
      }

      return a.tasks[0].sortOrder - b.tasks[0].sortOrder
    })
}

function flattenTaskGroups(taskGroups: TaskGroupDto[]) {
  return taskGroups.flatMap((group) => group.tasks)
}

export default function TaskList({
  taskGroups,
  isOwner,
  participants = [],
  onTaskUpdate,
}: TaskListProps) {
  const [localTaskGroups, setLocalTaskGroups] = useState(taskGroups)

  useEffect(() => {
    setLocalTaskGroups(taskGroups)
  }, [taskGroups])

  const getParticipantById = (userId: string | null | undefined) => {
    if (!userId) {
      return null
    }

    const participant = participants.find((item) => item.id === userId)
    return participant
      ? {
          id: participant.id,
          username: participant.username,
        }
      : null
  }

  const applyOptimisticTaskUpdate = (currentTaskGroups: TaskGroupDto[], taskId: string, updates: UpdateTaskInput) => {
    const nextTasks = flattenTaskGroups(currentTaskGroups).map((task) => {
      if (task.id !== taskId) {
        return task
      }

      const nextAssignedUser = updates.assignedUserId === undefined
        ? task.assignedUser
        : getParticipantById(updates.assignedUserId)

      return {
        ...task,
        ...updates,
        assignedUserId: updates.assignedUserId === undefined ? task.assignedUserId : updates.assignedUserId,
        assignedUser: nextAssignedUser,
        updatedAt: new Date().toISOString(),
      }
    })

    return groupTasksForDisplay(nextTasks)
  }

  const applyConfirmedTaskUpdate = (currentTaskGroups: TaskGroupDto[], updatedTask: TaskDto) => {
    const nextTasks = flattenTaskGroups(currentTaskGroups).map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    )

    return groupTasksForDisplay(nextTasks)
  }

  const handleTaskUpdate = async (taskId: string, updates: UpdateTaskInput) => {
    const previousTaskGroups = localTaskGroups
    setLocalTaskGroups(applyOptimisticTaskUpdate(localTaskGroups, taskId, updates))

    try {
      const { task } = await taskApi.update(taskId, updates)
      setLocalTaskGroups((currentTaskGroups) => applyConfirmedTaskUpdate(currentTaskGroups, task))
      onTaskUpdate?.()
    } catch (error) {
      setLocalTaskGroups(previousTaskGroups)
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
      setLocalTaskGroups((currentTaskGroups) =>
        groupTasksForDisplay(
          flattenTaskGroups(currentTaskGroups).filter((task) => task.id !== taskId)
        )
      )
      onTaskUpdate?.()
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('删除任务失败')
    }
  }

  // 如果任务列表为空，显示空状态提示
  if (localTaskGroups.length === 0) {
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
        const groups = localTaskGroups.filter((group) => group.phase === phase)
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
                      key={`${task.id}:${task.updatedAt}`}
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
