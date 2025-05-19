import { NotFoundError } from '@/app/util';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assertAuthenticated } from '@/lib/session';
import { notFound } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { getContactsByClientIdUseCase } from '@/use-cases/contacts';
import CreateContactButton from './create-contact-button';
import { ContactsOverlay } from './contacts-overlay';

export default async function ContactsPage(
  props: {
    params: Promise<{ clientId: string }>;
  }
) {
  const params = await props.params;
  const { clientId } = params;
  const user = await assertAuthenticated();

  if (!user) {
    return notFound();
  }

  try {
    const contacts = await getContactsByClientIdUseCase(
      user,
      parseInt(clientId)
    );
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
