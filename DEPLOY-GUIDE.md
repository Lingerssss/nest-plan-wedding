# 🚀 Vercel 部署完整指南

## ⚠️ 重要：部署前必须先创建 PostgreSQL 数据库

Vercel 不支持 SQLite，必须使用 PostgreSQL。

## 📋 部署流程（3步）

### 步骤1：创建 PostgreSQL 数据库（必须）

#### 推荐：Vercel Postgres

1. **访问 Vercel Dashboard**
   ```
   https://vercel.com
   ```

2. **创建数据库**
   - 登录后，点击左侧 "Storage"
   - 点击 "Create Database"
   - 选择 "Postgres"
   - 选择区域：**Hong Kong (hkg1)**（适合中国用户）
   - 点击 "Create"

3. **复制连接字符串**
   - 数据库创建后，点击数据库名称进入详情页
   - 找到 "Connection String" 部分
   - 点击 "Copy" 复制
   - **格式类似**：`postgres://default:xxx@xxx.hkg1.postgres.vercel-storage.com:5432/verceldb`
   - **保存这个字符串！**

#### 备选：Supabase（免费额度更大）

1. 访问 https://supabase.com
2. 创建新项目
3. Settings → Database → Connection string → URI
4. 复制连接字符串

---

### 步骤2：部署到 Vercel

#### 选项A：Vercel CLI（快速）

```powershell
# 1. 登录 Vercel（会打开浏览器）
cd c:\Users\GongGod\JesseLab\wedding-tracker
vercel login

# 2. 首次部署（会提示配置）
vercel

# 按提示操作：
# - Set up and deploy? → 输入 Y
# - Which scope? → 选择你的账号
# - Link to existing project? → 输入 N（首次）
# - Project name? → 输入 wedding-tracker（或自定义）
# - Directory? → 输入 ./
# - Override settings? → 输入 N

# 3. 添加环境变量
vercel env add DATABASE_URL
# 粘贴步骤1中复制的PostgreSQL连接字符串

vercel env add NODE_ENV production

# 4. 生产环境部署
vercel --prod
```

#### 选项B：GitHub 集成（推荐，自动部署）

**如果代码已在 GitHub：**

1. **访问 Vercel**
   ```
   https://vercel.com/new
   ```

2. **导入项目**
   - 点击 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework: Next.js（自动检测）
   - Root Directory: `./`
   - Build Command: `prisma generate && prisma migrate deploy && next build`（已配置）
   - Install Command: `npm install`

4. **添加环境变量**
   - 点击 "Environment Variables"
   - 添加：
     ```
     DATABASE_URL = 你的PostgreSQL连接字符串
     NODE_ENV = production
     ```
   - 确保三个环境都选中：Production, Preview, Development

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约2-3分钟）

**如果代码未在 GitHub：**

```bash
# 1. 在 GitHub 创建新仓库
# 访问 https://github.com/new

# 2. 推送代码
cd c:\Users\GongGod\JesseLab\wedding-tracker
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/your-username/wedding-tracker.git
git push -u origin main

# 3. 然后按照上面的步骤2操作
```

---

### 步骤3：验证部署

1. **查看部署状态**
   - 在 Vercel Dashboard 查看构建日志
   - 确认以下步骤成功：
     - ✅ `prisma generate` - Prisma 客户端生成
     - ✅ `prisma migrate deploy` - 数据库迁移
     - ✅ `next build` - Next.js 构建

2. **访问应用**
   - Vercel 分配的 URL：`https://your-project.vercel.app`
   - 点击 "Visit" 或直接访问

3. **测试功能**
   - ✅ 注册新用户
   - ✅ 登录
   - ✅ 创建婚礼
   - ✅ 查看短ID（6位数字）
   - ✅ 加入婚礼
   - ✅ 分配任务

## 🐛 常见问题

### Q1: 构建失败 - Prisma 错误
**原因**：DATABASE_URL 未设置或 Schema provider 错误
**解决**：
- 确认环境变量中设置了 `DATABASE_URL`
- 确认 `prisma/schema.prisma` 中 `provider = "postgresql"`

### Q2: 数据库连接失败
**原因**：连接字符串格式错误或数据库不允许外部连接
**解决**：
- 检查连接字符串格式
- 确认数据库允许外部连接（Vercel Postgres 默认允许）
- 如果使用 Supabase，检查 IP 白名单设置

### Q3: 迁移失败 - 表已存在
**原因**：数据库已有表结构
**解决**：
```bash
# 重置数据库（⚠️ 会删除所有数据）
DATABASE_URL="your-url" npx prisma migrate reset

# 或手动删除表后重新部署
```

### Q4: SSL 连接错误
**解决**：在连接字符串末尾添加 `?sslmode=require`
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## ✅ 部署检查清单

- [ ] PostgreSQL 数据库已创建
- [ ] 数据库连接字符串已复制
- [ ] Prisma Schema provider 已更新为 `postgresql`
- [ ] Vercel 账号已登录
- [ ] 环境变量 `DATABASE_URL` 已配置
- [ ] 环境变量 `NODE_ENV=production` 已配置
- [ ] 构建日志显示成功
- [ ] 应用可以正常访问
- [ ] 功能测试通过

## 🎉 部署成功后

你的应用将在 `https://your-project.vercel.app` 运行！

**下一步：**
- 配置自定义域名（可选）
- 启用 Vercel Analytics
- 设置自动部署（GitHub 集成）
- 准备小程序前端开发

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel Dashboard 的构建日志
2. 检查环境变量配置
3. 确认数据库连接正常
4. 参考详细文档：`VERCEL-DEPLOYMENT.md`
