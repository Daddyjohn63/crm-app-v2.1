import { cardStyles } from '@/styles/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import { getServiceByIdUseCase } from '@/use-cases/services';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

export default async function ServicePage({
  params
}: {
  params: { serviceId: string };
}) {
  const { serviceId } = params;
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const service = await getServiceByIdUseCase(user, parseInt(serviceId));
  console.log('SERVICE BY ID/PARAM', service);

  return (
    <>
      {/* <PageHeader>
      </PageHeader> */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-9">
        {/* div grid with two columns 50 50 responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* column 1 */}
          <div className={cn(cardStyles, 'overflow-hidden')}>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li>
                  <strong>Service Name:</strong> {service.name}
                </li>
                <li>
                  <strong>Service Description:</strong> {service.description}
                </li>
                <li>
                  <strong>Services Included:</strong>{' '}
                  {service.included_services}
                </li>
                <li>
                  <strong>Delivery Process:</strong> {service.delivery_process}
                </li>
                <li>
                  <strong>Pricing:</strong> {service.pricing}
                </li>
              </ul>

              <div className="flex justify-between">
                {/* <div className="pt-4  ">
                  <CreateEditClientButton params={params} user={user as User} />
             
                </div> */}
                {/* <div className="  pt-4">
                  <DeleteClientButton />
                </div> */}
              </div>
            </CardContent>
          </div>
          {/* column 2 */}
          <div className={cn(cardStyles, 'overflow-hidden')}>
            <CardHeader>
              <CardTitle>Clients that use this service go here</CardTitle>
            </CardHeader>
          </div>
        </div>
      </div>
    </>
  );
}
