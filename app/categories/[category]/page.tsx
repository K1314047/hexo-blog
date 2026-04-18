import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: encodeURIComponent(category.name) }));
}

export default function CategoryDetailPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  const posts = getPostsByCategory(category);

  return (
    <>
      <Header />
      <section className="space-y-6">
        <div className="glass rounded-[28px] p-8 shadow-soft">
          <h1 className="text-4xl font-extrabold">分类：{category}</h1>
          <p className="mt-3 text-muted">共 {posts.length} 篇文章</p>
        </div>
        {posts.map((post) => <PostCard key={post.slug} post={post} />)}
      </section>
    </>
  );
}
