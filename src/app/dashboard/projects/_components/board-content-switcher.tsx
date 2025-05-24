'use client';

import { ListContainer } from './list-container';
import { Permission } from '@/util/auth-projects';
import { User } from '@/db/schema/base';
import { ListWithCards } from '@/use-cases/types';
import { useBoardContentToggleStore } from '@/store/boardContentToggle';
import { AddGuestUser } from './add-guest-user';

interface BoardContentSwitcherProps {
  boardId: number;
  user: User;
  lists: ListWithCards[];
  permission: Permission;
  canUseListForm: boolean;
}

export const BoardContentSwitcher = ({
  boardId,
  user,
  lists,
  permission,
  canUseListForm
}: BoardContentSwitcherProps) => {
  const { isActive } = useBoardContentToggleStore();

  return (
    <div>
      <div className="flex items-center"></div>
      {isActive ? (
        <div>
          <AddGuestUser boardId={boardId} />
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
