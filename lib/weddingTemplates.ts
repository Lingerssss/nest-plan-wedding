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
    title: '新娘开始化妆',
    description: '新娘开始化妆，进入婚礼当天妆造流程',
    owner: '新娘',
    timeFrame: '新娘妆造',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 110,
    scheduledTime: '04:00',
  },
  {
    title: '新郎起床洗漱',
    description: '新郎起床洗漱，开始婚礼当天准备',
    owner: '新郎',
    timeFrame: '新郎筹备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 120,
    scheduledTime: '05:20',
  },
  {
    title: '摄影老师开始拍照',
    description: '摄影老师到位并开始拍摄新娘晨间准备画面',
    owner: '摄影',
    timeFrame: '新娘妆造',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 130,
    scheduledTime: '06:00',
  },
  {
    title: '伴郎到场',
    description: '两位伴郎到场，与新郎汇合准备接亲流程',
    owner: '伴郎',
    timeFrame: '新郎筹备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 140,
    scheduledTime: '06:20',
  },
  {
    title: '摄像老师到达',
    description: '摄像老师到场，准备记录新郎侧流程',
    owner: '摄像',
    timeFrame: '新郎筹备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 150,
    scheduledTime: '06:20',
  },
  {
    title: '乐队到场',
    description: '乐队到场并完成现场准备',
    owner: '乐队',
    timeFrame: '新郎筹备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 160,
    scheduledTime: '06:30',
  },
  {
    title: '婚车到达',
    description: '婚车到场，确认车队准备完毕',
    owner: '婚车',
    timeFrame: '新郎筹备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 170,
    scheduledTime: '06:50',
  },
  {
    title: '新郎出发接亲',
    description: '新郎带队出发前往接亲地点',
    owner: '新郎',
    timeFrame: '接亲',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 180,
    scheduledTime: '07:20',
  },
  {
    title: '新娘坐床等待接亲',
    description: '新娘坐在床上等待新郎到来，准备接亲环节',
    owner: '新娘',
    timeFrame: '接亲',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 190,
    scheduledTime: '07:40',
  },
  {
    title: '新郎到达酒店接亲',
    description: '新郎抵达酒店，准备正式开始接亲',
    owner: '新郎',
    timeFrame: '接亲',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 200,
    scheduledTime: '07:50',
  },
  {
    title: '开始接亲、堵门、游戏和拍照',
    description: '新郎进门接亲，完成堵门、互动游戏和合影拍摄',
    owner: '一起',
    timeFrame: '接亲',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 210,
    scheduledTime: '08:00',
  },
  {
    title: '接亲结束返回新郎家',
    description: '接亲结束后上车返回新郎家',
    owner: '一起',
    timeFrame: '返家',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 220,
    scheduledTime: '09:15',
  },
  {
    title: '新人进家门、入洞房、吃东西',
    description: '新人回到新郎家，完成入门流程并补充体力',
    owner: '一起',
    timeFrame: '返家',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 230,
    scheduledTime: '09:45',
  },
  {
    title: '新人出发前往酒店',
    description: '新人从家中出发前往云尚华锦婚礼艺术中心景西路店',
    owner: '一起',
    timeFrame: '酒店准备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 240,
    scheduledTime: '10:30',
  },
  {
    title: '到达酒店换主纱并调试设备',
    description: '新人到达酒店后新娘换主纱，新郎调试典礼设备',
    owner: '一起',
    timeFrame: '酒店准备',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 250,
    scheduledTime: '10:45',
  },
  {
    title: '婚礼典礼开始',
    description: '典礼正式开始，按照既定流程推进仪式',
    owner: '一起',
    timeFrame: '典礼',
    status: 'PENDING',
    phase: 'WEDDING_DAY',
    sortOrder: 260,
    scheduledTime: '12:00',
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
