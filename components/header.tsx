import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="mb-10 flex items-start justify-between gap-4">
      <div>
        <Link href="/" className="site-title">
          {siteConfig.title}
        </Link>

        <p className="site-subtitle mt-3">
          {siteConfig.description}
        </p>

        <nav className="mt-7 flex flex-wrap gap-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass rounded-full px-5 py-3 text-base font-semibold transition hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}