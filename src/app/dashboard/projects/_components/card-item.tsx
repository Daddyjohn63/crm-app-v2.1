import { Card } from '@/db/schema';
import { CardWithList } from '@/use-cases/types';
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

interface CardItemProps {
  data: Card;
  index: number;
}

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
          className={`truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm text-black rounded-md shadow-sm ${
            isPressed ? 'bg-slate-500' : 'bg-white'
          }`}
        >
          <div className="flex justify-between">
            <span>{data.name}</span>
            <span>{data.assignedTo}</span>
          </div>
          {data.description}
          {data.status}
        </div>
      )}
    </Draggable>
  );
};
