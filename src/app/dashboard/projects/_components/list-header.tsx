'use client';
import { useState, useRef, ElementRef } from 'react';
import { List } from '@/db/schema';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { useBoardStore } from '@/store/boardStore';

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  console.log('currentBoardId', currentBoardId);
  const [title, setTitle] = useState(data.name);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <p className="w-full text-black text-sm px-2.5 py-1 h-7 font-medium border-transparent ">
          Form
        </p>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-black text-sm px-2.5 py-1 h-7 font-medium border-transparent "
        >
          {title}
        </div>
      )}
    </div>
  );
};
