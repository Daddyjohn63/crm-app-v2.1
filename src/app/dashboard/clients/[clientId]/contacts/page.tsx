import CreateEditContactButton from '@/app/dashboard/create-edit-contact-button';
import { NotFoundError } from '@/app/util';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { getClientByIdUseCase } from '@/use-cases/clients';
import { notFound } from 'next/navigation';

export default async function ContactsPage({
  params
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  console.log('CLIENT ID', clientId);
  console.log('Type of CLIENT ID:', typeof clientId);
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  try {
    const client = await getClientByIdUseCase(user, parseInt(clientId));
    return (
      <>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">
          <h1 className="text-2xl font-bold mb-4">Client Contacts</h1>
          <CreateEditContactButton
            clientId={client.id}
            user={{ id: user.id }}
          />
        </div>
      </>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound();
    }
  }
}
