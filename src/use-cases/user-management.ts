import * as userManagementDb from '@/data-access/user-management';

export async function getGuestUsers() {
  return await userManagementDb.getGuestUsers();
}

export async function getAllBoards() {
  return await userManagementDb.getAllBoards();
}
