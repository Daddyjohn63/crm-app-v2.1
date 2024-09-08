import { getCurrentUser } from '@/lib/session';

export default async function ClientInfoPage({
  params
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const user = await getCurrentUser();

  //do i check if the user is the owner of the client?
  //do i check if the user is an admin?
}
