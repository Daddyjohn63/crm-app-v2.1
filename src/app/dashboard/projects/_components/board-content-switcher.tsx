'use client';

import { ListContainer } from './list-container';
import { Permission } from '@/util/auth-projects';
import { User } from '@/db/schema/base';
import { ListWithCards } from '@/use-cases/types';
import { useBoardContentToggleStore } from '@/store/boardContentToggle';

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
      <div className="flex items-center gap-4 mb-4"></div>
      {isActive ? (
        <div className="p-4 bg-gray-100 rounded text-black">
          Settings Panel (dummy content)
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
