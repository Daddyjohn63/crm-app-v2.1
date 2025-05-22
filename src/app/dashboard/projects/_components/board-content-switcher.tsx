'use client';

import { useState } from 'react';
import { BoardSettingsIcon } from './board-settings-icon';
import { ListContainer } from './list-container';
import { Permission } from '@/util/auth-projects';
import { User } from '@/db/schema/base';
import { ListWithCards } from '@/use-cases/types';

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
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <BoardSettingsIcon
          boardId={boardId}
          onClick={() => setShowSettings(s => !s)}
          isActive={showSettings}
        />
        {/* You can add more controls here if needed */}
      </div>
      {showSettings ? (
        <div className="p-8 border rounded bg-muted">
          Settings content goes here (dummy)
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
