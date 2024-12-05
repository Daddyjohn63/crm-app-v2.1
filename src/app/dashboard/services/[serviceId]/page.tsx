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
                <div className="flex flex-col space-y-4 text-sm ">
                  <p className=" flex flex-col items-start">
                    <span className=" text-muted-foreground mr-1 flex items-start">
                      Service name:
                    </span>
                    <span className="capitalize mt-1">
                      {service.name.replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p className="flex flex-col items-start">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Description:
                    </span>
                    <span className="mt-1">{service.description}</span>
                  </p>
                  <p className="flex flex-col items-start">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Included services:
                    </span>
                    <span className="mt-1">{service.included_services}</span>
                  </p>
                  <p className="flex flex-col items-start">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Delivery process:
                    </span>
                    <span className="mt-1">{service.delivery_process}</span>
                  </p>
                  <p className="flex flex-col items-start">
                    <span className="text-muted-foreground mr-1 flex items-center">
                      Pricing:
                    </span>
                    <span className="mt-1">{service.pricing}</span>
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
