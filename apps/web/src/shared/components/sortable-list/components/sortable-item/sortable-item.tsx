import { type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import styles from './styles.module.css';

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
    <div ref={setNodeRef} style={style} className={styles.sortable_item}>
      <div className={styles.item_content}>{children}</div>
      <div {...attributes} {...listeners} className={styles.handler}>
        <GripVerticalIcon />
      </div>
    </div>
  );
};
