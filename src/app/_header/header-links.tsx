'use client';

import { Button } from '@/components/ui/button';
import { BookIcon, SearchIcon, UsersIcon } from 'lucide-react';
import useMediaQuery from '@/hooks/use-media-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderLinks() {
  const path = usePathname();
  const { isMobile } = useMediaQuery();
  const isLandingPage = path === '/';

  return (
    <div className="hidden md:flex gap-4">
      <Button variant={'link'} asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button variant={'link'} asChild>
        <Link href="/#features">Features</Link>
      </Button>

      <Button variant={'link'} asChild>
        <Link href="/#pricing">Pricing</Link>
      </Button>

      <Button variant={'link'} asChild>
        <Link href={'/sign-in'}>Sign In</Link>
      </Button>
      <Button variant={'link'} asChild>
        <Link href={'/sign-up'}>Sign Up</Link>
      </Button>
    </div>
  );
}
