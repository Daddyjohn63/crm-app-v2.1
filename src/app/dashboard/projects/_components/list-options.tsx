import { List } from '@/db/schema';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { PopoverClose } from '@radix-ui/react-popover';

interface ListOptionsProps {
  onAddCard: () => void;
  data: List;
}

export const ListOptions = ({ onAddCard, data }: ListOptionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-auto p-2 hover:bg-transparent"
        >
          <MoreHorizontal className="h-4 w-4 text-slate-800" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3 bg-[#f1f2f4]"
        side="bottom"
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List Actions
        </div>
        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="h-auto w-auto p- absolute top-2 right-2 text-neutral-600 hover:bg-transparent"
          >
            <X className="h-4 w-4 " />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none text-black w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card...
        </Button>
      </PopoverContent>
    </Popover>
  );
};
