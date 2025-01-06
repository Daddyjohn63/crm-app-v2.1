import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { getClientsByUser } from '@/data-access/clients';
import { Sidebar } from './sidebar';
import { redirect } from 'next/navigation';

function ClientListSkeleton() {
  return (
    <div className="w-64 h-[calc(100vh-65px)] animate-pulse bg-gray-100" />
  );
}

async function ClientListContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const clients = await getClientsByUser(user.id);
  return <Sidebar clients={clients} />;
}

export function ClientList() {
  return (
    <Suspense fallback={<ClientListSkeleton />}>
      <ClientListContent />
    </Suspense>
  );
}
