import { useTheme } from '@/hooks/use-theme';
import { ThemeIcon } from './ThemeIcon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
} 