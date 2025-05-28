import * as userManagementDb from '@/data-access/user-management';

export async function getGuestUsers() {
  return await userManagementDb.getGuestUsers();
}
