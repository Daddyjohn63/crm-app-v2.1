'use client';

import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/use-media-query';
import { BookIcon, SearchIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const path = usePathname();
  const { isMobile } = useMediaQuery();
  const isLandingPage = path === '/';

  if (isMobile) return null;

  return (
    <>
      {!isLandingPage && isAuthenticated && (
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant={'navlink'}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={'/dashboard'} className="text-black">
              <UsersIcon className="w-4 h-4" /> Your Clients
            </Link>
          </Button>

          <Button
            variant={'navlink'}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={'/dashboard/services'}>
              <SearchIcon className="w-4 h-4" /> Your Services
            </Link>
          </Button>

          <Button
            variant={'navlink'}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={'/dashboard/projects'}>
              <BookIcon className="w-4 h-4" /> Projects
            </Link>
          </Button>
        </div>
      )}

      {isLandingPage && !isAuthenticated && (
        <div className="hidden md:flex gap-4">
          <Button variant={'navlink'} asChild>
            <Link href="/#features">Features</Link>
          </Button>

          <Button variant={'navlink'} asChild>
            <Link href="/#pricing">Pricing</Link>
          </Button>
        </div>
      )}

      {/* {(isLandingPage || isAuthenticated) && (
        <div className="hidden md:flex gap-4">
          <Button variant={'link'} asChild>
            <Link href="/#features">Features</Link>
          </Button>

          <Button variant={'link'} asChild>
            <Link href="/#pricing">Pricing</Link>
          </Button>
        </div>
      )} */}
    </>
  );
}
