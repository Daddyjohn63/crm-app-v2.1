'use client';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { CardWithProfile, ListWithCards } from '@/use-cases/types';
import { ListHeader } from './list-header';
//import { ElementRef, useRef, useState } from 'react';
import { CardModal } from './card-modal';
import { ListCards } from './list-cards';
import { cn } from '@/lib/utils';
import { CardItem } from './card-item';
import { Card, List, Profile } from '@/db/schema';
import { GripVertical } from 'lucide-react';

interface ListItemProps {
  data: ListWithCards;
  index: number;
  canUseListForm: boolean;
  isDisabled?: boolean;
}

export const ListItem = ({
  data,
  index,
  canUseListForm,
  isDisabled
}: ListItemProps) => {
  //console.log('list item', data);

  return (
    <Draggable
      draggableId={data.id.toString()}
      index={index}
      isDragDisabled={isDisabled}
    >
      {(provided, snapshot) => (
        <li
          className={cn(
            'shrink-0 h-full w-[272px] select-none',
            snapshot.isDragging && 'opacity-70',
            isDisabled && 'opacity-90 cursor-not-allowed'
          )}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="w-full rounded-md bg-[#f1f2f4] shadow-md py-1 flex flex-col max-h-[calc(100vh-200px)]">
            <div className="flex items-center gap-2 px-2">
              <div
                {...provided.dragHandleProps}
                className="cursor-grab active:cursor-grabbing"
                onClick={e => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <ListHeader data={data} canUseListForm={canUseListForm} />
            </div>

            <Droppable droppableId={data.id.toString()} type="card">
              {(provided, snapshot) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2 min-h-[20px] overflow-y-auto overflow-x-hidden flex-1',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0',
                    snapshot.isDraggingOver && 'bg-blue-100 rounded-md'
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  {data.cards.map((card: CardWithProfile, index: number) => (
                    <CardItem
                      key={card.id}
                      data={card}
                      index={index}
                      isDisabled={isDisabled}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <div className="flex-shrink-0">
              <CardModal
                data={{
                  ...data.cards[0],
                  listId: data.id,
                  id: 0,
                  name: '',
                  description: '',
                  status: 'todo',
                  dueDate: null,
                  assignedTo: 0
                }}
              />
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};
