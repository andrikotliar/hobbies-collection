import { closestCenter, DndContext, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

type ListItem = {
  id: UniqueIdentifier;
  [key: string]: unknown;
};

type SortableListProps<T extends ListItem> = {
  items: T[];
  onDragEnd: (event: DragEndEvent) => void;
  children?: React.ReactNode;
};

export const SortableList = <T extends ListItem>({
  items,
  children,
  onDragEnd,
}: SortableListProps<T>) => {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

SortableList.Item = SortableItem;
