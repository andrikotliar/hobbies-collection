import styles from './styles.module.css';
import { ItemRow, type ItemRowProps } from '../item-row/item-row';
import { useState } from 'react';
import { ConfirmModal } from '~/shared/components/confirm-modal/confirm-modal';
import { Panel } from '~/shared/components/panel/panel';
import { useMutation } from '@tanstack/react-query';
import { ListSkeleton } from '../list-skeleton/list-skeleton';
import type { DefaultListItem } from '~/shared/types/default-list-item';
import type { GetDeleteMutationOptions } from '~/shared/components/console-page-list/types';

type ListContentProps<T extends DefaultListItem> = {
  list?: T[];
  isFetching: boolean;
  getDeleteMutationOptions: GetDeleteMutationOptions;
} & Omit<ItemRowProps<T>, 'data' | 'onDelete'>;

export const ListContent = <T extends DefaultListItem>({
  list,
  isFetching,
  getDeleteMutationOptions,
  ...props
}: ListContentProps<T>) => {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const { mutateAsync: onDelete, isPending: isDeletingInProgress } = useMutation(
    getDeleteMutationOptions(),
  );

  const handleDeleteItem = async (data: T) => {
    await onDelete(data.id);
    setItemToDelete(null);
  };

  if (isFetching) {
    return <ListSkeleton />;
  }

  if (!list) {
    return <div className={styles.placeholder}>No items found</div>;
  }

  return (
    <Panel hasPaddings={false}>
      {list.length === 0 && <div className={styles.placeholder}>No items found</div>}
      {list.map((item) => (
        <ItemRow key={item.id} data={item} onDelete={setItemToDelete} {...props} />
      ))}
      <ConfirmModal
        data={itemToDelete}
        onConfirm={handleDeleteItem}
        onClose={() => setItemToDelete(null)}
        confirmButtonTitle="Delete"
        confirmButtonVariant="danger"
        isPending={isDeletingInProgress}
      />
    </Panel>
  );
};
