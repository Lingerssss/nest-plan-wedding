export type TaskPhase = 'PREPARATION' | 'WEDDING_DAY'

// 婚礼任务模板
export interface TaskTemplate {
  title: string
  description?: string
  owner: string
  timeFrame: string
  status?: string
  phase: TaskPhase
  sortOrder: number
  scheduledTime?: string
}

const preparationTaskTemplates: TaskTemplate[] = [
  {
    title: '确定婚礼宾客',
    description: '确定邀请的宾客名单',
    owner: '一起',
    timeFrame: '5个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 10,
  },
  {
    title: '确定婚礼地点',
    description: '选择并预订婚礼场地',
    owner: '一起',
    timeFrame: '5个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 20,
  },
  {
    title: '买婚戒',
    description: '选购结婚戒指',
    owner: '一起',
    timeFrame: '5个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 30,
  },
  {
    title: '预订婚纱摄影',
    description: '选择并预订婚纱摄影服务',
    owner: '一起',
    timeFrame: '3个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 40,
  },
  {
    title: '确定婚礼主题和风格',
    description: '确定婚礼的整体风格和主题',
    owner: '一起',
    timeFrame: '3个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 50,
  },
  {
    title: '预订酒店/餐厅',
    description: '预订婚宴场地',
    owner: '一起',
    timeFrame: '3个月',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 60,
  },
  {
    title: '选购婚纱和礼服',
    description: '选购新娘婚纱和新郎礼服',
    owner: '一起',
    timeFrame: '3周',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 70,
  },
  {
    title: '发送请柬',
    description: '制作并发送婚礼请柬',
    owner: '一起',
    timeFrame: '3周',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 80,
  },
  {
    title: '确认最终宾客人数',
    description: '确认最终参加婚礼的宾客人数',
    owner: '一起',
    timeFrame: '1周',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 90,
  },
  {
    title: '准备婚礼用品',
    description: '准备婚礼当天需要的各种用品',
    owner: '一起',
    timeFrame: '1周',
    status: 'PENDING',
    phase: 'PREPARATION',
    sortOrder: 100,
  },
]

const weddingDayTaskTemplates: TaskTemplate[] = [
  {
    title: '确认妆造与摄影团队到位',
    description: '检查化妆、摄影、摄像团队是否按时到场',
    owner: '一起',
    timeFrame: '清晨',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 110,
    scheduledTime: '06:30',
  },
  {
    title: '清点戒指与誓词卡',
    description: '确认婚戒、誓词卡与证件已准备完成',
    owner: '一起',
    timeFrame: '清晨',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 120,
    scheduledTime: '07:00',
  },
  {
    title: '接亲流程准备',
    description: '确认车队、伴郎伴娘和堵门环节安排',
    owner: '一起',
    timeFrame: '接亲',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 130,
    scheduledTime: '08:30',
  },
  {
    title: '仪式彩排与主持确认',
    description: '确认音乐、走位、主持串场词与流程时间',
    owner: '一起',
    timeFrame: '仪式',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 140,
    scheduledTime: '10:30',
  },
  {
    title: '宴席座位与签到核对',
    description: '确认签到台、座位表和来宾引导安排',
    owner: '一起',
    timeFrame: '宴席',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 150,
    scheduledTime: '12:00',
  },
  {
    title: '收尾物品清点',
    description: '清点礼金、礼服、装饰物和重要随身物品',
    owner: '一起',
    timeFrame: '收尾',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 160,
    scheduledTime: '21:00',
  },
]

function combineWeddingDateAndTime(weddingDate: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const scheduledAt = new Date(weddingDate)
  scheduledAt.setHours(hours, minutes, 0, 0)
  return scheduledAt
}

export function buildDefaultTaskTemplates(): TaskTemplate[] {
  return [...preparationTaskTemplates, ...weddingDayTaskTemplates]
}

export function buildTaskTemplatePayloads(weddingDate: Date) {
  return buildDefaultTaskTemplates().map((template) => ({
    title: template.title,
    description: template.description || null,
    owner: template.owner,
    status: template.status || 'PENDING',
    timeFrame: template.timeFrame,
    phase: template.phase,
    sortOrder: template.sortOrder,
    scheduledAt: template.scheduledTime
      ? combineWeddingDateAndTime(weddingDate, template.scheduledTime)
      : null,
  }))
}
