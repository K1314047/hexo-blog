'use client';

import { useMemo, useState } from 'react';
import { PostCard } from './post-card';
import type { Post } from '@/lib/posts';

export function SearchBox({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((post) => {
      const haystack =
        `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.categories.join(' ')}`.toLowerCase();

      return haystack.includes(q);
    });
  }, [posts, query]);

  return (
    <section>
      <div className="glass mb-6 rounded-[24px] p-4 shadow-soft">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章 / 标签 / 分类"
          className="w-full bg-transparent px-3 py-2 text-base outline-none"
        />
      </div>

      <div className="space-y-6">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}

        {!filtered.length && (
          <div className="glass rounded-[24px] p-10 text-center text-muted">
            没有找到匹配内容。
          </div>
        )}
      </div>
    </section>
  );
}