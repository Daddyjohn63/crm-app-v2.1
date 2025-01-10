import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { getClientBoardsByUserId } from '@/data-access/projects';
import { Sidebar } from './sidebar';
import { redirect } from 'next/navigation';

function ClientListSkeleton() {
  return <div className="w-64 h-[calc(100vh-65px)] animate-pulse" />;
}

async function ClientListContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }
  //coming from data-access
  const clientsWithBoards = await getClientBoardsByUserId(user.id);
  return <Sidebar clients={clientsWithBoards} />;
}

export function ClientList() {
  return (
    <Suspense fallback={<ClientListSkeleton />}>
      <ClientListContent />
    </Suspense>
  );
}
