---
title: Twitter监控页部署教程前端放Vercel后端继续跑本机
summary: Twitter 监控页部署教程：前端放 Vercel，后端继续跑本机
date: 2025-12-16
tags:
  - 建站
  - twitter
categories:
  - 技术笔记
---
# Twitter 监控页部署教程：前端放 Vercel，后端继续跑本机

这篇教程记录一下我自己的部署方案：

- **前端**：部署到 Vercel
- **后端**：继续运行在本机 Windows
- **推文抓取**：依赖本机已经可用的 `twitter` CLI
- **代理**：本机通过 `HTTP_PROXY/HTTPS_PROXY` 访问 X

这个方案的核心思路是：

> 不把依赖本机代理、登录态、CLI 的后端硬搬到云端，而是只把纯静态前端部署到 Vercel。  
> 前端负责页面展示，后端继续在本机负责调用 `twitter` CLI 抓推文。

---

## 一、前端怎么部署到 Vercel

### 第一步：把前端单独放到 GitHub

建议把前端代码放到仓库里的 `frontend` 目录，或者单独建一个前端仓库也行。

------

### 第二步：在 Vercel 导入 GitHub 仓库

进入 Vercel 后：

1. 选择 `Add New Project`
2. 选择 GitHub 仓库
3. 导入项目

------

### 第三步：设置 Root Directory

如果前端代码在 `frontend` 目录里，那么在 Vercel 里设置：

- **Root Directory**：`frontend`

如果前端就在仓库根目录，那就不用改。

------

### 第四步：设置构建选项

如果你的前端只是纯静态页面：

- **Framework Preset**：`Other`
- **Build Command**：留空
- **Output Directory**：留空

这样 Vercel 会直接把静态文件部署出去。

------

## 二、前端要怎么连本机后端

前端需要一个配置项，指向本机后端接口地址。

例如：

```
const API_BASE_URL = "http://127.0.0.1:3002";
```

这个地址的含义是：

- 页面加载后
- 前端会请求这个地址上的接口
- 由本机后端返回推文数据

------

## 三、本机后端怎么启动

进入 `backend` 目录，先安装依赖：

```
npm install
```

然后设置代理环境变量：

```
export HTTP_PROXY=http://127.0.0.1:10808
export HTTPS_PROXY=http://127.0.0.1:10808
export http_proxy=http://127.0.0.1:10808
export https_proxy=http://127.0.0.1:10808
```

再启动服务：

```
npm start
```

如果是 Windows + Git Bash，就直接这样执行。

## 四、后端需要提供哪些接口

这个方案里，后端建议至少提供这几个接口：

### 1）获取博主列表

```
GET /api/watchlist
```

返回固定博主名单。

------

### 2）获取某个博主最近推文

```
GET /api/watchlist/:username/posts
```

例如：

```
GET /api/watchlist/NNNNNNOBITA/posts
```

返回这个博主最近若干条推文。

------

### 3）手动刷新某个博主

```
POST /api/refresh/:username
```

点击页面上的刷新按钮时使用。

------

### 4）健康检查接口

```
GET /api/health
```

用于确认后端是否启动成功。

------

## 五、`watchlist.json` 怎么管理

如果只是简单写用户名，可以这样：

```
[
  "Web3Daoge1",
  "kongtoujiaoguan",
  "jt588888"
]
```

## 六、如果以后要给别的设备访问怎么办

如果以后想让手机、平板、别的电脑也能访问，你就不能继续让前端只连：

```
http://127.0.0.1:3002
```

而是要把本机后端暴露成公网地址，比如：

- Cloudflare Tunnel
- ngrok
- 一台自己的 VPS 做中转
- 或者把后端迁移到常规云服务器

到那一步再处理就行，当前这篇教程先聚焦“自己可用”。

## 七、我的推荐操作顺序

建议按这个顺序来做：

### 第 1 步：先在本机验证 CLI

```
twitter whoami --json
twitter user-posts NNNNNNOBITA --json
```

------

### 第 2 步：确认本机代理可用

```
export HTTP_PROXY=http://127.0.0.1:10808
export HTTPS_PROXY=http://127.0.0.1:10808
```

------

### 第 3 步：启动本机后端

```
npm install
npm start
```

------

### 第 4 步：本机访问接口测试

例如打开：

```
http://127.0.0.1:3002/api/health
```

------

### 第 5 步：前端单独部署到 Vercel

- 导入 GitHub 仓库
- 设置 `Root Directory`
- 直接部署

------

### 第 6 步：页面里配置后端地址

让前端请求：

```
http://127.0.0.1:3002
```

## 八、总结

这套方案的本质是：

- **Vercel 负责页面**
- **本机负责抓取**
- **推特访问继续走本机代理**
- **登录态继续保留在本机**
- **不用强行把本地 CLI 环境云端化**

我最后采用这个方案，主要是因为它：

- 成本低
- 改动小
- 好排查
- 不容易因为容器、登录态、代理这些问题反复折腾

如果你只是自己日常看关注博主的推文，这套方案已经够用了。

## 九、后续可扩展方向

这个结构后面还可以继续加：

- `daily-news` 标签页
- 按分组展示博主
- 已读/未读标记
- 一键刷新全部博主
- 公网访问能力
- 更漂亮的三栏 UI

先把最小可用版本跑起来，再慢慢加功能会轻松很多。

## 十、项目代码打包

- [twitter-web-vercel-local.zip](https://1drv.ms/u/c/ec2a52193bffd35d/IQCCUjgj-jgmRK556e6sQE66AdvI4fR8uKbo9rgRmm1mbS8?e=fNt6OV)

