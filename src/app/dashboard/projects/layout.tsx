import React from 'react';
import { ClientList } from './_components/client-list';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ProjectsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <main className="container">
      <div>
        <div className="flex gap-x-6">
          <div className="w-64 shrink-0 md:block">
            <ClientList />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
