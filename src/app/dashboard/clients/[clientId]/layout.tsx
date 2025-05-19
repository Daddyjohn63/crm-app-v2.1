import { getCurrentUser } from '@/lib/session';
import { ClientHeader } from './client-header';
import {
  getClientByIdUseCase,
  assertClientOwnership,
  getClientInfoByIdUseCase
} from '@/use-cases/clients';
import { NotFoundError } from '@/app/util';
import { redirect } from 'next/navigation';
import TabsSection from './tabs-section';

export default async function ClientLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ clientId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  //have we got a user?
  const user = await getCurrentUser();
  //have we got a client with this id?
  const client = await getClientInfoByIdUseCase(parseInt(params.clientId));
  //console.log('client', client);

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  //does the user have access to this client?
  const isClientOwner = user
    ? await assertClientOwnership(user, client.id)
    : false;
  if (!isClientOwner) {
    //redirect to sign in
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen">
      <ClientHeader client={client} />
      <TabsSection clientId={params.clientId} />
      <div className="min-h-[calc(100vh-180px)]"> {children}</div>
    </div>
  );
}
