import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center pl-5">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl sm:inline-block">
            Productify
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Navigation items or user profile can go here */}
        </div>
      </div>
    </header>
  );
}
