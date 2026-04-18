import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type PostMeta = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  categories: string[];
  cover?: string;
  draft?: boolean;
};

export type TocItem = {
  level: number;
  id: string;
  text: string;
};

export type Post = PostMeta & {
  slug: string;
  content: string;
  html: string;
  wordCount: number;
  readingTime: number;
  toc: TocItem[];
};

function ensureDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  .use(markdownItAttrs)
  .use(markdownItAnchor, {
    slugify,
    permalink: markdownItAnchor.permalink.headerLink()
  });

export function getPostSlugs() {
  ensureDir();
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: string): Post {
  ensureDir();
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const toc: TocItem[] = [];
  const html = md.render(content).replace(
    /<h([1-3]) id="([^"]+)"[^>]*>(.*?)<\/h\1>/g,
    (_, level, id, inner) => {
      const text = String(inner).replace(/<[^>]+>/g, '').trim();
      toc.push({ level: Number(level), id, text });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    }
  );

  const plainText = content.replace(/[`#>*\-\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 300));

  return {
    slug: realSlug,
    title: data.title ?? realSlug,
    date: data.date ?? new Date().toISOString(),
    summary: data.summary ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
    cover: data.cover,
    draft: data.draft ?? false,
    content,
    html,
    wordCount,
    readingTime,
    toc
  };
}

export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug.replace(/\.md$/, '')))
    .filter((post) => !post.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getAllTags() {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

export function getAllCategories() {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const category of post.categories) map.set(category, (map.get(category) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.categories.includes(category));
}

export function groupPostsByYear() {
  const groups = new Map<string, Post[]>();
  for (const post of getAllPosts()) {
    const year = new Date(post.date).getFullYear().toString();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return Array.from(groups.entries()).map(([year, posts]) => ({ year, posts }));
}
