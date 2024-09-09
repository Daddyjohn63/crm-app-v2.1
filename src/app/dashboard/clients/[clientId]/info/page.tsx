import { getCurrentUser } from '@/lib/session';
import {
  getClientByIdUseCase,
  updateClientFieldUseCase
} from '@/use-cases/clients';
import { EditableField } from '@/components/EditableField';
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

  const handleSaveField = async (field: string, newValue: string) => {
    'use server';
    await updateClientFieldUseCase(user, parseInt(clientId), field, newValue);
  };

  try {
    const client = await getClientByIdUseCase(user, parseInt(clientId));

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Client Information</h1>
        <ul className="space-y-4">
          <li>
            <strong>Business Name:</strong>{' '}
            <EditableField
              initialValue={client.business_name}
              onSave={handleSaveField}
              field="business_name"
              label="Business Name"
            />
          </li>
          <li>
            <strong>Email:</strong>{' '}
            <EditableField
              initialValue={client.primary_email}
              onSave={handleSaveField}
              field="primary_email"
              label="Email"
              inputType="email"
            />
          </li>
          <li>
            <strong>Phone:</strong>{' '}
            <EditableField
              initialValue={client.primary_phone}
              onSave={handleSaveField}
              field="primary_phone"
              label="Phone"
              inputType="tel"
            />
          </li>
          <li>
            <strong>Address:</strong>{' '}
            <EditableField
              initialValue={client.primary_address}
              onSave={handleSaveField}
              field="primary_address"
              label="Address"
            />
          </li>
          <li>
            <strong>Description:</strong>{' '}
            <EditableField
              initialValue={client.business_description}
              onSave={handleSaveField}
              field="business_description"
              label="Description"
            />
          </li>
          <li>
            <strong>Date Onboarded:</strong>{' '}
            {client.date_onboarded.toDateString()}
          </li>
          <li>
            <strong>Additional Info:</strong>{' '}
            <EditableField
              initialValue={client.additional_info}
              onSave={handleSaveField}
              field="additional_info"
              label="Additional Info"
            />
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
