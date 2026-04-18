# G.Ark Blog Next

一个可以直接部署到 GitHub + Vercel 的独立博客程序，基于 Next.js 14 + Markdown。

## 已内置功能

- 亮色 / 暗黑主题切换
- 暗黑模式黑金风格
- 首页顶部导航
- 首页左侧文章导航栏，自动读取 Markdown 文章
- 首页搜索文章 / 标签 / 分类
- 文章页左侧固定目录
- 文章页右下角返回顶部按钮
- 标签页 / 分类页 / 归档页
- 新增 Markdown 文章后自动出现在首页和侧边栏

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`

## 新建文章

把 Markdown 文件放到：

```text
content/posts/
```

文章头部格式：

```md
---
title: 文章标题
summary: 一段摘要
date: 2026-04-18
tags:
  - 标签1
  - 标签2
categories:
  - 分类1
---
```

## 部署到 GitHub + Vercel

先推送到 GitHub：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin 你的仓库地址
git push -u origin main
```

再到 Vercel 导入这个 GitHub 仓库即可，构建命令和输出会自动识别。

## 你后续最常改的地方

- 站点标题和导航：`lib/site.ts`
- 全局样式：`app/globals.css`
- 首页结构：`app/page.tsx`
- 文章页结构：`app/posts/[slug]/page.tsx`
- 文章内容：`content/posts/*.md`
