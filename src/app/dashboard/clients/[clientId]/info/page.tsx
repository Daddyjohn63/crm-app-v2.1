import { getCurrentUser } from '@/lib/session';
import { getClientByIdUseCase } from '@/use-cases/clients';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@/app/util'; // Make sure to import this

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

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{client.business_name}</h1>
        <ul className="space-y-2">
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
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound();
    }
    // Handle other types of errors as needed
    throw error; // This will trigger the closest error boundary
  }
}
