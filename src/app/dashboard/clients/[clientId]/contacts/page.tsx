import { NotFoundError } from '@/app/util';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/session';
import { getClientByIdUseCase } from '@/use-cases/clients';
import { notFound } from 'next/navigation';
import { columns, Contacts } from './columns';
import { DataTable } from '@/components/data-table';
import { getContactsByClientIdUseCase } from '@/use-cases/contacts';
import CreateContactButton from './create-contact-button';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import CreateEditContactForm from './create-edit-contact-form';

export default async function ContactsPage({
  params
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  //console.log('CLIENT ID', clientId);
  //console.log('Type of CLIENT ID:', typeof clientId);
  const user = await getCurrentUser();
  // console.log('USER FROM CONTACTS PAGE', user);
  //.log('TYPE OF USER', typeof user);

  if (!user) {
    return notFound();
  }

  try {
    //get the contacts for a client id.
    const contacts = await getContactsByClientIdUseCase(
      user,
      parseInt(clientId)
    );
    //console.log('CONTACTS FROM CONTACTS PAGE', contacts);
    const data = contacts.map(contact => ({
      id: contact.id,
      last_name: contact.last_name,
      first_name: contact.first_name,
      job_title: contact.job_title,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      city: contact.city,
      county: contact.county,
      postcode: contact.postcode,
      country: contact.country
    }));

    // const client = await getClientByIdUseCase(user, parseInt(clientId));
    // console.log('CLIENT FROM CONTACTS PAGE', client);

    return (
      <>
        <div className="container  mx-auto px-4  md:px-2 py-6 w-full">
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="text-2xl font-bold mb-4 line-clamp-1">
                Client Contacts
              </CardTitle>
              <CreateContactButton />
            </CardHeader>
            <CardContent>
              <DataTable
                filterKey="last_name"
                columns={columns}
                data={data}
                disableDeleteButton={false}
                clientId={clientId}
                user={user}
              />
            </CardContent>
          </Card>
        </div>
        <ContactsOverlay />
      </>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound();
    }
  }
}

export function ContactsOverlay() {
  return (
    <ZustandInteractiveOverlay
      title="Edit Contact"
      description="Edit the details of the contact"
      form={<CreateEditContactForm />}
    />
  );
}
