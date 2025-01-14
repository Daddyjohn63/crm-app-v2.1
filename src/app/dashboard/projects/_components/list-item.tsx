'use client';

import { ListWithCards } from '@/use-cases/types';
import { ListHeader } from './list-header';
import { ElementRef, useRef, useState } from 'react';

interface ListItemProps {
  data: ListWithCards;
  index: number;
  canUseListForm: boolean;
}

export const ListItem = ({ data, index, canUseListForm }: ListItemProps) => {
  // console.log('list item', data);
  // const textareaRef = useRef<ElementRef<'textarea'>>(null);

  // const [isEditing, setIsEditing] = useState(false);

  // const disableEditing = () => {
  //   setIsEditing(false);
  // };
  // const enableEditing = () => {
  //   setIsEditing(true);
  //   setTimeout(() => {
  //     textareaRef.current?.focus();
  //   });
  // };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md py-1">
        <ListHeader
          // onAddCard={enableEditing}
          data={data}
          canUseListForm={canUseListForm}
        />
      </div>
    </li>
  );
};
