'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/posts';

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <aside className="glass fixed left-8 top-52 hidden w-[260px] rounded-[28px] p-5 shadow-soft xl:block">
      <h3 className="mb-4 text-lg font-bold">文章目录</h3>
      <div className="toc-scroll max-h-[65vh] overflow-y-auto pr-2">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 14}px` }}>
              <a
                href={`#${item.id}`}
                className={`block rounded-xl px-3 py-2 text-sm transition ${active === item.id ? 'bg-black/8 font-semibold text-text dark:bg-white/10' : 'text-muted hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
