---
title: 手把手教你搭建自己的 AI 中转服务
summary: 无需 VPN 访问，低成本实现 Token 自由（完整免费教程）
date: 2026-04-27
tags:
  - 中转
  - 建站
categories:
  - 技术笔记
---
很多人在高频使用 GPT / Claude / Gemini 后，都会遇到同一个问题：

> 拼车额度不够、官方价格太高、中转站不稳定。

我自己也踩过不少坑。

过去几个月，为了稳定使用最好的模型，我陆续买过很多拼车和中转服务：

- 几百块一个月
- 每天 20～30 刀额度限制
- 高峰期排队 / 掉线
- 随时可能跑路

直到后来我意识到：

> **既然我是程序员，为什么不自己搭？**

于是折腾出了这套方案。

---

## 成本预算

|项目|费用|
|---|---|
|海外 VPS|$9 ~ $15 / 月|
|域名|¥10 / 年|
|软件|免费|

---

## 为什么值得自己搭

这是我近几个月的 Token 消耗：

> **累计 10,000+ 美元**

尤其是 **Vibe Coding** 流行之后：

- 写代码全程 AI 辅助
- 多模型并行调用
- Prompt 调试频率极高

如果你也是重度用户：

> **自己搭中转站几乎是必选项。**

---

## 本教程使用的工具

### 中转核心：sub2api

GitHub：

https://github.com/Wei-Shaw/sub2api

目前大量中转站都基于它搭建：

- 更新快
- 社区活跃
- 支持多模型渠道
- 稳定性较高

---

### VPS：VoyraCloud

推荐选择：

- 海外住宅 IP
- 2核4G 起步
- 稳定即可
- ![[Pasted image 20260427214044.png]]

---

### DNS / CDN：Cloudflare

主要用于：

- DNS 托管
- 橙云代理
- 国内免 VPN 访问

---

### 域名购买：Alibaba Cloud

任意域名平台注册都可以。

---

# 正式开始部署

---

## 第一步：购买服务器

推荐配置：

|配置|建议|
|---|---|
|CPU|2 Core|
|内存|4 GB|
|系统|CentOS 9|

购买完成后进入服务器控制台。

---

## 第二步：安装 PostgreSQL

### 添加 PostgreSQL 源

```
sudo dnf install -y \  
https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```
![[Pasted image 20260427214234.png]]
---

### 安装 PostgreSQL 16

```
sudo dnf -qy module disable postgresql  

```
```
sudo dnf install -y postgresql16-server postgresql16
```


---

### 初始化数据库

```
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb  

```
```
sudo systemctl enable postgresql-16 --now
```
---

### 设置数据库密码

进入数据库：

```
sudo -u postgres psql
```

执行：

```
ALTER USER postgres WITH PASSWORD '你的密码';
```

退出：

```
\q
```

---

### 创建业务数据库

```
CREATE DATABASE sub2api;
```

---

## 第三步：安装 Redis

### 添加 Redis 源

```
sudo dnf install -y epel-release  
```
```
sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm
```

---

### 安装 Redis 7

```
sudo dnf module reset redis -y  
```
```
sudo dnf module enable redis:7 -y  
```
```
sudo dnf install -y redis
```

---

### 启动 Redis

```
sudo systemctl enable redis --now
```

---

# 第四步：部署 sub2api

进入：

https://github.com/Wei-Shaw/sub2api

按照 README 中的部署命令执行。
![[Pasted image 20260427214309.png]]
![[Pasted image 20260427214322.png]]
---

## 安装完成后访问后台

http://你的服务器IP:8080

---

## 配置安装向导

### 数据库配置

|项目|填写内容|
|---|---|
|Host|127.0.0.1|
|Port|5432|
|Database|sub2api|
|Username|postgres|
|Password|你的数据库密码|

---

### Redis 配置

默认本地 Redis：

直接测试连接即可。
![[Pasted image 20260427214359.png]]

---

### 设置管理员账号

创建你的后台登录账户。
![[Pasted image 20260427214413.png]]
![[Pasted image 20260427214435.png]]

---

### 完成安装

点击安装即可。
![[Pasted image 20260427214504.png]]


---

# 第五步：配置域名免 VPN 访问

---

## 购买域名

随便买一个自己喜欢的域名。

---

## 添加到 Cloudflare

Cloudflare 后台：

> Add Site

---

## 添加 DNS 记录

新增两条 A 记录：

|类型|主机名|记录值|
|---|---|---|
|A|@|VPS IP|
|A|www|VPS IP|
![[Pasted image 20260427214537.png]]

---

## 开启橙云代理

确保 DNS 状态为：

> **Proxied（橙云）**

---

## 修改 NS 到 Cloudflare

去域名注册商后台：

把默认 DNS 改为 Cloudflare 提供的 NS。

---

## 等待生效

通常：

> 5 分钟～24 小时

---

# 完成效果

之后即可通过：

https://你的域名

直接访问中转后台。

---

# 我的账号采购经验

---

## Claude

之前主要通过礼品卡充值。

稳定性还不错。

---

## OpenAI Plus 号池

目前我维护：

> **20 个 GPT Plus 账号**

---

### 成本

平均：

> **约 ¥20 / 个**

---

### 效果

> 接近无限 GPT 使用额度

---

## Gmail Alias 技巧

Gmail 支持邮箱别名：

abc123@gmail.com  
abc.123@gmail.com  
a.bc123@gmail.com

这些邮箱：

> **本质都指向同一个收件箱**

---

### 用途

适合：

- 多账号注册
- 批量邮箱管理
- 代充辅助

---

# 总结

如果你：

- 每天高频使用 AI
- Token 消耗巨大
- 不想被拼车限制
- 有基础运维能力

那么：

> **自己搭中转站，是最优解。**

---

# 最后的话

很多人以为自己缺的是：

> Token

但实际上你真正缺的是：

> **一套属于自己的 AI 基础设施。**

---

如果你搭完这套系统：

你获得的不只是更多额度。

更是：

- 更稳定的工作流
- 更低的长期成本
- 更完整的技术认知
- 更高的 AI 使用自由度