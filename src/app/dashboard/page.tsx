//check if user is logged in
//check if user has clients
//if user has clients, show them
//if user has no clients, show them message and a create client <button></button>
//get the number of clients so we can display this.
//if we have clients, render clientCard component.pass in props client count, client, client.id and some button text 'view client.

import { assertAuthenticated } from '@/lib/session';
import { CreateClientButton } from './create-client-button';
import { getClientsUseCase } from '@/use-cases/clients';
import { cardStyles, pageTitleStyles } from '@/styles/common';
import { Button } from '@/components/ui/button';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export default async function DashboardPage() {
  const user = await assertAuthenticated();
  const clients = await getClientsUseCase(user);

  const hasClients = clients.length > 0;

  //call function in clients business use case.
  if (hasClients) {
    return (
      <div className="space-y-8 container mx-auto py-24 min-h-screen max-w-2xl flex flex-col items-center">
        <div className="flex justify-between items-center">
          <h1 className={pageTitleStyles}>Your Clients</h1>
        </div>
        <div
          className={cn(
            cardStyles,
            'flex flex-col items-center gap-6 p-12 w-full'
          )}
        >
          <h2>Uh-oh, you don't have any clients</h2>

          <div className="flex gap-4">
            {/* create a group button */}
            <CreateClientButton />

            {/* <Button asChild className={btnStyles} variant={'secondary'}>
              <Link href={`/browse`}>
                <Search className={btnIconStyles} /> Browse Groups
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    );
  }
}
