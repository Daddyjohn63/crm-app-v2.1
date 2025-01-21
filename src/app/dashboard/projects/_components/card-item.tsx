import { Card } from '@/db/schema';
import { CardWithProfile } from '@/use-cases/types';
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CardModal } from './card-modal';

interface CardItemProps {
  data: CardWithProfile;

  index: number;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(name => name[0]).join('');
  return initials;
};

export const CardItem = ({ data, index }: CardItemProps) => {
  console.log('data from card item', data);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`border-2 border-transparent hover:border-black py-2 px-3 text-sm text-black rounded-md shadow-sm ${
            isPressed ? 'bg-slate-500' : 'bg-white'
          }`}
        >
          {data.name}
          {data.assignedUserProfile?.displayName}
        </div>
      )}
    </Draggable>
  );
};
