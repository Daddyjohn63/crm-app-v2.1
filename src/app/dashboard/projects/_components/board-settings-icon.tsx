'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';

interface BoardSettingsIconProps {
  boardId: number;
  onClick?: () => void;
  isActive?: boolean;
}

export const BoardSettingsIcon = ({
  boardId,
  onClick,
  isActive
}: BoardSettingsIconProps) => {
  const icon = (
    <Settings
      className={`w-6 h-6 cursor-pointer transition-colors ${isActive ? 'text-primary' : ''}`}
    />
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={isActive}>
        {icon}
      </button>
    );
  }
  return <Link href={`/dashboard/projects/${boardId}/settings`}>{icon}</Link>;
};
