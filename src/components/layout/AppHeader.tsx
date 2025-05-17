"use client";

import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { HEADER_HEIGHT } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function AppHeader() {
  const toggle = useAIAssistantStore(state => state.toggle);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header
      style={{ height: `${HEADER_HEIGHT}px`, display: 'flex', justifyContent: 'center' }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/100 h-[56px]"
    >
      <div className="container flex h-full items-center px-8">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-foreground" />
          <span className="font-bold text-xl sm:inline-block text-foreground">
            Productify
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Navigation items or user profile can go here */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
              <Moon className="h-6 w-6 text-gray-900" />
            )}
          </button>
          <button
            onClick={() => toggle()}
            className="ml-2 p-2 rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
            title="Open AI Assistant"
          >
            <Bot className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
