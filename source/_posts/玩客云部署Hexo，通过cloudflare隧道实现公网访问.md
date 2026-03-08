---
title: 玩客云部署Hexo，通过cloudflare隧道实现公网访问
---
## 📋 项目概述

使用 Hexo 静态博客框架，通过 Cloudflare Tunnel 在内网 NAS 上部署，实现公网访问。

------

## 🛠️ 环境要求

### 本地开发环境

- Node.js 14+
- Git
- Hexo CLI

### 服务器环境

- Linux NAS/服务器
- Python 3.x
- Cloudflared

------

## 📁 项目结构

text

```
my-ws01-blog/
├── source/
│   └── _posts/          # 文章目录
├── themes/
│   └── ws01-note/       # 自定义主题
├── _config.yml          # Hexo 配置
└── package.json
```



------

## 🚀 完整部署流程

### 第一阶段：本地开发环境搭建

#### 1. 安装 Hexo

bash

```
npm install -g hexo-cli
```



#### 2. 创建博客项目

bash

```
hexo init my-ws01-blog
cd my-ws01-blog
npm install
```



#### 3. 安装主题和插件
ws01-note主题：https://github.com/K1314047/hexo-theme-ws01-note

bash

```
# 搜索插件
npm install hexo-generator-search --save

# 字数统计
npm install hexo-wordcount --save
```



#### 4. 测试本地运行

bash

```
hexo clean && hexo generate && hexo server
# 访问 http://localhost:4000
```



------

### 第二阶段：NAS 环境准备

#### 1. 创建网站目录

bash

```
mkdir -p /var/www/hexo-blog
```



#### 2. 安装 Cloudflared

bash

```
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/
```



#### 3. Cloudflare 认证

bash

```
cloudflared tunnel login
# 在浏览器中完成认证
```



#### 4. 创建隧道

bash

```
cloudflared tunnel create hexo-blog
# 记下隧道ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```



#### 5. 配置隧道

bash

```
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: 你的隧道ID
credentials-file: /root/.cloudflared/你的隧道ID.json

ingress:
  - hostname: blog.iove.eu.org
    service: http://localhost:4000
  - service: http_status:404
EOF
```



#### 6. 配置 DNS

bash

```
cloudflared tunnel route dns hexo-blog blog.iove.eu.org
```



------

### 第三阶段：Web 服务配置

#### 方法一：使用 systemd 服务（推荐）

bash

```
cat > /etc/systemd/system/hexo-blog.service << 'EOF'
[Unit]
Description=Hexo Blog Web Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/hexo-blog
ExecStart=/usr/bin/python3 -m http.server 4000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable hexo-blog.service
systemctl start hexo-blog.service
```



#### 方法二：使用 screen（备用）

bash

```
screen -S hexo-server -d -m python3 -m http.server 4000
# 分离会话: Ctrl+A, D
# 重新连接: screen -r hexo-server
```



------

### 第四阶段：部署和更新

#### 1. 首次部署

bash

```
# 本地生成静态文件
hexo clean && hexo generate

# 上传到 NAS
scp -r public/* root@192.168.0.158:/var/www/hexo-blog/
```



#### 2. 创建部署脚本 `deploy.sh`

bash

```
#!/bin/bash
echo "🚀 开始部署 Hexo 博客..."

cd /d/blog/hexo/my-ws01-blog

echo "📝 生成静态文件中..."
hexo clean && hexo generate

echo "📤 上传到 NAS..."
rsync -avz --delete public/ root@192.168.0.158:/var/www/hexo-blog/

echo "✅ 部署完成！"
echo "🌐 访问地址: https://blog.iove.eu.org"
```



#### 3. 配置 SSH 密钥免密码登录

bash

```
# 本地生成密钥
ssh-keygen -t rsa -b 4096

# 复制公钥到 NAS
ssh-copy-id root@192.168.0.158
```



------

## ⚠️ 常见问题及解决方案

### 问题 1: `hexo: command not found`

**原因**: Node.js 或 Hexo 未安装
**解决**:

bash

```
npm install -g hexo-cli
```



### 问题 2: `Address already in use`

**原因**: 端口被占用或服务已在运行
**解决**:

bash

```
# 检查占用进程
netstat -tulpn | grep :4000
ps aux | grep "python3 -m http.server"

# 杀掉进程重新启动
pkill -f "python3 -m http.server"
```



### 问题 3: 关闭 SSH 后服务停止

**原因**: 服务在前台运行
**解决**: 使用 systemd 或 screen

bash

```
# systemd 方式
systemctl enable hexo-blog.service

# screen 方式
screen -S hexo-server -d -m python3 -m http.server 4000
```



### 问题 4: Cloudflare Tunnel 连接失败

**解决**:

bash

```
# 检查隧道状态
cloudflared tunnel list

# 重启服务
systemctl restart cloudflared

# 查看日志
journalctl -u cloudflared -f
```



### 问题 5: 代码高亮不显示

**解决**: 在主题 CSS 中添加高亮样式

css

```
figure.highlight {
    background: #1e1e1e;
    border-radius: 8px;
    padding: 20px;
}
```



------

## 🔧 维护命令

### 服务管理

bash

```
# 启动 Web 服务
systemctl start hexo-blog.service

# 停止服务
systemctl stop hexo-blog.service

# 查看状态
systemctl status hexo-blog.service

# 查看日志
journalctl -u hexo-blog.service -f
```



### Cloudflare Tunnel 管理

bash

```
# 查看隧道列表
cloudflared tunnel list

# 查看隧道信息
cloudflared tunnel info hexo-blog

# 重启隧道
systemctl restart cloudflared
```



### 文件管理

bash

```
# 检查网站文件
ls -la /var/www/hexo-blog/

# 清理缓存（如有问题）
hexo clean
```



------

## 📝 日常使用流程

### 写作新文章

bash

```
hexo new "文章标题"
# 编辑 source/_posts/文章标题.md
```



### 本地预览

bash

```
hexo clean && hexo generate && hexo server
```



### 部署更新

bash

```
# 使用脚本一键部署
./deploy.sh

# 或手动部署
hexo clean && hexo generate
rsync -avz --delete public/ root@192.168.0.158:/var/www/hexo-blog/
```



------

## 🎯 快速检查清单

部署完成后验证：

- 本地 `hexo server` 可访问
- NAS 上 `curl http://localhost:4000` 返回 200
- `netstat -tulpn | grep :4000` 显示端口监听
- `cloudflared tunnel list` 显示隧道活跃
- 公网 `https://blog.iove.eu.org` 可访问

------

## 💡 优化建议

1. **性能优化**: 配置 Nginx 替代 Python 简单服务器
2. **自动化**: 设置 Git Hook 自动部署
3. **备份**: 定期备份 Hexo 源码和主题文件
4. **监控**: 设置服务监控和告警
5. **CDN**: 利用 Cloudflare CDN 加速静态资源

------

## 📞 故障排除流程

1. **检查本地**: `hexo server` 是否正常
2. **检查 NAS 服务**: `systemctl status hexo-blog.service`
3. **检查端口**: `netstat -tulpn | grep :4000`
4. **检查隧道**: `cloudflared tunnel list`
5. **查看日志**: `journalctl -u hexo-blog.service -n 20`

------

*最后更新: 2025年11月12日*
*基于实际部署经验总结*
