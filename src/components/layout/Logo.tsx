import { Rocket } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link 
      href="/dashboard" 
      className={`mr-6 flex items-center space-x-2 ${className}`}
      aria-label="Go to dashboard"
    >
      <Rocket className="h-6 w-6 text-foreground" />
      <span className="font-bold text-xl sm:inline-block text-foreground">
        Productify
      </span>
    </Link>
  );
} 