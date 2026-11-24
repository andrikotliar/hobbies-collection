import { type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';

type Props = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
};

export const SortableItem = ({ children, id }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2.5 bg-white rounded-lg p-2.5 border border-slate-300"
    >
      <div className="grow">{children}</div>
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVerticalIcon />
      </div>
    </div>
  );
};
