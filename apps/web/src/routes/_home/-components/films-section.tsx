import { getRouteApi } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { ListOption, SortingOrder } from '@hobbies-collection/shared';
import { FilterIcon, SearchIcon } from 'lucide-react';
import { getFilmsListQueryOptions } from '~/shared/helpers/query-options/films/get-films-list-query-options';
import { useSidebarVisibility } from '~/shared/hooks/use-sidebar-visibility';
import { useDebouncedSearch } from '~/shared/hooks/use-debounced-search';
import { SortingPopup, type SortingParams } from '~/shared/components/modals/sorting-popup';
import { countObjectKeys } from '~/shared/helpers/count-keys';
import { Pagination } from '~/shared/components/layout/pagination';
import { Navigation } from './films-page-navigation';
import { TextInput } from '~/shared/components/controls/text-input';
import { Button } from '~/shared/components/controls/button';
import { CurrentEvents } from './current-events';
import { AdditionalInfoSection } from './additional-info-section';
import { FilmsGridSkeleton } from './films-grid-skeleton';
import { FilmsGrid } from './films-grid';

type SortingValues = {
  order: SortingOrder;
  orderKey: string;
};

const routeApi = getRouteApi('/_home/');

const sortingFields: ListOption<string, { isNotSelectable?: boolean }>[] = [
  {
    label: 'Release order',
    value: 'releaseDate',
  },
  {
    label: 'Latest added',
    value: 'addedAt',
  },
  {
    label: 'Updated At',
    value: 'updatedAt',
  },
  {
    label: 'Title',
    value: 'title',
  },
  {
    label: 'Box Office',
    value: 'boxOffice',
  },
  {
    label: 'Sequence Number',
    value: 'sequenceNumber',
    isNotSelectable: true,
  },
];

export const FilmsSection = () => {
  const searchParams = routeApi.useSearch({ select: ({ filmId: _, ...params }) => params });
  const navigate = routeApi.useNavigate();
  const { data, isFetching } = useQuery(getFilmsListQueryOptions(searchParams));
  const { toggleFilter } = useSidebarVisibility('/');

  const handleSearch = useDebouncedSearch((value) => {
    if (!value.length) {
      navigate({
        search: (prev) => ({
          ...prev,
          q: undefined,
        }),
      });
      return;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        q: value,
      }),
    });
  });

  const handlePageNavigation = (pageIndex: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageIndex,
      }),
    });
  };

  const handleSorting = (sorting: SortingParams) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...sorting,
        pageIndex: 0,
      }),
    });
  };

  const getSortingValues = (): SortingValues => {
    if (searchParams.originFilmId) {
      return {
        order: 'asc',
        orderKey: 'sequenceNumber',
      };
    }

    if (searchParams.order && searchParams.orderKey) {
      return {
        order: searchParams.order,
        orderKey: searchParams.orderKey,
      };
    }

    return {
      order: 'desc',
      orderKey: 'releaseDate',
    };
  };

  const sortingValues = getSortingValues();

  const countFilter = countObjectKeys(searchParams, ['pageIndex', 'order', 'orderKey']);

  return (
    <div className="relative w-full flex flex-col gap-5 overflow-hidden">
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:flex-wrap">
        <Navigation />
        <div className="w-full md:w-auto flex justify-start items-center md:justify-end gap-2.5 grow">
          <TextInput
            icon={<SearchIcon />}
            placeholder="Search films"
            className="md:max-w-md w-full"
            onChange={handleSearch}
            isClearable
          />
          <SortingPopup
            fields={sortingFields}
            onSorting={handleSorting}
            defaultOrder={sortingValues.order}
            defaultOrderKey={sortingValues.orderKey}
            isDisabled={searchParams.orderKey === 'sequenceNumber'}
            buttonWrapperClassName="shrink-0"
          />
          <div className="relative md:hidden">
            <Button variant="light" onClick={toggleFilter} icon={<FilterIcon />}>
              <div className="size-5 text-white bg-amber-400 text-xs rounded-full leading-5 absolute -top-1.25 right-1.25">
                {countFilter}
              </div>
            </Button>
          </div>
        </div>
      </div>
      {data && (
        <>
          <CurrentEvents
            events={data.events}
            total={data.allFilmsCount}
            anniversaryPoster={data.anniversaryImagePath}
          />
          <AdditionalInfoSection info={data.additionalInfo} />
        </>
      )}
      {isFetching ? (
        <FilmsGridSkeleton />
      ) : (
        <FilmsGrid
          films={data?.list ?? []}
          shouldShowCounter={searchParams.orderKey === 'sequenceNumber'}
        />
      )}
      {data && data.total > 0 && (
        <Pagination
          total={data.total}
          onPageChange={handlePageNavigation}
          currentPageIndex={searchParams.pageIndex}
          perPageCounter={data.pageLimit}
          totalLabel="films"
          wrapperClassName="mt-auto"
        />
      )}
    </div>
  );
};
