import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BackToTop } from '@/components/back-to-top';
import { Header } from '@/components/header';
import { Toc } from '@/components/toc';
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/posts';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug: slug.replace(/\.md$/, '') }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const allPosts = getAllPosts();
  const post =
    allPosts.find((item) => item.slug === params.slug) ??
    (() => {
      try {
        return getPostBySlug(params.slug);
      } catch {
        return null;
      }
    })();

  if (!post) notFound();

  return (
    <>
      <Header />
      <Toc items={post.toc} />
      <div className="xl:pl-[320px]">
        <article className="glass rounded-[28px] p-6 shadow-soft md:p-8">
          <h1 className="post-page-title">{post.title}</h1>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
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

          <div className="mt-4 flex flex-wrap gap-3">
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

          <div
            className="prose-custom mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </div>
      <BackToTop />
    </>
  );
}