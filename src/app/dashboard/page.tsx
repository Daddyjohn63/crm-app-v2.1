//check if user is logged in
//check if user has clients
//if user has clients, show them
//if user has no clients, show them message and a create client <button></button>
//get the number of clients so we can display this.
//if we have clients, render clientCard component.pass in props client count, client, client.id and some button text 'view client.

import { assertAuthenticated } from '@/lib/session';
import { CreateClientButton } from './create-client-button';

export default async function DashboardPage() {
  const user = await assertAuthenticated();

  //call function in clients business use case.

  return (
    <div>
      <CreateClientButton />
    </div>
  );
}
