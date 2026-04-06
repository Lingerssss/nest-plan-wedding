# Nest Plan Wedding

一个围绕婚礼前期筹备与婚礼当天事项安排的协作项目，当前采用 **Web + 微信小程序共用后端** 的方向演进。

## 当前能力

- Web 端可完成注册、登录、创建婚礼、加入婚礼、查看婚礼详情
- 支持创建人和参与者协作
- 任务支持前期筹备与婚礼当天两个阶段
- Web 与微信小程序共用同一套 `Next.js API + Prisma + PostgreSQL`
- 认证同时支持：
  - Web 端 Cookie Session
  - 小程序 Bearer Token

## 技术栈

- **Web/API**: Next.js 16 + React 19
- **数据库**: PostgreSQL + Prisma
- **认证**: 数据库 Session，支持 Cookie 与 Token 双通道
- **样式**: Tailwind CSS
- **小程序**: 原生微信小程序骨架，位于 `miniapp/`

## 目录结构

```text
wedding-tracker/
├── app/                      # Web 页面与 API 路由
├── components/               # Web 组件
├── lib/
│   ├── api.ts                # Web 端 API 客户端
│   ├── auth.ts               # Web 端会话读取
│   └── server/
│       ├── auth/             # 双端认证入口
│       ├── errors/           # 统一错误模型
│       └── services/         # 婚礼 / 任务 / 认证服务层
├── miniapp/                  # 微信小程序 MVP 工程
├── prisma/                   # PostgreSQL schema 与 migrations
└── types/                    # DTO 与接口类型
```

## 本地启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为本地环境文件，并填入 PostgreSQL 连接串：

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/nest_plan_wedding?schema=public"
NODE_ENV=development
APP_BASE_URL="http://127.0.0.1:3000"
SESSION_MAX_AGE_DAYS=7
```

### 3. 执行数据库迁移

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. 启动 Web / API

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 微信小程序开发

小程序工程位于 `miniapp/`。

### 本地调试步骤

1. 用微信开发者工具打开 `miniapp/`
2. 在开发者工具里关闭或放宽本地 `request` 域名校验
3. 保证本地 Web/API 服务运行在 `http://127.0.0.1:3000`
4. 按以下顺序验证：
   - 登录
   - 婚礼列表
   - 通过短 ID 加入婚礼
   - 婚礼详情
   - 更新任务状态

### 小程序环境配置

默认 API 地址配置在：

- `miniapp/config/env.js`

发布前请将生产域名替换为你的真实 HTTPS 域名。

## 认证说明

- Web 登录后会返回 `accessToken`，同时写入 HttpOnly Cookie
- 微信小程序登录后只保存 `accessToken`
- API 同时接受：
  - Cookie
  - `Authorization: Bearer <token>`

## 数据模型重点

- `User`: 用户账号与展示信息
- `Session`: 双端共享会话
- `Wedding`: 婚礼主实体
- `WeddingParticipant`: 协作参与关系
- `Task`: 前期筹备与婚礼当天事项

## 部署说明

推荐组合：

- **Web/API**: Vercel
- **数据库**: Supabase / Neon / Railway PostgreSQL

生产环境至少需要配置：

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NODE_ENV=production
APP_BASE_URL=https://your-web-api-domain.example.com
SESSION_MAX_AGE_DAYS=7
```

## 常用命令

```bash
npm run dev
npm run lint
npm run build
npx prisma migrate deploy
npx prisma db seed
```
