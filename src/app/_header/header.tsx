import { HeaderLinks } from './header-links';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings2Icon, UsersIcon } from 'lucide-react';
import { HeaderActionsFallback } from '@/app/_header/header-actions-fallback';
import { applicationName } from '@/app-config';
import { SignOutItem } from '@/app/_header/sign-out-item';
import { MenuButton } from './menu-button';
import { getUserProfileUseCase } from '@/use-cases/users';
import { LightDarkToggle } from '@/components/light-dark-toggle';
import { getProfileImageFullUrl } from '../dashboard/settings/profile/components/profile-image';

export async function Header() {
  const user = await getCurrentUser();
  //console.log('USER FROM AUTH HEADER COMPONENT', user);
  return (
    <div className="bg-slate-200 dark:bg-slate-900">
      <div className="container mx-auto flex w-full py-4 justify-between">
        <div className="flex justify-between gap-10 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/group.jpeg"
              alt="CRM Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm md:text-base lg:text-2xl font-bold">
              {applicationName}
            </span>
          </Link>

          <HeaderLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center justify-between gap-5">
          <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProfileAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId);
  return (
    <Avatar>
      <AvatarImage src={getProfileImageFullUrl(profile)} />
      <AvatarFallback>
        {profile.displayName?.substring(0, 2).toUpperCase() ?? 'AA'}
      </AvatarFallback>
    </Avatar>
  );
}

async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>
          {/* <Suspense>
            <NotificationsWrapper />
          </Suspense> */}
          <LightDarkToggle className="" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <ProfileAvatar userId={user.id} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
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
                  href="/dashboard/settings/profile"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Settings2Icon className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <MenuButton />
          </div>
        </>
      ) : (
        <>
          <LightDarkToggle />
          <Button asChild variant="secondary">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </>
      )}
    </>
  );
}
