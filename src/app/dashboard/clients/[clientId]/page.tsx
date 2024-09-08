import { redirect } from 'next/navigation';

export default function ClientPage({
  params
}: {
  params: { clientId: string };
}) {
  redirect(`/dashboard/clients/${params.clientId}/info`);
}
