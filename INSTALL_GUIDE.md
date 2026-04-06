# 安装指南

## 问题诊断

Prisma 包安装失败，原因是网络代理连接问题（端口 7890）。

## 解决方案

### 方案1：配置 npm 代理（推荐）

如果你有可用的代理服务器，配置 npm 使用它：

```powershell
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
```

然后重新安装：
```powershell
npm install
```

### 方案2：临时禁用代理

如果代理不可用，可以临时禁用：

```powershell
npm config delete proxy
npm config delete https-proxy
npm install
```

### 方案3：使用国内镜像源

使用淘宝镜像源：

```powershell
npm config set registry https://registry.npmmirror.com
npm install
```

### 方案4：手动安装 Prisma

如果以上方法都不行，可以尝试：

```powershell
# 先安装其他依赖
npm install --ignore-scripts

# 然后单独安装 Prisma（可能需要多次重试）
npm install prisma@^5.22.0 @prisma/client@^5.22.0 --force
```

## 安装完成后

安装完成后，需要初始化数据库：

```powershell
# 生成 Prisma 客户端
npx prisma generate

# 创建数据库迁移
npx prisma migrate dev --name init

# （可选）运行种子数据
npx prisma db seed
```

## 验证安装

检查 Prisma 是否安装成功：

```powershell
npx prisma --version
```

如果显示版本号，说明安装成功。
