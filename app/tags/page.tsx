import Link from 'next/link';
import { Header } from '@/components/header';
import { getAllTags } from '@/lib/posts';

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <Header />
      <section className="glass rounded-[28px] p-8 shadow-soft">
        <h1 className="mb-8 text-4xl font-extrabold">标签</h1>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link key={tag.name} href={`/tags/${encodeURIComponent(tag.name)}`} className="rounded-full border border-border px-4 py-2 text-base font-medium">
              #{tag.name} <span className="text-muted">({tag.count})</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
