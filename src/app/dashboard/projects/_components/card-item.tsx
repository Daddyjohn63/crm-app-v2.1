import { CardWithProfile } from '@/use-cases/types';
import { memo, useMemo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, AlertTriangle, GripVertical } from 'lucide-react';
import DeleteCardButton from './delete-card-button';
import { useBoardIdParam } from '@/util/safeparam';
import { EditCardModal } from './edit-card-modal';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Move utility functions outside component
const getInitials = (name: string) => {
  if (!name) return '';
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

// Memoized components for card parts
const CardHeader = memo(
  ({
    name,
    displayName,
    dragHandleProps
  }: {
    name: string;
    displayName: string | null | undefined;
    dragHandleProps: any;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <p>{name}</p>
      </div>
      <p className="rounded-full bg-indigo-500 text-white text-xs w-8 h-8 flex items-center justify-center shrink-0">
        {getInitials(displayName || '')}
      </p>
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

const CardDescription = memo(
  ({ description }: { description: string | null }) => (
    <div className="line-clamp-4 text-sm text-gray-500">
      {description || ''}
    </div>
  )
);

CardDescription.displayName = 'CardDescription';

const CardFooter = memo(
  ({
    dueDate,
    cardId,
    boardId,
    data
  }: {
    dueDate: Date | null;
    cardId: number;
    boardId: number;
    data: CardWithProfile;
  }) => (
    <div className="flex items-center justify-between gap-2">
      <p className="flex items-center gap-2 text-xs">
        <Calendar className="w-4 h-4 text-indigo-500" />
        {dueDate ? format(dueDate, 'dd/MM/yyyy') : 'No due date'}
      </p>
      <div className="flex items-center gap-1">
        <EditCardModal data={data} cardId={cardId} />
        <DeleteCardButton cardId={cardId} boardId={boardId} />
      </div>
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

const CardStatus = memo(
  ({ status, isLate }: { status: string; isLate: boolean }) => (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`text-xs w-fit ${getStatusColor(status)} text-white`}
      >
        {getDisplayStatus(status)}
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
  )
);

CardStatus.displayName = 'CardStatus';

interface CardItemProps {
  data: CardWithProfile;
  index: number;
  isDisabled?: boolean;
}

export const CardItem = memo(({ data, index, isDisabled }: CardItemProps) => {
  const boardId = useBoardIdParam();

  // Memoize expensive calculations
  const isLate = useMemo(() => isCardLate(data), [data]);
  const displayName = useMemo(
    () => data.assignedUserProfile?.displayName,
    [data.assignedUserProfile?.displayName]
  );

  return (
    <Draggable
      draggableId={data.id.toString()}
      index={index}
      isDragDisabled={isDisabled}
    >
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={cn(
            'border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white text-black rounded-md shadow-sm',
            snapshot.isDragging && 'card-dragging opacity-50',
            snapshot.isDragging && 'rotate-2',
            isDisabled && 'opacity-90 cursor-not-allowed pointer-events-none'
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <CardHeader
              name={data.name}
              displayName={displayName}
              dragHandleProps={provided.dragHandleProps}
            />
            <CardDescription description={data.description} />
            <CardFooter
              dueDate={data.dueDate}
              cardId={data.id}
              boardId={boardId}
              data={data}
            />
            <CardStatus status={data.status} isLate={isLate} />
          </div>
        </div>
      )}
    </Draggable>
  );
});

CardItem.displayName = 'CardItem';
