import { prisma } from './db'

/**
 * 生成一个唯一的6位短ID（纯数字）
 * 格式：6位数字，范围 100000-999999（共90万个可能值）
 * 
 * 唯一性保证：
 * 1. 使用加密安全的随机数生成器
 * 2. 检查数据库中是否已存在
 * 3. 如果存在，重试（最多1000次）
 * 4. 碰撞概率：当有10万个婚礼时，单次碰撞概率约11%，100次重试后失败概率 < 0.0001%
 */

const MIN_ID = 100000 // 最小6位数
const MAX_ID = 999999 // 最大6位数
const MAX_ATTEMPTS = 1000 // 最大重试次数

/**
 * 生成一个随机的6位数字ID
 * 使用加密安全的随机数生成器（如果可用）
 */
function generateShortId(): string {
  // 使用 crypto.getRandomValues 获得更好的随机性（如果可用）
  let randomNum: number
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // 浏览器或Node.js环境，使用加密安全的随机数
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    // 将32位随机数映射到 100000-999999 范围
    randomNum = MIN_ID + (array[0] % (MAX_ID - MIN_ID + 1))
  } else {
    // 降级到 Math.random（不太安全，但对于婚礼ID足够）
    randomNum = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID
  }
  
  return randomNum.toString().padStart(6, '0')
}

/**
 * 生成一个唯一的短ID（确保数据库中不存在）
 * 
 * 算法说明：
 * - 6位数字提供90万个可能的ID
 * - 当有10万个婚礼时，单次碰撞概率约11%
 * - 通过重试机制，100次重试后失败概率 < 0.0001%
 * - 1000次重试后失败概率 < 10^-10（几乎不可能）
 */
export async function generateUniqueShortId(): Promise<string> {
  let attempts = 0
  const usedIds = new Set<string>() // 本地缓存，避免重复查询

  while (attempts < MAX_ATTEMPTS) {
    const shortId = generateShortId()
    
    // 先检查本地缓存
    if (usedIds.has(shortId)) {
      attempts++
      continue
    }
    
    // 检查数据库中是否已存在
    const existing = await prisma.wedding.findUnique({
      where: { shortId },
      select: { shortId: true }, // 只查询shortId字段，提高性能
    })

    if (!existing) {
      return shortId
    }

    // 记录已使用的ID到缓存
    usedIds.add(shortId)
    attempts++
  }

  // 如果达到最大重试次数，检查是否真的用完了所有ID
  const count = await prisma.wedding.count()
  if (count >= (MAX_ID - MIN_ID + 1)) {
    throw new Error(
      `所有可用的6位数字ID都已使用（共${MAX_ID - MIN_ID + 1}个）。` +
      `当前有${count}个婚礼。请考虑使用更长的ID。`
    )
  }

  // 如果1000次尝试都失败，抛出错误
  throw new Error(
    `生成唯一ID失败：已尝试${MAX_ATTEMPTS}次。` +
    `当前数据库中有${count}个婚礼。` +
    `这可能是由于随机数生成器的问题，请重试。`
  )
}
