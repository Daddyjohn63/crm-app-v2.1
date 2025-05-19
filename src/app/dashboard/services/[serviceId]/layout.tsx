import { getCurrentUser } from '@/lib/session';

import {
  getClientByIdUseCase,
  assertClientOwnership,
  getClientInfoByIdUseCase
} from '@/use-cases/clients';
import { NotFoundError } from '@/app/util';
import { notFound, redirect } from 'next/navigation';
import { getServiceByIdUseCase } from '@/use-cases/services';
import { ServiceHeader } from '../_components/service-header';
import { toast } from '@/components/ui/use-toast';

export default async function ServiceLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ serviceId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  //have we got a user?
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  //have we got a client with this id?
  const service = await getServiceByIdUseCase(parseInt(params.serviceId));
  //console.log('client', client);

  if (!service) {
    // Service not found, redirect to the services list
    redirect('/dashboard/services');
  }

  const isServiceOwner = user.id === service.userId;

  if (!isServiceOwner) {
    redirect('/dashboard/services');
  }

  return (
    <div>
      <ServiceHeader service={service} />

      <div> {children}</div>
    </div>
  );
}
