import { getCurrentUser } from '@/lib/session';
import {
  getClientByIdUseCase,
  getServicesByClientIdUseCase
} from '@/use-cases/clients';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@/app/util';
import { CreateEditClientButton } from '@/app/dashboard/create-client-button';
import { User } from '@/db/schema';
import { DeleteClientButton } from '@/app/dashboard/delete-client-button';
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
import ClientToServiceButton from '../../components/add-client-service-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

//TO-DO: DO I NEED TO HAVE 'FORCE-DYNAMIC ON THIS PAGE?
export const dynamic = 'force-dynamic'; // This ensures the page is always up-to-date

export default async function ClientInfoPage({
  params
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  try {
    const client = await getClientByIdUseCase(user, parseInt(clientId));
    const clientServices = await getServicesByClientIdUseCase(
      parseInt(clientId)
    );

    return (
      <>
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
                    <strong>Business Name:</strong> {client.business_name}
                  </li>
                  <li>
                    <strong>Email:</strong> {client.primary_email}
                  </li>
                  <li>
                    <strong>Phone:</strong> {client.primary_phone}
                  </li>
                  <li>
                    <strong>Address:</strong> {client.primary_address}
                  </li>
                  <li>
                    <strong>Description:</strong> {client.business_description}
                  </li>
                  <li>
                    <strong>Date Onboarded:</strong>{' '}
                    {client.date_onboarded.toDateString()}
                  </li>
                  <li>
                    <strong>Additional Info:</strong> {client.additional_info}
                  </li>
                </ul>
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
                  <ul className=" flex flex-wrap gap-2">
                    {clientServices.map(service => (
                      <li key={service.id}>
                        <Link href={`/dashboard/services/${service.id}`}>
                          <Badge className="bg-yellow-400">
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
              <Separator />
              <CardHeader>
                <CardTitle>Reminders Here</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <strong>Service 1:</strong> Reminder 1
                  </li>
                  <li>
                    <strong>Service 2:</strong> Reminder 2
                  </li>
                  <li>
                    <strong>Service 3:</strong> Reminder 3
                  </li>
                </ul>
              </CardContent>
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
