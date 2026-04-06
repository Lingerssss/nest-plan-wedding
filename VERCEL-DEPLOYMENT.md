# Vercel 部署指南

## 重要提示

⚠️ **数据库迁移**：Vercel 的文件系统是只读的，**不能使用 SQLite**。需要迁移到 PostgreSQL。

## 部署前准备

### 1. 数据库选择

**选项A：Vercel Postgres（推荐）**
- 免费额度：256MB 存储，60小时计算时间/月
- 与 Vercel 集成，配置简单
- 自动备份

**选项B：外部 PostgreSQL 服务**
- Supabase（免费额度：500MB）
- Railway（免费额度：5GB）
- Neon（免费额度：3GB）
- 或其他 PostgreSQL 服务

### 2. 更新 Prisma Schema

需要将 `provider` 从 `sqlite` 改为 `postgresql`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. 环境变量配置

在 Vercel 项目设置中配置以下环境变量：

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NODE_ENV=production
```

## 部署步骤

### 步骤1：准备数据库

#### 如果使用 Vercel Postgres：
1. 在 Vercel Dashboard 中创建 Postgres 数据库
2. 复制连接字符串
3. 添加到环境变量 `DATABASE_URL`

#### 如果使用外部 PostgreSQL：
1. 创建 PostgreSQL 数据库
2. 获取连接字符串
3. 添加到环境变量 `DATABASE_URL`

### 步骤2：更新 Prisma Schema

修改 `prisma/schema.prisma`：
- 将 `provider = "sqlite"` 改为 `provider = "postgresql"`

### 步骤3：运行数据库迁移

```bash
# 本地测试（使用生产数据库URL）
DATABASE_URL="your-postgres-url" npx prisma migrate deploy

# 或者使用 Prisma Studio 查看数据
DATABASE_URL="your-postgres-url" npx prisma studio
```

### 步骤4：部署到 Vercel

#### 方法A：通过 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 方法B：通过 GitHub 集成

1. 将代码推送到 GitHub
2. 在 Vercel Dashboard 中导入项目
3. 配置环境变量
4. 自动部署

### 步骤5：配置构建命令

Vercel 会自动检测 Next.js 项目，但需要确保 Prisma 正确生成：

在 `package.json` 中添加：

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

或者在 `vercel.json` 中配置（已存在）：

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

## 当前 vercel.json 配置

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

✅ 配置已正确，支持：
- Prisma 客户端生成
- 数据库迁移
- Next.js 构建
- 香港区域（适合中国用户）

## 部署后检查清单

- [ ] 数据库连接正常
- [ ] API 路由正常工作
- [ ] 认证功能正常
- [ ] 可以创建婚礼
- [ ] 可以加入婚礼
- [ ] 任务分配功能正常

## 常见问题

### 1. 数据库连接失败
- 检查 `DATABASE_URL` 环境变量是否正确
- 确认数据库允许外部连接（IP白名单）
- 检查 SSL 连接设置

### 2. Prisma 迁移失败
- 确保 `prisma migrate deploy` 在构建时运行
- 检查迁移文件是否正确
- 查看 Vercel 构建日志

### 3. 环境变量未生效
- 在 Vercel Dashboard 中重新设置环境变量
- 重新部署项目
- 检查环境变量名称是否正确

## 免费额度说明

### Vercel
- 带宽：100GB/月
- 构建时间：6000分钟/月
- 函数执行：100GB-小时/月

### Vercel Postgres
- 存储：256MB
- 计算时间：60小时/月
- 连接数：有限制

对于个人项目，免费额度通常足够使用。

## 下一步

部署完成后，可以考虑：
1. 配置自定义域名
2. 设置自动部署（GitHub集成）
3. 配置监控和日志
4. 优化性能（CDN、缓存等）
