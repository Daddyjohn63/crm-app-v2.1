'use client';

import { List, User, Card } from '@/db/schema';
import { ListForm } from './list-form';
import { type Permission } from '@/util/auth-projects';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { reorderListsAction, reorderCardsAction } from '../actions';
import { ListWithCards } from '@/use-cases/types';
import { cn } from '@/lib/utils';

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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setOrderedData(data);
    }
  }, [data, isDragging]);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    console.log('Starting drag end with orderedData:', orderedData);

    const { destination, source, type } = result;
    if (!destination) {
      console.log('No destination, dropping operation');
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Dropped in same position, no action needed');
      return;
    }

    const newOrderedData = [...orderedData];
    console.log('Created newOrderedData copy:', newOrderedData);

    // Handle list reordering
    if (type === 'list') {
      console.log('Reordering list');
      const items = reorder(orderedData, source.index, destination.index);
      items.forEach((item, idx) => {
        item.order = idx;
      });
      setOrderedData(items);

      try {
        await reorderListsAction({
          boardId,
          items: items.map(list => ({
            id: list.id,
            order: list.order
          }))
        });
      } catch (error) {
        console.error('Failed to reorder lists:', error);
        setOrderedData(orderedData);
      }
      return;
    }

    // Find the source and destination lists
    const sourceList = newOrderedData.find(
      list => list.id === parseInt(source.droppableId)
    );
    const destList = newOrderedData.find(
      list => list.id === parseInt(destination.droppableId)
    );

    console.log('Source list:', sourceList);
    console.log('Destination list:', destList);

    if (!sourceList || !destList) {
      console.error('Source or destination list not found');
      return;
    }

    // Ensure cards array exists
    if (!sourceList.cards) sourceList.cards = [];
    if (!destList.cards) destList.cards = [];

    if (source.droppableId === destination.droppableId) {
      console.log('Before same-list reorder:', newOrderedData);
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
      console.log('After same-list reorder:', newOrderedData);

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
        setOrderedData(orderedData);
      }
    } else {
      console.log('Before between-lists move:', newOrderedData);
      // Moving between lists
      const [movedCard] = sourceList.cards.splice(source.index, 1);
      console.log('Moved card:', movedCard);

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
      console.log('After between-lists move:', newOrderedData);

      try {
        console.log('Sending update to server with cards:', [
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
        ]);

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
        setOrderedData(orderedData);
      }
    }
  };

  console.log('Rendering with orderedData:', orderedData);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided, snapshot) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              'flex gap-x-3 h-full',
              snapshot.isDraggingOver && 'bg-blue-300 rounded-md'
            )}
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
