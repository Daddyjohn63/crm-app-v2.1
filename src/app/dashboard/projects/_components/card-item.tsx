import { Card } from '@/db/schema';
import { CardWithList } from '@/use-cases/types';
import { useState } from 'react';

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      role="button"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm text-black rounded-md shadow-sm ${
        isPressed ? 'bg-slate-500' : 'bg-white'
      }`}
    >
      {data.name}
    </div>
  );
};
