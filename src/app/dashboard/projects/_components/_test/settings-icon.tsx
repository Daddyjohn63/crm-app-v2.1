'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';

interface SettingsIconProps {
  onSettingsChange: (isActive: boolean) => void;
}

export default function SettingsIcon({ onSettingsChange }: SettingsIconProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onSettingsChange(newState);
  };

  return (
    <button type="button" onClick={handleClick} aria-pressed={isActive}>
      <Settings />
    </button>
  );
}
