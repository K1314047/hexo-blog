export function ThemeScript() {
  const script = `
  (() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
