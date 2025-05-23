'use client';
import { Settings } from 'lucide-react';

import { useBoardContentToggleStore } from '@/store/boardContentToggle';

interface BoardSettingsIconProps {
  onClick?: () => void;
  isActive?: boolean;
}

export const BoardSettingsIcon = () => {
  const { isActive, toggle } = useBoardContentToggleStore();

  return (
    <button type="button" onClick={toggle} aria-pressed={isActive}>
      <Settings className="w-6 h-6 cursor-pointer transition-colors" />
    </button>
  );
};
