import { cardStyles } from '@/styles/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import { getServiceByIdUseCase } from '@/use-cases/services';
import { cn } from '@/lib/utils';
import DeleteServiceButton from '../components/delete-service-button';
import { NotFoundError } from '@/app/util';
import CreateEditServiceButton from '../create-edit-service-button';
import { Button } from '@/components/ui/button';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

export default async function ServicePage({
  params
}: {
  params: { serviceId: string };
}) {
  const { serviceId } = params;
  // const user = await getCurrentUser();

  // if (!user) {
  //   return notFound();
  // }
  try {
    const service = await getServiceByIdUseCase(parseInt(serviceId));

    //console.log('SERVICE BY ID/PARAM', service);

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
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm ">
                  <p className="truncate flex items-center">
                    <span className=" text-muted-foreground mr-1 flex items-center">
                      Service name:
                    </span>
                    <span className="capitalize">
                      {service.name.replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p className="truncate flex items-center">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Description:
                    </span>
                    {service.description}
                  </p>
                  <p className="truncate flex items-center">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Included services:
                    </span>
                    {service.included_services}
                  </p>
                  <p className="truncate flex items-center">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Delivery process:
                    </span>
                    {service.delivery_process}
                  </p>
                  <p className="truncate flex items-center">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Pricing:
                    </span>
                    {service.pricing}
                  </p>
                </div>

                <div className="flex justify-between">
                  <div className="pt-4  ">
                    <CreateEditServiceButton serviceId={serviceId} />
                  </div>
                  <div className="  pt-4">
                    <DeleteServiceButton />
                  </div>
                </div>

                <div className="flex justify-between"></div>
              </CardContent>
            </div>
            {/* column 2 */}
            <div className={cn(cardStyles, 'overflow-hidden')}>
              <CardHeader>
                <CardTitle>
                  Clients that use this service will go here
                </CardTitle>
              </CardHeader>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound();
    }
    // Handle other types of errors as needed
    throw error; // This will trigger the closest error boundary
  }
}
