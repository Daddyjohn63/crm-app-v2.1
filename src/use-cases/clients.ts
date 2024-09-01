//business logic
//make sure there is a session
//call create event
//handle errors
//when it comes to editing , I need to make sure that the user is entitled to edit that client
import { ClientId } from '@/db/schema';
import { ClientInfo, UserId } from '@/use-cases/types';
import { UserSession } from './types';
import { createClient } from '@/data-access/clients';
import { createUUID } from '@/util/uuid';

//authenticatedUser will be passed when we create the server action and zsa.

export async function createClientUseCase(
  authenticatedUser: UserSession,
  newClient: ClientInfo

  // {
  //   clientId: ClientId;
  //   business_name: string;
  //   primary_address: string;
  //   primary_email: string;
  //   primary_phone: string;
  //   business_description: string;
  //   date_onboarded: Date;
  //   additional_info: string;
  // }
) {
  await createClient({ ...newClient, userId: authenticatedUser.id });
}

// export async function createClientUseCase(
//   authenticatedUser: UserSession,
//   {
//     clientId,
//     userId,
//     business_name,
//     primary_address,
//     primary_email,
//     primary_phone,
//     business_description,
//     date_onboarded,
//     additional_info
//   }: {
//     clientId: ClientId;
//     userId: authenticatedUser.id;
//     business_name: string;
//     primary_address: string;
//     primary_email: string;
//     primary_phone: string;
//     business_description: string;
//     date_onboarded: Date;
//     additional_info: string;
//   }
// );
