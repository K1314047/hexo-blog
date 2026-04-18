import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="glass rounded-[28px] p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap gap-2 text-sm text-muted">
        <span className="rounded-full border border-border px-3 py-1">
          发布：{new Date(post.date).toLocaleDateString('zh-CN')}
        </span>
        <span className="rounded-full border border-border px-3 py-1">
          字数：{post.wordCount}
        </span>
        <span className="rounded-full border border-border px-3 py-1">
          阅读：{post.readingTime} 分钟
        </span>
      </div>

      <h2>
        <Link
          href={`/posts/${post.slug}`}
          className="post-card-title transition"
        >
          {post.title}
        </Link>
      </h2>

      <p className="mt-4 text-base leading-8 text-muted">{post.summary}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="tag-chip rounded-full border border-border px-3 py-1"
          >
            #{tag}
          </Link>
        ))}

        {post.categories.map((category) => (
          <Link
            key={category}
            href={`/categories/${encodeURIComponent(category)}`}
            className="tag-chip rounded-full border border-border px-3 py-1"
          >
            {category}
          </Link>
        ))}
      </div>
    </article>
  );
}