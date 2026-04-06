# Vercel 部署准备脚本
# 用于将 SQLite 迁移到 PostgreSQL

Write-Host "=== Vercel 部署准备 ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装 Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI 未安装" -ForegroundColor Yellow
    Write-Host "安装命令: npm i -g vercel" -ForegroundColor Yellow
    Write-Host ""
}

# 检查 Prisma Schema
Write-Host "1. 检查 Prisma Schema..." -ForegroundColor Green
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
if ($schemaContent -match 'provider = "sqlite"') {
    Write-Host "   ⚠️  当前使用 SQLite，需要改为 PostgreSQL" -ForegroundColor Yellow
    Write-Host "   请手动修改 prisma/schema.prisma：" -ForegroundColor Yellow
    Write-Host "   provider = `"sqlite`" → provider = `"postgresql`"" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   或使用参考文件: prisma/schema.postgresql.prisma" -ForegroundColor Cyan
} else {
    Write-Host "   ✅ Schema 已配置为 PostgreSQL" -ForegroundColor Green
}

# 检查环境变量文件
Write-Host ""
Write-Host "2. 检查环境变量配置..." -ForegroundColor Green
if (Test-Path ".env.production.example") {
    Write-Host "   ✅ .env.production.example 已存在" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env.production.example 不存在" -ForegroundColor Yellow
}

# 检查 vercel.json
Write-Host ""
Write-Host "3. 检查 Vercel 配置..." -ForegroundColor Green
if (Test-Path "vercel.json") {
    $vercelConfig = Get-Content "vercel.json" | ConvertFrom-Json
    Write-Host "   ✅ vercel.json 已配置" -ForegroundColor Green
    Write-Host "   构建命令: $($vercelConfig.buildCommand)" -ForegroundColor Cyan
    Write-Host "   区域: $($vercelConfig.regions -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  vercel.json 不存在" -ForegroundColor Yellow
}

# 检查 package.json 脚本
Write-Host ""
Write-Host "4. 检查构建脚本..." -ForegroundColor Green
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.scripts.'vercel-build') {
    Write-Host "   ✅ vercel-build 脚本已配置" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  vercel-build 脚本未配置" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 部署步骤 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 创建 PostgreSQL 数据库（Vercel Postgres / Supabase / Railway）" -ForegroundColor White
Write-Host "2. 更新 prisma/schema.prisma: provider = `"postgresql`"" -ForegroundColor White
Write-Host "3. 运行迁移: DATABASE_URL=`"your-url`" npx prisma migrate deploy" -ForegroundColor White
Write-Host "4. 部署到 Vercel:" -ForegroundColor White
Write-Host "   - CLI: vercel --prod" -ForegroundColor Cyan
Write-Host "   - GitHub: 推送代码到 GitHub，在 Vercel Dashboard 导入" -ForegroundColor Cyan
Write-Host "5. 在 Vercel Dashboard 配置 DATABASE_URL 环境变量" -ForegroundColor White
Write-Host ""
Write-Host "详细说明请查看: VERCEL-DEPLOYMENT.md" -ForegroundColor Cyan
