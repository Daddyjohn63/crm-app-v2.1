import { redirect } from 'next/navigation';

export default async function ClientPage(
  props: {
    params: Promise<{ clientId: string }>;
  }
) {
  const params = await props.params;
  redirect(`/dashboard/clients/${params.clientId}/info`);
}
