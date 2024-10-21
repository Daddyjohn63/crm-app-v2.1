import { getCurrentUser } from '@/lib/session';

import {
  getClientByIdUseCase,
  assertClientOwnership,
  getClientInfoByIdUseCase
} from '@/use-cases/clients';
import { NotFoundError } from '@/app/util';
import { notFound, redirect } from 'next/navigation';
import { getServiceByIdUseCase } from '@/use-cases/services';
import { ServiceHeader } from './service-header';

export default async function ServiceLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serviceId: string };
}) {
  //have we got a user?
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  //have we got a client with this id?
  const service = await getServiceByIdUseCase(user, parseInt(params.serviceId));
  //console.log('client', client);

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  //does the user have access to this client?
  // const isClientOwner = user
  //   ? await assertClientOwnership(user, client.id)
  //   : false;
  // if (!isClientOwner) {
  //   //redirect to sign in
  //   redirect('/sign-in');
  // }

  return (
    <div>
      <ServiceHeader service={service} />

      <div> {children}</div>
    </div>
  );
}
