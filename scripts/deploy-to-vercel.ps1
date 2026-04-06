# Vercel 部署脚本

Write-Host "=== Vercel 部署助手 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI 未安装" -ForegroundColor Yellow
    Write-Host "正在安装 Vercel CLI..." -ForegroundColor Cyan
    npm i -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 安装失败，请手动运行: npm i -g vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI 安装成功" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI 已安装" -ForegroundColor Green
}

# 检查 Prisma Schema
Write-Host ""
Write-Host "检查 Prisma Schema..." -ForegroundColor Cyan
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
if ($schemaContent -match 'provider = "postgresql"') {
    Write-Host "✅ Schema 已配置为 PostgreSQL" -ForegroundColor Green
} else {
    Write-Host "❌ Schema 仍使用 SQLite，需要更新为 PostgreSQL" -ForegroundColor Red
    Write-Host "请先更新 prisma/schema.prisma" -ForegroundColor Yellow
    exit 1
}

# 检查环境变量
Write-Host ""
Write-Host "检查环境变量..." -ForegroundColor Cyan
if ($env:DATABASE_URL) {
    Write-Host "✅ DATABASE_URL 已设置" -ForegroundColor Green
} else {
    Write-Host "⚠️  DATABASE_URL 未设置" -ForegroundColor Yellow
    Write-Host "部署时需要在 Vercel Dashboard 中配置" -ForegroundColor Yellow
}

# 检查 Git 状态
Write-Host ""
Write-Host "检查 Git 状态..." -ForegroundColor Cyan
$gitStatus = git status --porcelain 2>&1
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Write-Host "⚠️  有未提交的更改" -ForegroundColor Yellow
        Write-Host "建议先提交更改: git add . && git commit -m 'Prepare for deployment'" -ForegroundColor Cyan
    } else {
        Write-Host "✅ 工作区干净" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  未检测到 Git 仓库" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 部署选项 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "选项1：使用 Vercel CLI 部署" -ForegroundColor White
Write-Host "  命令: vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "选项2：使用 GitHub 集成（推荐）" -ForegroundColor White
Write-Host "  1. 推送代码到 GitHub" -ForegroundColor Cyan
Write-Host "  2. 访问 https://vercel.com/new" -ForegroundColor Cyan
Write-Host "  3. 导入 GitHub 仓库" -ForegroundColor Cyan
Write-Host "  4. 配置 DATABASE_URL 环境变量" -ForegroundColor Cyan
Write-Host "  5. 点击 Deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "需要帮助创建 PostgreSQL 数据库吗？" -ForegroundColor Yellow
Write-Host "推荐使用 Vercel Postgres 或 Supabase" -ForegroundColor Cyan
