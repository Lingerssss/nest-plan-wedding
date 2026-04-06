# 部署到 Vercel - 完整指南

## 🚀 快速开始（5分钟）

### 步骤1：更新数据库配置

**重要**：Vercel 不支持 SQLite，必须使用 PostgreSQL。

1. **编辑 `prisma/schema.prisma`**
   ```prisma
   datasource db {
     provider = "postgresql"  // 从 "sqlite" 改为 "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **创建 PostgreSQL 数据库**（选择一个）

   **选项A：Vercel Postgres（推荐）**
   - 登录 Vercel Dashboard
   - 创建项目后，点击 "Storage" → "Create Database" → "Postgres"
   - 复制连接字符串

   **选项B：Supabase（免费额度大）**
   - 访问 https://supabase.com
   - 创建项目 → Settings → Database
   - 复制连接字符串（格式：`postgresql://postgres:password@host:5432/postgres`）

   **选项C：Railway**
   - 访问 https://railway.app
   - 创建 PostgreSQL 服务
   - 复制连接字符串

### 步骤2：部署到 Vercel

#### 方法A：GitHub 集成（最简单）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **在 Vercel 部署**
   - 访问 https://vercel.com/new
   - 导入 GitHub 仓库
   - 配置环境变量：
     - `DATABASE_URL`: 你的 PostgreSQL 连接字符串
     - `NODE_ENV`: `production`
   - 点击 "Deploy"

3. **等待部署完成**
   - Vercel 会自动运行 `prisma generate` 和 `prisma migrate deploy`
   - 查看构建日志确认成功

#### 方法B：Vercel CLI

```bash
# 安装 CLI
npm i -g vercel

# 登录
vercel login

# 首次部署（会提示配置）
vercel

# 添加环境变量
vercel env add DATABASE_URL
vercel env add NODE_ENV production

# 生产环境部署
vercel --prod
```

### 步骤3：验证部署

1. **访问部署的 URL**
   - Vercel 会分配：`your-project.vercel.app`
   - 可以在 Dashboard 中查看

2. **测试功能**
   - ✅ 注册新用户
   - ✅ 登录
   - ✅ 创建婚礼
   - ✅ 查看短ID
   - ✅ 加入婚礼
   - ✅ 分配任务

## 📋 当前配置状态

### ✅ 已配置
- `vercel.json` - 构建命令和区域（香港 hkg1）
- `package.json` - 构建脚本（`vercel-build`）
- 环境变量示例文件（`.env.production.example`）

### ⚠️ 需要手动完成
1. 更新 `prisma/schema.prisma` 的 provider
2. 创建 PostgreSQL 数据库
3. 配置 `DATABASE_URL` 环境变量

## 🔧 配置说明

### vercel.json
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"]  // 香港区域，适合中国用户
}
```

### package.json 脚本
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

## 🗄️ 数据库迁移

### 从 SQLite 迁移到 PostgreSQL

**方法1：重新开始（推荐，如果数据不重要）**
```bash
# 1. 更新 schema.prisma provider
# 2. 设置 DATABASE_URL
# 3. 运行迁移
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
```

**方法2：数据迁移（如果已有重要数据）**
```bash
# 1. 导出 SQLite 数据
sqlite3 prisma/dev.db .dump > data.sql

# 2. 转换为 PostgreSQL 格式（需要手动调整）
# - 移除 SQLite 特定语法
# - 调整数据类型
# - 调整索引语法

# 3. 导入到 PostgreSQL
psql -h host -U user -d database -f data.sql
```

## 🐛 常见问题

### 1. 构建失败：Prisma 错误
**原因**：Schema provider 未更新或 DATABASE_URL 未配置
**解决**：
- 确认 `prisma/schema.prisma` 中 `provider = "postgresql"`
- 确认 Vercel 环境变量中设置了 `DATABASE_URL`

### 2. 迁移失败：表已存在
**原因**：数据库已有表结构
**解决**：
```bash
# 重置数据库（⚠️ 会删除所有数据）
DATABASE_URL="your-url" npx prisma migrate reset

# 或手动删除表后重新迁移
```

### 3. 连接失败：SSL 错误
**原因**：PostgreSQL 需要 SSL 连接
**解决**：在 DATABASE_URL 中添加 `?sslmode=require`
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### 4. 区域选择
**当前配置**：`regions: ["hkg1"]`（香港）
**其他选项**：
- `sin1` - 新加坡
- `sfo1` - 旧金山
- `iad1` - 华盛顿

## 📊 免费额度

### Vercel
- ✅ 100GB 带宽/月
- ✅ 6000 分钟构建时间/月
- ✅ 无限项目

### Vercel Postgres
- ✅ 256MB 存储
- ✅ 60小时计算时间/月

### Supabase
- ✅ 500MB 数据库存储
- ✅ 2GB 带宽/月

**对于个人项目，免费额度通常足够使用。**

## 📚 参考文档

- [Vercel 部署文档](https://vercel.com/docs)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
- [Next.js 部署](https://nextjs.org/docs/deployment)

## 🎯 下一步

部署成功后：
1. ✅ 配置自定义域名（可选）
2. ✅ 启用 Vercel Analytics
3. ✅ 设置自动部署（GitHub 集成）
4. ✅ 准备小程序前端开发
