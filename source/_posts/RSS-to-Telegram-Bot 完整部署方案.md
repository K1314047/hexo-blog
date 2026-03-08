---
title: 'RSS-to-Telegram-Bot 完整部署方案'
---

### 1. 系统要求

- VPS（Ubuntu/CentOS等Linux系统）
- Docker & Docker Compose
- Telegram Bot Token

### 2. 快速部署命令

bash

```
# 1. 克隆项目
git clone https://github.com/Rongronggg9/RSS-to-Telegram-Bot.git
cd RSS-to-Telegram-Bot

# 2. 创建配置文件
cp .env.sample .env
cp docker-compose.yml.sample docker-compose.yml

# 3. 创建数据目录
mkdir -p data

# 4. 编辑配置文件
nano .env
```



### 3. 环境配置文件 (.env)

env

```
# Telegram Bot Token (从 @BotFather 获取)
BOT_TOKEN=你的BotToken在这里

# 管理模式 (单用户模式设置为 no)
MULTI_USER=no

# 管理员ID (你的Telegram用户ID，通过 @userinfobot 获取)
ADMIN_ID=你的用户ID

# 数据库路径
DB_PATH=/app/data/rssbot.db
DATA_DIR=/app/data
```



### 4. Docker Compose 文件 (docker-compose.yml)

yaml

```
services:
  rss-bot:
    build: .
    container_name: rss-to-telegram-bot
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    networks:
      - rss-bot-network

networks:
  rss-bot-network:
    driver: bridge
```



### 5. 启动服务

bash

```
# 构建并启动
docker-compose up -d --build

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```



## 🔑 关键字过滤使用指南

### 基本命令流程：

bash

```
# 1. 添加订阅
/sub https://rsshub.app/bilibili/user/dynamic/344849788

# 2. 查看订阅ID
/list

# 3. 设置关键字过滤 (假设订阅ID为1)
/set 1 --include 科技,AI,编程
/set 1 --exclude 广告,直播,抽奖

# 4. 查看设置
/set 1

# 5. 清除过滤
/set 1 --clear
```



### 常用RSS源示例：

bash

```
# B站UP主
/sub https://rsshub.app/bilibili/user/dynamic/用户ID

# 知乎热榜
/sub https://rsshub.app/zhihu/hotlist

# GitHub趋势
/sub https://rsshub.app/github/trending

# 微博用户
/sub https://rsshub.app/weibo/user/用户ID

# 新闻网站
/sub https://rsshub.app/reuters/world
```



## 🛠 维护命令

### 服务管理：

bash

```
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新服务（重新拉取最新代码后）
docker-compose down
docker-compose up -d --build

# 备份数据
cp -r data data_backup_$(date +%Y%m%d)
```



### 日志查看：

bash

```
# 实时日志
docker-compose logs -f

# 最近100行日志
docker-compose logs --tail=100
```



## 📝 故障排除

### 1. Bot Token无效

- 重新在 @BotFather 创建新的Bot
- 更新 .env 文件中的 BOT_TOKEN
- 重启服务：`docker-compose restart`

### 2. 容器启动失败

bash

```
# 检查Docker服务
docker --version
docker-compose --version

# 重新构建
docker-compose down
docker-compose up -d --build
```



### 3. 数据库问题

bash

```
# 重置数据库（会丢失所有数据）
docker-compose down
rm -rf data
mkdir data
docker-compose up -d
```



## 💡 使用技巧

1. **测试订阅**：先用小的、活跃的RSS源测试
2. **关键字策略**：开始时关键词不要太严格，逐步调整
3. **监控日志**：定期查看日志了解推送状态
4. **备份配置**：定期备份 `data` 目录

这个方案包含了从零开始部署到日常使用的所有步骤，下次部署时直接按照这个文档操作即可
