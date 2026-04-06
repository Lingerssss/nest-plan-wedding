# 🚀 部署步骤（按顺序执行）

## 步骤1：创建 PostgreSQL 数据库（必须先完成）

### 选项A：Vercel Postgres（推荐，最简单）

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com
   - 登录账号（可用 GitHub 登录）

2. **创建数据库**
   - 点击左侧 "Storage"
   - 点击 "Create Database"
   - 选择 "Postgres"
   - 选择区域（推荐：Hong Kong）
   - 点击 "Create"

3. **获取连接字符串**
   - 数据库创建后，点击数据库名称
   - 在 "Connection String" 部分
   - 点击 "Copy" 复制连接字符串
   - **保存这个字符串，稍后会用到**

### 选项B：Supabase（免费额度大）

1. **访问 Supabase**
   - 打开 https://supabase.com
   - 注册/登录账号

2. **创建项目**
   - 点击 "New Project"
   - 填写项目名称
   - 设置数据库密码（**记住这个密码**）
   - 选择区域（推荐：Southeast Asia）
   - 点击 "Create new project"

3. **获取连接字符串**
   - 等待项目创建完成（约2分钟）
   - 进入项目 → Settings → Database
   - 找到 "Connection string" → "URI"
   - 复制连接字符串（格式：`postgresql://postgres:[YOUR-PASSWORD]@...`）
   - **保存这个字符串**

## 步骤2：部署到 Vercel

### 方式A：使用 Vercel CLI（快速）

```bash
# 1. 登录 Vercel
vercel login

# 2. 在项目目录中部署
cd c:\Users\GongGod\JesseLab\wedding-tracker
vercel

# 3. 按提示操作：
#    - Set up and deploy? Y
#    - Which scope? 选择你的账号
#    - Link to existing project? N（首次部署）
#    - Project name? wedding-tracker（或自定义）
#    - Directory? ./
#    - Override settings? N

# 4. 添加环境变量
vercel env add DATABASE_URL
# 粘贴步骤1中复制的PostgreSQL连接字符串

vercel env add NODE_ENV production

# 5. 生产环境部署
vercel --prod
```

### 方式B：GitHub 集成（推荐，自动部署）

1. **推送代码到 GitHub**
   ```bash
   # 如果还没有GitHub仓库，先创建一个
   # 然后在项目目录执行：
   git add .
   git commit -m "Ready for Vercel deployment"
   git remote add origin https://github.com/your-username/wedding-tracker.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`
   - Build Command: `prisma generate && prisma migrate deploy && next build`（已配置）
   - Install Command: `npm install`（默认）

4. **添加环境变量**
   - 点击 "Environment Variables"
   - 添加：
     - `DATABASE_URL` = 步骤1中复制的PostgreSQL连接字符串
     - `NODE_ENV` = `production`
   - 确保两个环境都选中（Production, Preview, Development）

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约2-3分钟）

## 步骤3：验证部署

1. **查看部署状态**
   - 在 Vercel Dashboard 中查看构建日志
   - 确认 `prisma migrate deploy` 成功执行
   - 确认构建成功

2. **访问应用**
   - Vercel 会分配 URL：`your-project.vercel.app`
   - 点击 "Visit" 或直接访问

3. **测试功能**
   - ✅ 注册新用户
   - ✅ 登录
   - ✅ 创建婚礼
   - ✅ 查看短ID
   - ✅ 加入婚礼
   - ✅ 分配任务

## 如果遇到问题

### 构建失败
- 查看 Vercel 构建日志
- 确认 `DATABASE_URL` 环境变量已设置
- 确认 Prisma Schema provider 为 `postgresql`

### 数据库连接失败
- 检查连接字符串格式
- 确认数据库允许外部连接
- 检查 SSL 设置（可能需要添加 `?sslmode=require`）

### 迁移失败
- 查看构建日志中的错误信息
- 确认数据库是空的（首次部署）
- 或手动运行迁移：`DATABASE_URL="your-url" npx prisma migrate deploy`

## 部署成功后

✅ 应用将在 `https://your-project.vercel.app` 运行

接下来可以：
- 配置自定义域名
- 启用 Vercel Analytics
- 设置自动部署（GitHub 集成）
- 准备小程序前端开发
