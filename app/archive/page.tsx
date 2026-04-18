import Link from 'next/link';
import { Header } from '@/components/header';
import { groupPostsByYear } from '@/lib/posts';

export default function ArchivePage() {
  const groups = groupPostsByYear();

  return (
    <>
      <Header />
      <section className="glass rounded-[28px] p-8 shadow-soft">
        <h1 className="mb-8 text-4xl font-extrabold">归档</h1>
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.year}>
              <h2 className="mb-4 text-2xl font-bold">{group.year}</h2>
              <ul className="space-y-3">
                {group.posts.map((post) => (
                  <li key={post.slug} className="flex flex-col gap-1 rounded-2xl border border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <Link href={`/posts/${post.slug}`} className="font-semibold hover:text-accent">{post.title}</Link>
                    <span className="text-sm text-muted">{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
