# 🚀 立即部署到 Vercel

## ✅ 已完成

1. ✅ Prisma Schema 已更新为 PostgreSQL
2. ✅ Vercel 配置文件已就绪
3. ✅ 构建脚本已配置
4. ✅ 部署文档已创建

## 📋 接下来需要做的（3步）

### 步骤1：创建 PostgreSQL 数据库（2分钟）

选择一个服务：

**选项A：Vercel Postgres（最简单）**
1. 访问 https://vercel.com
2. 登录账号
3. 创建新项目（或使用现有项目）
4. 点击 "Storage" → "Create Database" → "Postgres"
5. 创建后，复制连接字符串（格式：`postgres://default:xxx@xxx.region.postgres.vercel-storage.com:5432/verceldb`）

**选项B：Supabase（免费额度大）**
1. 访问 https://supabase.com
2. 创建新项目
3. Settings → Database → Connection string
4. 复制连接字符串

### 步骤2：部署到 Vercel（2分钟）

#### 方式A：GitHub 集成（推荐）

```bash
# 1. 提交代码
git add .
git commit -m "Ready for Vercel deployment"
git push

# 2. 在 Vercel 部署
# - 访问 https://vercel.com/new
# - 导入 GitHub 仓库
# - 添加环境变量：
#   DATABASE_URL = 你的PostgreSQL连接字符串
#   NODE_ENV = production
# - 点击 Deploy
```

#### 方式B：Vercel CLI

```bash
# 安装并登录
npm i -g vercel
vercel login

# 部署
vercel

# 添加环境变量
vercel env add DATABASE_URL
# 粘贴你的PostgreSQL连接字符串

vercel env add NODE_ENV production

# 生产环境部署
vercel --prod
```

### 步骤3：验证部署（1分钟）

1. 访问 Vercel 分配的 URL（如：`your-project.vercel.app`）
2. 测试功能：
   - 注册新用户
   - 创建婚礼
   - 查看短ID
   - 加入婚礼

## ⚠️ 重要提示

1. **数据库连接字符串格式**
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```
   或
   ```
   postgres://user:password@host:port/database?sslmode=require
   ```

2. **首次部署会自动运行迁移**
   - Vercel 会执行 `prisma migrate deploy`
   - 查看构建日志确认成功

3. **如果迁移失败**
   - 检查 DATABASE_URL 是否正确
   - 确认数据库允许外部连接
   - 查看 Vercel 构建日志

## 📚 参考文档

- 详细部署指南：`VERCEL-DEPLOYMENT.md`
- 快速开始：`QUICK-START-VERCEL.md`
- 检查清单：`DEPLOY-CHECKLIST.md`

## 🎉 部署成功后

你的应用将在 `https://your-project.vercel.app` 运行！

接下来可以：
- 配置自定义域名
- 启用 Analytics
- 准备小程序前端开发
