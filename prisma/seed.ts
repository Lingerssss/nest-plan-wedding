import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { buildTaskTemplatePayloads } from '../lib/weddingTemplates'

const prisma = new PrismaClient()

async function main() {
  // 创建示例用户
  const passwordHash = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      displayName: '测试用户',
      email: 'test@example.com',
      passwordHash,
    },
  })

  console.log('Created user:', user1.username)

  // 创建示例婚礼
  const weddingDate = new Date('2026-05-02T00:00:00+08:00')

  const wedding = await prisma.wedding.upsert({
    where: { shortId: '374176' },
    update: {
      name: '示例婚礼',
      weddingDate,
      createdById: user1.id,
    },
    create: {
      shortId: '374176',
      name: '示例婚礼',
      weddingDate,
      createdById: user1.id,
      participants: {
        create: {
          userId: user1.id,
          role: 'OWNER',
        },
      },
    },
  })

  const taskPayloads = buildTaskTemplatePayloads(weddingDate)

  await prisma.task.deleteMany({
    where: { weddingId: wedding.id },
  })

  await prisma.task.createMany({
    data: taskPayloads.map((task, index) => ({
      weddingId: wedding.id,
      ...task,
      status:
        index === 0 ? 'IN_PROGRESS' :
        index === 1 ? 'COMPLETED' :
        index === 2 ? 'COMPLETED' :
        task.status,
      owner:
        index === 1 ? '巩' :
        index === 2 ? '陆' :
        task.owner,
    })),
  })

  console.log('Created wedding:', wedding.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  