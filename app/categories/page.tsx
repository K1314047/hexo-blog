import Link from 'next/link';
import { Header } from '@/components/header';
import { getAllCategories } from '@/lib/posts';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <>
      <Header />
      <section className="glass rounded-[28px] p-8 shadow-soft">
        <h1 className="mb-8 text-4xl font-extrabold">分类</h1>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link key={category.name} href={`/categories/${encodeURIComponent(category.name)}`} className="rounded-full border border-border px-4 py-2 text-base font-medium">
              {category.name} <span className="text-muted">({category.count})</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
