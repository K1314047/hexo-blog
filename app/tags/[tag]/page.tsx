import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { getAllTags, getPostsByTag } from '@/lib/posts';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag.name) }));
}

export default function TagDetailPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);

  return (
    <>
      <Header />
      <section className="space-y-6">
        <div className="glass rounded-[28px] p-8 shadow-soft">
          <h1 className="text-4xl font-extrabold">标签：#{tag}</h1>
          <p className="mt-3 text-muted">共 {posts.length} 篇文章</p>
        </div>
        {posts.map((post) => <PostCard key={post.slug} post={post} />)}
      </section>
    </>
  );
}
