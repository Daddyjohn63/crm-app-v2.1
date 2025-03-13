import { Suspense, memo, cache } from 'react';
import { getCurrentUser } from '@/lib/session';
import { getClientBoardsByUserId } from '@/data-access/projects';
import { Sidebar } from './sidebar';
import { redirect } from 'next/navigation';

function ClientListSkeleton() {
  return <div className="w-64 h-[calc(100vh-65px)] animate-pulse" />;
}

// Cache the data fetching function
const getCachedClientBoards = cache(async (userId: number) => {
  return getClientBoardsByUserId(userId);
});

async function ClientListContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Use the cached version of the function
  const clientsWithBoards = await getCachedClientBoards(user.id);
  return <Sidebar clients={clientsWithBoards} />;
}

export const ClientList = memo(function ClientList() {
  return (
    <Suspense fallback={<ClientListSkeleton />}>
      <ClientListContent />
    </Suspense>
  );
});
