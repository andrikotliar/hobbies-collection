import type { FileRoutesByTo } from '~/routeTree.gen';
import { Link, useLocation } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { NEW_ITEM_ID, PAGE_LIMITS, type ListOption } from '@hobbies-collection/shared';
import { SortingPopup, type SortingParams } from '~/shared/components/modals/sorting-popup';
import { Pagination } from '~/shared/components/layout/pagination';
import type { DefaultListItem } from '~/shared/types/default-list-item';
import type { GetDeleteMutationOptions } from '~/shared/types/delete-mutation-options';
import { ConsolePageListSearch } from '~/shared/components/layout/console-page-list-search';
import { ConsolePageListContent } from '~/shared/components/layout/console-page-list-content';
import type { ConsolePageListItemRow } from '~/shared/components/layout/console-page-list-item-row';

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
} & Omit<React.ComponentProps<typeof ConsolePageListItemRow<T>>, 'data' | 'onDelete'>;

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
    <div className="relative flex flex-col gap-5 grow w-full">
      {sorting && (
        <div className="ml-auto">
          <SortingPopup
            fields={sorting.fields}
            onSorting={sorting.apply}
            defaultOrderKey={location.search.orderKey ?? sorting.fields[0].value}
            defaultOrder={location.search.order ?? 'desc'}
          />
        </div>
      )}
      {typeof onSearch === 'function' && <ConsolePageListSearch onSearch={onSearch} />}
      <div>
        {shouldShowHeader && (
          <div className="bg-slate-100 px-2.5 pt-2.5 pb-3.5">
            {onNavigateToForm && (
              <Link
                className="flex items-center gap-1 leading-px uppercase text-sm font-bold hover:text-sky-600"
                to={onNavigateToForm}
                params={{ id: NEW_ITEM_ID }}
              >
                <PlusIcon size={18} />
                <span>{createItemTitle}</span>
              </Link>
            )}
            {typeof onCreate === 'function' && (
              <button
                onClick={onCreate}
                className="flex items-center gap-1 leading-px uppercase text-sm font-bold hover:text-sky-600"
              >
                <PlusIcon size={18} />
                <span>{createItemTitle}</span>
              </button>
            )}
          </div>
        )}
        <ConsolePageListContent isFetching={isFetching} list={data?.list} {...props} />
      </div>
      {typeof onPageChange === 'function' && (
        <div>
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
