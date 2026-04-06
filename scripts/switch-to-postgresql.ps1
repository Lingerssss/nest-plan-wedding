# 切换到 PostgreSQL 的辅助脚本

Write-Host "=== 切换到 PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# 备份当前 schema
$backupFile = "prisma\schema.sqlite.backup.prisma"
if (-not (Test-Path $backupFile)) {
    Copy-Item "prisma\schema.prisma" $backupFile
    Write-Host "✅ 已备份当前 schema 到: $backupFile" -ForegroundColor Green
}

# 检查当前 provider
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
if ($schemaContent -match 'provider = "sqlite"') {
    Write-Host "⚠️  当前使用 SQLite，需要切换到 PostgreSQL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请手动执行以下步骤：" -ForegroundColor Cyan
    Write-Host "1. 编辑 prisma/schema.prisma" -ForegroundColor White
    Write-Host "   将 provider = `"sqlite`" 改为 provider = `"postgresql`"" -ForegroundColor White
    Write-Host ""
    Write-Host "2. 创建 PostgreSQL 数据库并获取连接字符串" -ForegroundColor White
    Write-Host ""
    Write-Host "3. 设置环境变量：" -ForegroundColor White
    Write-Host "   DATABASE_URL=`"postgresql://user:password@host:port/database`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. 运行迁移：" -ForegroundColor White
    Write-Host "   npx prisma migrate deploy" -ForegroundColor Cyan
    Write-Host "   npx prisma generate" -ForegroundColor Cyan
} else {
    Write-Host "✅ Schema 已配置为 PostgreSQL" -ForegroundColor Green
}

Write-Host ""
Write-Host "参考文件: prisma/schema.postgresql.prisma" -ForegroundColor Cyan
