# Vercel 部署检查清单

## 部署前准备

### ✅ 代码准备
- [ ] 确保所有代码已提交到 Git
- [ ] 检查 `.gitignore` 已包含敏感文件
- [ ] 确认 `vercel.json` 配置正确
- [ ] 检查 `package.json` 中的脚本命令

### ✅ 数据库准备
- [ ] 选择 PostgreSQL 服务（Vercel Postgres / Supabase / Railway / Neon）
- [ ] 创建 PostgreSQL 数据库
- [ ] 获取数据库连接字符串
- [ ] 更新 `prisma/schema.prisma` 的 `provider` 为 `postgresql`
- [ ] 本地测试数据库连接

### ✅ 环境变量准备
- [ ] 准备生产环境 `DATABASE_URL`
- [ ] 确认 `NODE_ENV=production`
- [ ] 检查是否需要其他环境变量

## 部署步骤

### 步骤1：更新 Prisma Schema
```bash
# 备份当前 schema
cp prisma/schema.prisma prisma/schema.sqlite.prisma

# 更新 provider
# 将 provider = "sqlite" 改为 provider = "postgresql"
```

### 步骤2：运行数据库迁移（本地测试）
```bash
# 使用生产数据库URL测试
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
DATABASE_URL="your-postgres-url" npx prisma generate
```

### 步骤3：部署到 Vercel

#### 选项A：使用 Vercel CLI
```bash
# 安装 CLI
npm i -g vercel

# 登录
vercel login

# 首次部署（会提示配置）
vercel

# 生产环境部署
vercel --prod
```

#### 选项B：使用 GitHub 集成
1. 推送代码到 GitHub
2. 访问 https://vercel.com
3. 点击 "Add New Project"
4. 导入 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy"

### 步骤4：配置环境变量
在 Vercel Dashboard → Project Settings → Environment Variables 中添加：

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NODE_ENV=production
```

### 步骤5：触发部署
- 如果使用 CLI：`vercel --prod`
- 如果使用 GitHub：推送代码或手动触发

## 部署后验证

### ✅ 功能测试
- [ ] 访问部署的 URL
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试创建婚礼
- [ ] 测试加入婚礼（使用短ID）
- [ ] 测试任务分配
- [ ] 测试任务状态更新

### ✅ 性能检查
- [ ] 检查页面加载速度
- [ ] 检查 API 响应时间
- [ ] 查看 Vercel Analytics（如启用）

### ✅ 日志检查
- [ ] 查看 Vercel 函数日志
- [ ] 检查是否有错误
- [ ] 确认数据库连接正常

## 常见问题排查

### 问题1：构建失败
**检查：**
- Vercel 构建日志
- `package.json` 中的脚本
- Prisma 生成是否成功

**解决：**
```bash
# 本地测试构建
npm run build
```

### 问题2：数据库连接失败
**检查：**
- `DATABASE_URL` 环境变量是否正确
- 数据库是否允许外部连接
- SSL 连接设置

**解决：**
- 检查数据库连接字符串格式
- 确认 IP 白名单设置
- 测试本地连接

### 问题3：迁移失败
**检查：**
- 迁移文件是否正确
- 数据库是否已存在表结构

**解决：**
```bash
# 重置数据库（谨慎！会删除所有数据）
DATABASE_URL="your-url" npx prisma migrate reset

# 或手动运行迁移
DATABASE_URL="your-url" npx prisma migrate deploy
```

## 回滚方案

如果部署出现问题：

1. **Vercel Dashboard 回滚**
   - 进入项目 → Deployments
   - 找到之前的成功部署
   - 点击 "..." → "Promote to Production"

2. **Git 回滚**
   ```bash
   git revert HEAD
   git push
   ```

## 生产环境优化建议

### 性能优化
- [ ] 启用 Vercel Analytics
- [ ] 配置 CDN 缓存
- [ ] 优化图片加载
- [ ] 启用压缩

### 安全优化
- [ ] 使用 HTTPS（Vercel 自动）
- [ ] 配置 CORS（如需要）
- [ ] 设置环境变量保护
- [ ] 定期更新依赖

### 监控
- [ ] 配置错误监控（Sentry）
- [ ] 设置性能监控
- [ ] 配置日志收集

## 下一步

部署成功后：
1. 配置自定义域名（可选）
2. 设置自动部署（GitHub 集成）
3. 配置监控和告警
4. 准备小程序前端开发
