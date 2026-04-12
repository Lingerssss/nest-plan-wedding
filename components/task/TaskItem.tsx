'use client'

import { useState } from 'react'
import type { TaskDto, TaskPhase, TaskStatus, UpdateTaskInput } from '@/types/task'

function toDatetimeLocalValue(value: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (num: number) => String(num).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getPhaseLabel(phase: TaskPhase) {
  return phase === 'WEDDING_DAY' ? '婚礼当天' : '前期筹备'
}

interface Participant {
  id: string
  username: string
}

interface TaskItemProps {
  task: TaskDto
  isOwner: boolean
  participants?: Participant[]
  onUpdate: (updates: UpdateTaskInput) => void
  onDelete: () => void
}

export default function TaskItem({ task, isOwner, participants = [], onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [owner, setOwner] = useState(task.owner)
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId || '')
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [phase, setPhase] = useState<TaskPhase>(task.phase)
  const [timeFrame, setTimeFrame] = useState(task.timeFrame)
  const [scheduledAt, setScheduledAt] = useState(toDatetimeLocalValue(task.scheduledAt))

  const handleSave = () => {
    onUpdate({
      title,
      description: description || null,
      owner,
      assignedUserId: assignedUserId || null,
      status,
      phase,
      timeFrame,
      scheduledAt: phase === 'WEDDING_DAY' ? (scheduledAt || null) : null,
    })
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus)
    onUpdate({ status: newStatus })
  }

  const handleAssignedUserChange = (userId: string) => {
    setAssignedUserId(userId)
    onUpdate({ assignedUserId: userId || null })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '已完成'
      case 'IN_PROGRESS':
        return '进行中'
      default:
        return '待处理'
    }
  }

  if (isEditing && isOwner) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            placeholder="任务标题"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            placeholder="任务描述（可选）"
            rows={2}
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="负责人"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="PENDING">待处理</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as TaskPhase)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="PREPARATION">前期筹备</option>
              <option value="WEDDING_DAY">婚礼当天</option>
            </select>
            <input
              type="text"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={phase === 'WEDDING_DAY' ? '例如：接亲、返家、酒店准备' : '例如：3个月、1周'}
            />
            {participants.length > 0 && (
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">未分配</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username}
                  </option>
                ))}
              </select>
            )}
            {phase === 'WEDDING_DAY' && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setTitle(task.title)
                setDescription(task.description || '')
                setOwner(task.owner)
                setAssignedUserId(task.assignedUserId || '')
                setStatus(task.status)
                setPhase(task.phase)
                setTimeFrame(task.timeFrame)
                setScheduledAt(toDatetimeLocalValue(task.scheduledAt))
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>负责人：{task.owner}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {getPhaseLabel(task.phase)}
            </span>
            {task.phase === 'WEDDING_DAY' && task.scheduledAt && (
              <span>时间：{new Date(task.scheduledAt).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            )}
            {isOwner && participants.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-gray-600">分配给：</label>
                <select
                  value={assignedUserId}
                  onChange={(e) => handleAssignedUserChange(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  <option value="">未分配</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!isOwner && task.assignedUser && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                分配给：{task.assignedUser.username}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="PENDING">待处理</option>
                <option value="IN_PROGRESS">进行中</option>
                <option value="COMPLETED">已完成</option>
              </select>
              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    编辑
                  </button>
                  <button
                    onClick={onDelete}
                    className="px-3 py-1 text-sm text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    删除
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
