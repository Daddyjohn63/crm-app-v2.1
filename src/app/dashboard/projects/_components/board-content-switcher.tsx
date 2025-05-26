'use client';

import { ListContainer } from './list-container';
import { Permission } from '@/util/auth-projects';
import { User } from '@/db/schema/base';
import { ListWithCards } from '@/use-cases/types';
import { useBoardContentToggleStore } from '@/store/boardContentToggle';
import { AddGuestUser } from './add-guest-user';
import type { AddGuestUser as AddGuestUserType } from '@/db/schema/projects';

interface BoardContentSwitcherProps {
  boardId: number;
  user: User;
  lists: ListWithCards[];
  permission: Permission;
  canUseListForm: boolean;
  guestUsers: AddGuestUserType[];
}

export const BoardContentSwitcher = ({
  boardId,
  user,
  lists,
  permission,
  canUseListForm,
  guestUsers
}: BoardContentSwitcherProps) => {
  const { isActive } = useBoardContentToggleStore();

  return (
    <div>
      <div className="flex items-center"></div>
      {isActive ? (
        <div>
          <AddGuestUser boardId={boardId} initialGuestUsers={guestUsers} />
        </div>
      ) : (
        <ListContainer
          boardId={boardId}
          data={lists}
          user={user}
          permission={permission}
          canUseListForm={canUseListForm}
        />
      )}
    </div>
  );
};
