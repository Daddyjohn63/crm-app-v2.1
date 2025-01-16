'use client';

import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

interface ListContainerProps {
  boardId: number;
  data: (List & { cards: Card[] })[];
  user: User;
  permission: Permission;
  canUseListForm: boolean;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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
  console.log('orderedData', orderedData);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    //extract what we need.
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }

    //Dropped in the same position.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //User moves a list.
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      // console.log('items', items);
      //TODO: trigger server action.
    }

    //User moves a card.
    if (type === 'card') {
      let newOrderedData = [...orderedData];
      console.log('newOrderedData', newOrderedData);

      const sourceList = newOrderedData.find(
        list => list.id === Number(source.droppableId)
      );
      console.log('sourceList', sourceList);

      const destList = newOrderedData.find(
        list => list.id === Number(destination.droppableId)
      );
      console.log('destList', destList);

      if (!sourceList || !destList) {
        return;
      }
      // Check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      //Moving the card in the same list.
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        //TODO: trigger server action.
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {provided => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                  canUseListForm={canUseListForm}
                />
              );
            })}
            {provided.placeholder}
            {canUseListForm && <ListForm />}
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
