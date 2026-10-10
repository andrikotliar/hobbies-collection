import styles from './list.module.css';
import { FilterButton, Pagination, SortingPopup, type SortingParams } from '~/shared';
import { type DefaultListItem } from '~/routes/console/-shared';
import type { FileRoutesByTo } from '~/routeTree.gen';
import { Link, useLocation } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { NEW_ITEM_ID, PAGE_LIMITS, type ListOption } from '@hobbies-collection/shared';
import {
  ListSearch,
  type ItemRowProps,
  ListContent,
} from '~/routes/console/-shared/components/list/components';
import type { GetDeleteMutationOptions } from '~/routes/console/-shared/components/list/types';

type ListData<T extends DefaultListItem> = {
  list: T[];
  total?: number;
  pageLimit?: number;
};

type SortingProps = {
  apply: (params: SortingParams) => void;
  fields: ListOption<string>[];
};

type ListProps<T extends DefaultListItem> = {
  data: ListData<T> | undefined;
  isFetching?: boolean;
  createItemTitle?: string;
  onNavigateToForm?: keyof FileRoutesByTo;
  navigationParameter?: string;
  sorting?: SortingProps;
  filterCount?: number;
  getDeleteMutationOptions: GetDeleteMutationOptions;
  onCreate?: VoidFunction;
  onOpenMobileFilter?: VoidFunction;
  onPageChange?: (pageIndex: number) => void;
  onSearch?: (value: string) => void;
} & Omit<ItemRowProps<T>, 'data' | 'onDelete'>;

export const List = <T extends DefaultListItem>({
  data,
  isFetching = true,
  onNavigateToForm,
  createItemTitle = 'Create item',
  sorting,
  filterCount,
  onCreate,
  onOpenMobileFilter,
  onPageChange,
  onSearch,
  ...props
}: ListProps<T>) => {
  const location = useLocation();

  const shouldShowHeader = !!onNavigateToForm || !!onCreate;

  return (
    <div className={styles.list_wrapper}>
      <div className={styles.list_filters}>
        {typeof onSearch === 'function' && <ListSearch onSearch={onSearch} />}
        {sorting && (
          <SortingPopup
            fields={sorting.fields}
            onSorting={sorting.apply}
            defaultOrderKey={location.search.orderKey ?? sorting.fields[0].value}
            defaultOrder={location.search.order ?? 'desc'}
          />
        )}
        {typeof onOpenMobileFilter === 'function' && (
          <FilterButton onClick={onOpenMobileFilter} filterCount={filterCount} />
        )}
      </div>
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
