'use client';

import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';

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
  //one source of truth for drag and drop 'optimistic' updates.
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => {
        return <ListItem key={list.id} index={index} data={list} />;
      })}

      {canUseListForm && <ListForm />}
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};
