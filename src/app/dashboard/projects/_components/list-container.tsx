'use client';

import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorderListsAction, reorderCardsAction } from '../actions';

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

  const onDragEnd = async (result: any) => {
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

      // Trigger server action
      try {
        await reorderListsAction({
          boardId,
          items: items.map(item => ({ id: item.id, order: item.order }))
        });
      } catch (error) {
        console.error('Failed to reorder lists:', error);
        // Revert optimistic update on error
        setOrderedData(data);
      }
    }

    //User moves a card.
    if (type === 'card') {
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(
        list => list.id === Number(source.droppableId)
      );

      const destList = newOrderedData.find(
        list => list.id === Number(destination.droppableId)
      );

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

        // Trigger server action
        try {
          await reorderCardsAction({
            listId: sourceList.id,
            cards: reorderedCards.map(card => ({
              id: card.id,
              order: card.order,
              listId: sourceList.id
            }))
          });
        } catch (error) {
          console.error('Failed to reorder cards:', error);
          // Revert optimistic update on error
          setOrderedData(data);
        }
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destList.id;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // Update the order for each card in both lists
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);

        // Trigger server action for both source and destination list cards
        try {
          await reorderCardsAction({
            listId: sourceList.id,
            cards: [
              ...sourceList.cards.map(card => ({
                id: card.id,
                order: card.order,
                listId: sourceList.id
              })),
              ...destList.cards.map(card => ({
                id: card.id,
                order: card.order,
                listId: destList.id
              }))
            ]
          });
        } catch (error) {
          console.error('Failed to move card between lists:', error);
          // Revert optimistic update on error
          setOrderedData(data);
        }
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
