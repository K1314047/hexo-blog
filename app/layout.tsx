import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';
import { ThemeScript } from '@/components/theme-script';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen px-6 py-10 md:px-10">
        <ThemeScript />
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </body>
    </html>
  );
}
