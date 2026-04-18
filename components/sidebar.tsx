import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function Sidebar({ posts }: { posts: Post[] }) {
  return (
    <aside className="glass sticky top-24 h-fit rounded-[28px] p-5 shadow-soft">
      <h3 className="sidebar-title mb-4">文章导航</h3>

      <div className="article-scroll max-h-[70vh] overflow-y-auto pr-2">
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="sidebar-link block rounded-xl px-3 py-2 transition hover:bg-black/5 hover:text-text dark:hover:bg-white/5"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}