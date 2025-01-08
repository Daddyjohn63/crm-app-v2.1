import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { getClientsByUser } from '@/data-access/clients';
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
  //TODO. NEED A USE-CASE HERE, NOT ACCESSING DB LAYER DIRECTLY. WE WILL NEED TO DO CHECKS TO SEE IF USER HAS PERMSISSION TO VIEW THE PROJECT.
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
