# 交互式 Vercel 部署脚本

Write-Host "=== Vercel 部署助手 ===" -ForegroundColor Cyan
Write-Host ""

# 检查前置条件
Write-Host "检查前置条件..." -ForegroundColor Cyan

# 1. 检查 Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI 未安装" -ForegroundColor Red
    Write-Host "正在安装..." -ForegroundColor Yellow
    npm i -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "安装失败，请手动运行: npm i -g vercel" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Vercel CLI 已安装" -ForegroundColor Green

# 2. 检查 Prisma Schema
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
if ($schemaContent -match 'provider = "postgresql"') {
    Write-Host "✅ Prisma Schema 已配置为 PostgreSQL" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma Schema 仍使用 SQLite" -ForegroundColor Red
    Write-Host "需要先更新为 PostgreSQL" -ForegroundColor Yellow
    exit 1
}

# 3. 检查环境变量
Write-Host ""
Write-Host "⚠️  重要：需要 PostgreSQL 数据库连接字符串" -ForegroundColor Yellow
Write-Host ""
Write-Host "请先完成以下步骤：" -ForegroundColor Cyan
Write-Host "1. 创建 PostgreSQL 数据库：" -ForegroundColor White
Write-Host "   - Vercel Postgres: https://vercel.com → Storage → Create Database" -ForegroundColor Cyan
Write-Host "   - Supabase: https://supabase.com → New Project" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. 复制数据库连接字符串" -ForegroundColor White
Write-Host ""
$hasDatabase = Read-Host "是否已准备好数据库连接字符串？(y/n)"
if ($hasDatabase -ne "y" -and $hasDatabase -ne "Y") {
    Write-Host ""
    Write-Host "请先创建数据库，然后重新运行此脚本" -ForegroundColor Yellow
    Write-Host "详细步骤请查看: DEPLOY-GUIDE.md" -ForegroundColor Cyan
    exit 0
}

# 4. 登录 Vercel
Write-Host ""
Write-Host "=== 步骤1：登录 Vercel ===" -ForegroundColor Cyan
Write-Host "即将打开浏览器进行登录..." -ForegroundColor Yellow
$login = Read-Host "按 Enter 继续登录，或输入 'skip' 跳过（如果已登录）"
if ($login -ne "skip") {
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "登录失败，请手动运行: vercel login" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Vercel 登录完成" -ForegroundColor Green

# 5. 获取数据库连接字符串
Write-Host ""
Write-Host "=== 步骤2：配置数据库 ===" -ForegroundColor Cyan
$databaseUrl = Read-Host "请输入 PostgreSQL 连接字符串"
if (-not $databaseUrl) {
    Write-Host "❌ 数据库连接字符串不能为空" -ForegroundColor Red
    exit 1
}

# 6. 部署
Write-Host ""
Write-Host "=== 步骤3：部署到 Vercel ===" -ForegroundColor Cyan
Write-Host "选择部署方式：" -ForegroundColor Yellow
Write-Host "1. 预览部署（测试）" -ForegroundColor White
Write-Host "2. 生产部署" -ForegroundColor White
$deployType = Read-Host "请选择 (1/2)"

# 首次部署
Write-Host ""
Write-Host "开始部署..." -ForegroundColor Cyan
if ($deployType -eq "2") {
    # 先设置环境变量
    Write-Host "设置环境变量..." -ForegroundColor Yellow
    $env:DATABASE_URL = $databaseUrl
    $env:NODE_ENV = "production"
    
    # 部署
    vercel --prod --yes
} else {
    vercel --yes
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Cyan
    Write-Host "1. 在 Vercel Dashboard 中配置环境变量 DATABASE_URL" -ForegroundColor White
    Write-Host "2. 重新部署以确保环境变量生效" -ForegroundColor White
    Write-Host "3. 访问部署的 URL 测试功能" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ 部署失败，请查看错误信息" -ForegroundColor Red
    Write-Host "常见问题请查看: DEPLOY-GUIDE.md" -ForegroundColor Cyan
}
