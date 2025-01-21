'use client';

import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { reorderListsAction, reorderCardsAction } from '../actions';
import { ListWithCards } from '@/use-cases/types';

interface ListContainerProps {
  boardId: number;
  data: ListWithCards[];
  user: User;
  permission: Permission;
  canUseListForm: boolean;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
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
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Moving lists
    if (type === 'list') {
      const reorderedLists = reorder(
        orderedData,
        source.index,
        destination.index
      );

      // Update the order property for each list
      reorderedLists.forEach((list, idx) => {
        list.order = idx;
      });

      setOrderedData(reorderedLists);

      try {
        await reorderListsAction({
          boardId,
          items: reorderedLists.map(list => ({
            id: list.id,
            order: list.order
          }))
        });
      } catch (error) {
        console.error('Failed to reorder lists:', error);
        setOrderedData(data);
      }
      return;
    }

    // Moving cards
    const newOrderedData = [...orderedData];
    const sourceList = newOrderedData.find(
      list => list.id.toString() === source.droppableId
    );
    const destList = newOrderedData.find(
      list => list.id.toString() === destination.droppableId
    );

    if (!sourceList || !destList) {
      console.error('Source or destination list not found');
      return;
    }

    // Ensure cards array exists
    if (!sourceList.cards) sourceList.cards = [];
    if (!destList.cards) destList.cards = [];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same list
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
        setOrderedData(data);
      }
    } else {
      // Moving between lists
      const [movedCard] = sourceList.cards.splice(source.index, 1);
      movedCard.listId = destList.id;
      destList.cards.splice(destination.index, 0, movedCard);

      // Update order for both lists
      sourceList.cards.forEach((card, idx) => {
        card.order = idx;
      });
      destList.cards.forEach((card, idx) => {
        card.order = idx;
      });

      setOrderedData(newOrderedData);

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
        setOrderedData(data);
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
            {orderedData.map((list, index) => (
              <ListItem
                key={list.id}
                index={index}
                data={list}
                canUseListForm={canUseListForm}
              />
            ))}
            {provided.placeholder}
            {canUseListForm && <ListForm />}
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
