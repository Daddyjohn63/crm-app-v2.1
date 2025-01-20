import { Card } from '@/db/schema';
import { CardWithList, CardWithProfile } from '@/use-cases/types';
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

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
          <div className="flex gap-4 justify-between">
            <span className="truncate">{data.name}</span>
            <span className="text-xs bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
              {getInitials(data.assignedUserProfile?.displayName || '')}
            </span>
          </div>

          {data.status}
        </div>
      )}
    </Draggable>
  );
};
