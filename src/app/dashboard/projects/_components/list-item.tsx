'use client';

import { ListWithCards } from '@/use-cases/types';
import { ListHeader } from './list-header';
//import { ElementRef, useRef, useState } from 'react';
import { CardModal } from './card-modal';
import { ListCards } from './list-cards';
import { cn } from '@/lib/utils';
import { CardItem } from './card-item';

interface ListItemProps {
  data: ListWithCards;
  index: number;
  canUseListForm: boolean;
}

export const ListItem = ({ data, index, canUseListForm }: ListItemProps) => {
  console.log('list item', data);
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
        <ListHeader data={data} canUseListForm={canUseListForm} />
        <ol
          className={cn(
            'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
            data.cards.length > 0 ? 'mt-2' : 'mt-0'
          )}
        >
          {data.cards.map((card, index) => (
            <CardItem key={card.id} data={card} index={index} />
          ))}
        </ol>
        <CardModal data={data} />
      </div>
    </li>
  );
};
