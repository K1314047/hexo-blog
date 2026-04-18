'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggleTheme}
      className="glass h-11 w-11 rounded-full text-lg transition hover:scale-105"
      aria-label="切换主题"
      title="切换主题"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
