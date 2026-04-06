# Vercel 快速部署指南

## 5分钟快速部署

### 前置条件
- ✅ GitHub 账号
- ✅ Vercel 账号（可用 GitHub 登录）
- ✅ PostgreSQL 数据库（推荐 Vercel Postgres）

### 步骤1：准备数据库（2分钟）

#### 选项A：使用 Vercel Postgres（最简单）
1. 登录 Vercel Dashboard
2. 创建新项目或进入现有项目
3. 点击 "Storage" → "Create Database" → "Postgres"
4. 创建后复制连接字符串

#### 选项B：使用 Supabase（免费额度大）
1. 访问 https://supabase.com
2. 创建新项目
3. 在 Settings → Database 复制连接字符串

### 步骤2：更新代码（1分钟）

```bash
# 1. 更新 Prisma Schema
# 编辑 prisma/schema.prisma，将：
provider = "sqlite"
# 改为：
provider = "postgresql"

# 2. 提交更改
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 步骤3：部署到 Vercel（2分钟）

#### 方法A：GitHub 集成（推荐）
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 配置项目：
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `prisma generate && prisma migrate deploy && next build`（已配置）
   - Install Command: `npm install`（默认）
4. 添加环境变量：
   - `DATABASE_URL`: 你的 PostgreSQL 连接字符串
   - `NODE_ENV`: `production`
5. 点击 "Deploy"

#### 方法B：Vercel CLI
```bash
# 安装 CLI
npm i -g vercel

# 登录
vercel login

# 部署（首次会提示配置）
vercel

# 配置环境变量
vercel env add DATABASE_URL
vercel env add NODE_ENV

# 生产环境部署
vercel --prod
```

### 步骤4：运行数据库迁移

部署完成后，在 Vercel Dashboard：
1. 进入项目 → "Deployments"
2. 点击最新的部署
3. 查看 "Build Logs"
4. 确认 `prisma migrate deploy` 成功执行

如果迁移失败，可以手动运行：
```bash
# 使用 Vercel CLI
vercel env pull .env.local
DATABASE_URL="your-url" npx prisma migrate deploy
```

## 验证部署

1. **访问部署的 URL**
   - Vercel 会自动分配：`your-project.vercel.app`
   - 可以在 Dashboard 中查看

2. **测试功能**
   - ✅ 注册新用户
   - ✅ 登录
   - ✅ 创建婚礼
   - ✅ 加入婚礼（使用短ID）
   - ✅ 分配任务

## 当前配置状态

✅ **已配置：**
- `vercel.json` - 构建命令和区域配置
- `package.json` - 构建脚本
- 香港区域（hkg1）- 适合中国用户

⚠️ **需要手动配置：**
- Prisma Schema provider（sqlite → postgresql）
- DATABASE_URL 环境变量
- 数据库迁移

## 常见问题

### Q: SQLite 数据如何迁移到 PostgreSQL？
A: 可以使用 Prisma 的数据迁移工具或手动导出/导入：
```bash
# 导出 SQLite 数据
sqlite3 prisma/dev.db .dump > data.sql

# 转换为 PostgreSQL 格式后导入
# （需要手动调整 SQL 语法差异）
```

### Q: 部署后数据库迁移失败？
A: 检查：
1. DATABASE_URL 是否正确
2. 数据库是否允许外部连接
3. 迁移文件是否正确

### Q: 如何回滚到之前的版本？
A: 在 Vercel Dashboard → Deployments → 选择之前的版本 → "Promote to Production"

## 下一步

部署成功后：
1. 配置自定义域名（可选）
2. 启用 Vercel Analytics
3. 配置自动部署（GitHub 集成）
4. 准备小程序前端开发

## 参考文档

- [Vercel 部署文档](https://vercel.com/docs)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
