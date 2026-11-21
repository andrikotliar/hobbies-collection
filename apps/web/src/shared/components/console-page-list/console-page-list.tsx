import styles from './styles.module.css';
import type { FileRoutesByTo } from '~/routeTree.gen';
import { Link, useLocation } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { NEW_ITEM_ID, PAGE_LIMITS, type ListOption } from '@hobbies-collection/shared';
import { SortingPopup, type SortingParams } from '~/shared/components/sorting-popup/sorting-popup';
import type { ItemRowProps } from './components/item-row/item-row';
import { ListSearch } from './components/list-search/list-search';
import { ListContent } from './components/list-content/list-content';
import { Pagination } from '~/shared/components/pagination/pagination';
import type { GetDeleteMutationOptions } from './types';
import type { DefaultListItem } from '~/shared/types/default-list-item';

type ListData<T extends DefaultListItem> = {
  list: T[];
  total?: number;
  pageLimit?: number;
};

type SortingConfig = {
  apply: (params: SortingParams) => void;
  fields: ListOption<string>[];
};

type ListProps<T extends DefaultListItem> = {
  data: ListData<T> | undefined;
  getDeleteMutationOptions: GetDeleteMutationOptions;
  isFetching?: boolean;
  createItemTitle?: string;
  onCreate?: VoidFunction;
  onPageChange?: (pageIndex: number) => void;
  onSearch?: (value: string) => void;
  onNavigateToForm?: keyof FileRoutesByTo;
  navigationParameter?: string;
  sorting?: SortingConfig;
} & Omit<ItemRowProps<T>, 'data' | 'onDelete'>;

export const ConsolePageList = <T extends DefaultListItem>({
  data,
  isFetching = true,
  onCreate,
  onNavigateToForm,
  createItemTitle = 'Create item',
  onPageChange,
  onSearch,
  sorting,
  ...props
}: ListProps<T>) => {
  const location = useLocation();

  const shouldShowHeader = !!onNavigateToForm || !!onCreate;

  return (
    <div className={styles.list_wrapper}>
      {sorting && (
        <div className={styles.sorting}>
          <SortingPopup
            fields={sorting.fields}
            onSorting={sorting.apply}
            defaultOrderKey={location.search.orderKey ?? sorting.fields[0].value}
            defaultOrder={location.search.order ?? 'desc'}
          />
        </div>
      )}
      {typeof onSearch === 'function' && <ListSearch onSearch={onSearch} />}
      <div>
        {shouldShowHeader && (
          <div className={styles.list_header}>
            {onNavigateToForm && (
              <Link
                className={styles.add_item_action}
                to={onNavigateToForm}
                params={{ id: NEW_ITEM_ID }}
              >
                <PlusIcon size={18} />
                <span>{createItemTitle}</span>
              </Link>
            )}
            {typeof onCreate === 'function' && (
              <button onClick={onCreate} className={styles.add_item_action}>
                <PlusIcon size={18} />
                <span>{createItemTitle}</span>
              </button>
            )}
          </div>
        )}
        <ListContent isFetching={isFetching} list={data?.list} {...props} />
      </div>
      {typeof onPageChange === 'function' && (
        <div className={styles.pagination_wrapper}>
          <Pagination
            total={data?.total ?? 0}
            perPageCounter={data?.pageLimit ?? PAGE_LIMITS.default}
            onPageChange={onPageChange}
            currentPageIndex={location.search.pageIndex ?? 0}
          />
        </div>
      )}
    </div>
  );
};
