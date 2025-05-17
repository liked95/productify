"use client";

import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { HEADER_HEIGHT } from '@/lib/constants';

export function AppHeader() {
  const toggle = useAIAssistantStore(state => state.toggle);
  return (
    <header
      style={{ height: `${HEADER_HEIGHT}px`, display: 'flex', justifyContent: 'center' }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[56px] "
    >
      <div className="container flex h-full items-center px-8">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl sm:inline-block">
            Productify
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Navigation items or user profile can go here */}
          <button
            onClick={() => toggle()}
            className="ml-2 p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            title="Open AI Assistant"
          >
            <Bot className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}
