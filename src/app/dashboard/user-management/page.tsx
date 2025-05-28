import { PageHeader } from '@/components/page-header';
import { pageTitleStyles } from '@/styles/common';
import CreateGuestUserButton from './_components/create-guest-user-button';
import { guestUserColumns } from './_components/columns';
import { AddGuestUser } from './_components/add-guest-user';
import { getGuestUsers, getAllBoards } from '@/use-cases/user-management';
import { Card } from '@/components/ui/card';

const UserManagementPage = async () => {
  // Fetch guest users and boards here
  const guestUsers = await getGuestUsers();
  const boards = await getAllBoards();
  console.log('[UserManagementPage] guestUsers:', guestUsers);
  console.log('[UserManagementPage] boards:', boards);
  return (
    <>
      <PageHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col gap-4 mb-4 md:mb-0 w-full">
            <h1
              className={`${pageTitleStyles} text-2xl sm:text-3xl md:text-4xl`}
            >
              {/* User Management */}
            </h1>
            {/* <div>
              <CreateGuestUserButton />
            </div> */}
            <div className="rounded-lg w-full">
              <Card className="border-none drop-shadow-sm w-full">
                <AddGuestUser initialGuestUsers={guestUsers} boards={boards} />
              </Card>
            </div>
          </div>
        </div>
      </PageHeader>
    </>
  );
};

export default UserManagementPage;
