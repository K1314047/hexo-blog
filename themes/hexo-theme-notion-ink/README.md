# hexo-theme-notion-ink

一个黑白 Notion 风格的 Hexo 主题：首页只有一个居中的搜索框，下面横向展示最近更新的 5 篇内容。

## 特性

- 黑白极简 / Notion 风格首页
- 顶部大面积 Hero 区域 + 居中搜索框
- 首页只展示最近更新的 5 篇文章
- 文章卡片横向排列，适合封面图展示
- 基于 `search.json` 的前端全文搜索
- 支持文章页、归档页、普通页面

## 目录结构

```text
hexo-theme-notion-ink/
├── _config.yml
├── layout/
├── source/
├── languages/
└── README.md
```

## 安装

把主题目录放到你的 Hexo 项目的 `themes/` 下：

```bash
cp -R hexo-theme-notion-ink themes/
```

然后在站点根目录 `_config.yml` 里启用：

```yml
theme: hexo-theme-notion-ink
```

## 搜索配置

这个主题默认读取 `/search.json`，所以建议安装下面的插件：

```bash
npm install hexo-generator-searchdb
```

然后在站点根目录 `_config.yml` 增加：

```yml
search:
  path: search.json
  field: post
  content: true
  format: json
```

## 首页封面图

你可以在文章 front-matter 里配置：

```yml
---
title: 示例文章
cover: /images/demo-cover.jpg
---
```

如果没有 `cover`，主题会自动生成一个极简占位封面。

## 主题配置

可在 `themes/hexo-theme-notion-ink/_config.yml` 中修改：

```yml
logo_text: 书籍知识库
subtitle: ''
latest_count: 5
search:
  placeholder: 搜索一下
  button_text: 搜索
  empty_text: 没有找到相关内容
  hint_text: 输入标题、摘要或正文关键词
footer_text: Powered by Hexo · notion-ink
```

## 你可能会做的两处定制

### 1. 改成更接近你截图里的“图书馆”样式

你可以给文章统一加 `cover`，卡片就会更接近截图的视觉效果。

### 2. 真正只保留首页

如果你想让整个站点更像知识库落地页，可以把导航、分类、标签等页面先不启用，只保留首页、文章页和搜索。

## 兼容说明

- 适合 Hexo 6 / 7 的常规 EJS 主题结构
- 搜索依赖 `hexo-generator-searchdb` 产出 `search.json`

