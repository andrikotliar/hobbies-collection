import { useState } from 'react';
import { ConfirmModal } from '~/shared/components/modals/confirm-modal';
import { Panel } from '~/shared/components/panel/panel';
import { useMutation } from '@tanstack/react-query';
import type { DefaultListItem } from '~/shared/types/default-list-item';
import type { GetDeleteMutationOptions } from '~/shared/types/delete-mutation-options';
import { ConsolePageListSkeleton } from '~/shared/components/console-page-list-skeleton';
import { ConsolePageListItemRow } from '~/shared/components/console-page-list-item-row';

type Props<T extends DefaultListItem> = {
  list?: T[];
  isFetching: boolean;
  getDeleteMutationOptions: GetDeleteMutationOptions;
} & Omit<React.ComponentProps<typeof ConsolePageListItemRow<T>>, 'data' | 'onDelete'>;

const placeholderClassName = 'flex items-center justify-center text-gray-600 text-sm p-12.5';

export const ConsolePageListContent = <T extends DefaultListItem>({
  list,
  isFetching,
  getDeleteMutationOptions,
  ...props
}: Props<T>) => {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const { mutateAsync: onDelete, isPending: isDeletingInProgress } = useMutation(
    getDeleteMutationOptions(),
  );

  const handleDeleteItem = async (data: T) => {
    await onDelete(data.id);
    setItemToDelete(null);
  };

  if (isFetching) {
    return <ConsolePageListSkeleton />;
  }

  if (!list) {
    return <div className={placeholderClassName}>No items found</div>;
  }

  return (
    <Panel hasPaddings={false}>
      {list.length === 0 && <div className={placeholderClassName}>No items found</div>}
      {list.map((item) => (
        <ConsolePageListItemRow key={item.id} data={item} onDelete={setItemToDelete} {...props} />
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
