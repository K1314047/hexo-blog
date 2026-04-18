import { Header } from '@/components/header';
import { SearchBox } from '@/components/search-box';
import { Sidebar } from '@/components/sidebar';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar posts={posts} />
        <SearchBox posts={posts} />
      </div>
    </>
  );
}