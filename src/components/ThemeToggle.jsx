import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsphere:theme');
      if (saved) return saved === 'dark';
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('shopsphere:theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} aria-pressed={dark} aria-label="Dark mode">
      {dark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
}
