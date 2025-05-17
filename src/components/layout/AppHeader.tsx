"use client";

import { HEADER_HEIGHT } from '@/lib/constants';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AIAssistantToggle } from '@/components/ai/AIAssistantToggle';
import { Logo } from './Logo';

export function AppHeader() {
  return (
    <header
      style={{ height: `${HEADER_HEIGHT}px` }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/100 h-[56px]"
    >
      <div className="container flex h-full items-center px-8">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <AIAssistantToggle />
        </div>
      </div>
    </header>
  );
}
