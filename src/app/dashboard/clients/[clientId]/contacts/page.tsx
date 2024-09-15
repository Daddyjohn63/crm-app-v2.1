import CreateEditContactButton from '@/app/dashboard/create-edit-contact-button';
import { NotFoundError } from '@/app/util';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/session';
import { getClientByIdUseCase } from '@/use-cases/clients';
import { notFound } from 'next/navigation';
import { columns, Payment } from './columns';
import { DataTable } from '@/components/data-table';

const data: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com'
  },
  {
    id: '728ed52f',
    amount: 1000,
    status: 'pending',
    email: 'a@example.com'
  }
  // ...
];

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
      <div className="container  mx-auto px-4  md:px-2 py-6 w-full">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-2xl font-bold mb-4 line-clamp-1">
              Client Contacts
            </CardTitle>
            <CreateEditContactButton />
          </CardHeader>
          <CardContent>
            <DataTable filterKey="email" columns={columns} data={data} />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound();
    }
  }
}
