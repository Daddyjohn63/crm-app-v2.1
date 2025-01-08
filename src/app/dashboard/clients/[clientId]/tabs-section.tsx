'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client } from '@/db/schema/index';
import { cn } from '@/lib/utils';
import { tabStyles } from '@/styles/common';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabsSection({ clientId }: { clientId: string }) {
  const path = usePathname();
  const tabInUrl = path.includes('/posts') ? 'posts' : path.split('/').pop();

  return (
    <div className={tabStyles}>
      <div className="container mx-auto">
        <Tabs value={tabInUrl} defaultValue={tabInUrl} activationMode="manual">
          <TabsList className="flex-wrap space-x-4 bg-inherit h-fit">
            <TabsTrigger asChild value="info">
              <Link href={`/dashboard/clients/${clientId}/info`}>Info</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="contacts">
              <Link href={`/dashboard/clients/${clientId}/contacts`}>
                Contacts
              </Link>
            </TabsTrigger>

            <TabsTrigger asChild value="posts">
              <Link href={`/dashboard/clients/${clientId}/posts`}>Posts</Link>
            </TabsTrigger>
            <TabsTrigger asChild value="reminders">
              <Link href={`/dashboard/clients/${clientId}/reminders`}>
                Reminders
              </Link>
            </TabsTrigger>
            <TabsTrigger asChild value="documents">
              <Link href={`/dashboard/clients/${clientId}/documents`}>
                Documents
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
