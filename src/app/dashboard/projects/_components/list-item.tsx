'use client';
import { Draggable, Droppable } from '@hello-pangea/dnd';
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
  //console.log('list item', data);

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {provided => (
        <li
          className="shrink-0 h-full w-[272px] select-none"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="w-full rounded-md bg-[#f1f2f4] shadow-md py-1">
            <div {...provided.dragHandleProps}>
              <ListHeader data={data} canUseListForm={canUseListForm} />
            </div>

            <Droppable droppableId={data.id.toString()} type="card">
              {(provided, snapshot) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2 min-h-[20px]',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0',
                    snapshot.isDraggingOver && 'bg-blue-100 rounded-md'
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem key={card.id} data={card} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardModal data={data} />
          </div>
        </li>
      )}
    </Draggable>
  );
};
