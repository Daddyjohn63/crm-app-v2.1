'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

interface EditableFieldProps {
  initialValue: string;
  onSave: (field: string, newValue: string) => Promise<void>;
  field: string;
  label: string;
  inputType?: string;
}

export function EditableField({
  initialValue,
  onSave,
  field,
  label,
  inputType = 'text'
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(field, value);
      setIsEditing(false);
    } catch (error) {
      console.error(`Failed to save ${label}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          type={inputType}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="text-lg"
        />
        <Button onClick={handleSave} disabled={isLoading}>
          <CheckIcon className="w-4 h-4" />
        </Button>
        <Button onClick={() => setIsEditing(false)} variant="outline">
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg">{value}</span>
      <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
        <PencilIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
