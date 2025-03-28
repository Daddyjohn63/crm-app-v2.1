'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BookIcon, MenuIcon, SearchIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MenuButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const path = usePathname();
  const isLandingPage = path === '/';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2">
        {isAuthenticated && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex gap-2 items-center cursor-pointer"
              >
                <UsersIcon className="w-4 h-4" /> Your Clients
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/services"
                className="flex gap-2 items-center cursor-pointer"
              >
                <SearchIcon className="w-4 h-4" /> Your Services
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/projects"
                className="flex gap-2 items-center cursor-pointer"
              >
                <BookIcon className="w-4 h-4" /> Your Projects
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {/* {isLandingPage && !isAuthenticated && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/#features"
                className="flex gap-2 items-center cursor-pointer"
              >
                Features
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/#pricing"
                className="flex gap-2 items-center cursor-pointer"
              >
                Pricing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/browse"
                className="flex gap-2 items-center cursor-pointer"
              >
                <SearchIcon className="w-4 h-4" /> Browse Groups
              </Link>
            </DropdownMenuItem>
          </>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
