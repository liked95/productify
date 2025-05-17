import { Sun, Moon } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';

interface ThemeIconProps {
  theme: Theme;
  className?: string;
}

export function ThemeIcon({ theme, className = '' }: ThemeIconProps) {
  return theme === 'dark' ? (
    <Sun className={`h-6 w-6 text-yellow-400 ${className}`} />
  ) : (
    <Moon className={`h-6 w-6 text-gray-900 ${className}`} />
  );
} 