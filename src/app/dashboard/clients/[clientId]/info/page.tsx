import { getCurrentUser } from '@/lib/session';
import {
  getClientByIdUseCase,
  getServicesByClientIdUseCase
} from '@/use-cases/clients';
import { getBoardsByClientId } from '@/data-access/projects';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@/app/util';
import { User } from '@/db/schema/index';
import { DeleteClientButton } from '@/app/dashboard/clients/_components/delete-client-button';
import { cn } from '@/lib/utils';
import { cardStyles } from '@/styles/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ClientToServiceButton from '../../_components/add-client-service-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateEditClientButton } from '../../_components/create-client-button';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

//TO-DO: DO I NEED TO HAVE 'FORCE-DYNAMIC ON THIS PAGE?
export const dynamic = 'force-dynamic'; // This ensures the page is always up-to-date

export default async function ClientInfoPage({
  params
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  const user = await getCurrentUser();

  const boards = await getBoardsByClientId(parseInt(clientId));
  // console.log('boards', boards);

  if (!user) {
    return notFound();
  }

  try {
    const client = await getClientByIdUseCase(user, parseInt(clientId));
    //console.log('client info', client);

    const clientServices = await getServicesByClientIdUseCase(
      parseInt(clientId)
    );

    return (
      <>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-9">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Skeleton for column 1 */}
                <div className={cn(cardStyles, 'overflow-hidden')}>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </div>

                {/* Skeleton for column 2 */}
                <div className={cn(cardStyles, 'overflow-hidden')}>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-24" />
                      ))}
                    </div>
                  </CardContent>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            }
          >
            {/* Existing grid content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* column 1 */}

              <div className={cn(cardStyles, 'overflow-hidden')}>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm ">
                    <p className="truncate flex items-center">
                      <span className=" text-muted-foreground mr-1 flex items-center">
                        Client name:
                      </span>
                      <span className="capitalize">{client.business_name}</span>
                    </p>
                    <p className="truncate flex items-center">
                      <span className=" text-muted-foreground mr-1 flex items-center">
                        Sales stage:
                      </span>
                      <span className="capitalize">
                        {client.sales_stage.replace(/_/g, ' ')}
                      </span>
                    </p>
                    <p className="flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 flex items-start">
                        Email:
                      </span>
                      <span className="flex items-center">
                        <span className="flex items-center">
                          {client.primary_email}
                          <CopyToClipboardButton
                            className="text-blue-500 ml-1"
                            text={client.primary_email}
                          />
                        </span>
                      </span>
                    </p>
                    <p className=" flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 flex items-center">
                        Phone:
                      </span>
                      <span className="mt-1">{client.primary_phone}</span>
                    </p>
                    <p className="  flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 flex items-center">
                        Address:
                      </span>
                      <span className="mt-1">{client.primary_address}</span>
                    </p>
                    <p className="flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 items-center">
                        Description:
                      </span>
                      <span className="mt-1">
                        {' '}
                        {client.business_description}
                      </span>
                    </p>
                    <p className=" flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 flex items-center">
                        Date Onboarded:
                      </span>
                      <span className="mt-1">
                        {client.date_onboarded.toDateString()}
                      </span>
                    </p>
                    <p className=" flex flex-col items-start">
                      <span className="text-muted-foreground mr-1 flex items-center whitespace-nowrap">
                        Additional Info:
                      </span>
                      <span className="mt-1"> {client.additional_info}</span>
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <div className="pt-4  ">
                      <CreateEditClientButton
                        params={params}
                        user={user as User}
                      />
                    </div>
                    <div className="  pt-4">
                      <DeleteClientButton />
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* column 2 */}

              <div className={cn(cardStyles, 'overflow-hidden')}>
                <CardHeader>
                  <CardTitle>
                    <ClientToServiceButton clientId={parseInt(clientId)} />
                  </CardTitle>
                </CardHeader>
                {/* service list here */}
                <CardContent>
                  {clientServices.length > 0 ? (
                    <ul className=" flex flex-wrap gap-2 mt-3">
                      {clientServices.map(service => (
                        <li key={service.id}>
                          <Link href={`/dashboard/services/${service.id}`}>
                            <Badge className="bg-primary py-1 px-2 bg-gray-600 dark:bg-gray-400">
                              {service.name}
                            </Badge>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No services assigned to this client.</p>
                  )}
                </CardContent>
                {/* <Separator /> */}
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {boards.map(board => (
                      <Link
                        key={board.id}
                        href={`/dashboard/projects/${board.id}`}
                      >
                        <li className=" text-muted-foreground hover:underline pb-2">
                          <strong>{board.name}</strong>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </div>
          </Suspense>
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
