import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';

interface ListContainerProps {
  boardId: number;
  data: (List & { cards: Card[] })[];
  user: User;
  permission: Permission;
  canUseListForm: boolean;
}

export const ListContainer = ({
  boardId,
  data,
  user,
  permission,
  canUseListForm
}: ListContainerProps) => {
  // console.log(data);
  return (
    <div className="flex gap-4  overflow-x-auto">
      <ol>
        {canUseListForm && <ListForm />}
        <div className="flex-shrink-0 w-1" />
      </ol>
      {/* {data.map(list => (
        <div
          key={list.id}
          className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px]"
        >
          <h2 className="font-semibold text-black text-lg mb-4">{list.name}</h2>
          <div className="space-y-2">
            {list.cards?.map(card => (
              <div key={card.id} className="bg-black rounded-lg p-3 shadow-sm">
                <h3 className="font-medium">{card.name}</h3>
                {card.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                )}
                {card.dueDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(card.dueDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {card.status}
                  </span>
                  {card.estimatedMinutes && (
                    <span className="text-xs text-gray-500">
                      Est: {card.estimatedMinutes}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))} */}
    </div>
  );
};
