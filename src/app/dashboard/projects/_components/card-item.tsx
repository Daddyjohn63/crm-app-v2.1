import { CardWithProfile } from '@/use-cases/types';
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';

import { format } from 'date-fns';
import { Calendar, AlertTriangle } from 'lucide-react';
import DeleteCardButton from './delete-card-button';
import { useBoardIdParam } from '@/util/safeparam';
import { EditCardModal } from './edit-card-modal';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface CardItemProps {
  data: CardWithProfile;
  // boardId: number;
  index: number;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(name => name[0]).join('');
  return initials;
};

const getDisplayStatus = (status: string) => {
  switch (status) {
    case 'todo':
      return 'Not Started';
    case 'done':
      return 'Completed';
    default:
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-indigo-500';
    case 'in_progress':
      return 'bg-yellow-500';
    case 'done':
      return 'bg-green-500';
    case 'blocked':
      return 'bg-black';
    default:
      return 'bg-indigo-500';
  }
};

const isCardLate = (card: CardWithProfile): boolean => {
  if (!card.dueDate || card.status === 'done') return false;
  return new Date(card.dueDate) < new Date();
};

export const CardItem = ({ data, index }: CardItemProps) => {
  const boardId = useBoardIdParam();
  // console.log('data from card item', data);
  const [isPressed, setIsPressed] = useState(false);
  const isLate = isCardLate(data);

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            'border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white text-black rounded-md shadow-sm',
            snapshot.isDragging && 'card-dragging opacity-50',
            snapshot.isDragging && 'rotate-2'
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>{data.name}</p>
              <p className="rounded-full bg-indigo-500 text-white text-xs w-8 h-8 flex items-center justify-center shrink-0">
                {getInitials(data.assignedUserProfile?.displayName || '')}
              </p>
            </div>
            <div className="line-clamp-4 text-sm text-gray-500">
              {data.description}
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {data.dueDate
                  ? format(data.dueDate, 'dd/MM/yyyy')
                  : 'No due date'}
              </p>
              {/* <p className="text-xs text-gray-500">
                <span className="hidden">List ID:</span> {data.listId}
                <span className="hidden">Card ID:</span> {data.id}
              </p> */}
              <div className="flex items-center gap-1">
                <EditCardModal data={data} cardId={data.id} />
                <DeleteCardButton cardId={data.id} boardId={boardId} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs w-fit ${getStatusColor(
                  data.status
                )} text-white`}
              >
                {getDisplayStatus(data.status)}
              </Badge>
              {isLate && (
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This card is overdue</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
