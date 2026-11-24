import styles from './styles.module.css';
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
import { Navigation } from './components/navigation/navigation';
import { TextInput } from '~/shared/components/text-input';
import { Button } from '~/shared/components/controls/button';
import { CurrentEvents } from './components/current-events/current-events';
import { AdditionalInfoSection } from './components/additional-info-section/additional-info-section';
import { FilmsGridSkeleton } from './components/films-grid-skeleton/films-grid-skeleton';
import { FilmsGrid } from './components/films-grid/films-grid';

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
    <div className={styles.films_section}>
      <div className={styles.header}>
        <Navigation />
        <div className={styles.controls}>
          <TextInput
            icon={<SearchIcon />}
            placeholder="Search films"
            className={styles.search}
            onChange={handleSearch}
            isClearable
          />
          <SortingPopup
            fields={sortingFields}
            onSorting={handleSorting}
            defaultOrder={sortingValues.order}
            defaultOrderKey={sortingValues.orderKey}
            isDisabled={searchParams.orderKey === 'sequenceNumber'}
            buttonWrapperClassName={styles.sorting}
          />
          <div className={styles.mobile_filter}>
            <Button variant="light" onClick={toggleFilter} icon={<FilterIcon />}>
              <div className={styles.mobile_filter_count}>{countFilter}</div>
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
          wrapperClassName={styles.pagination_wrapper}
        />
      )}
    </div>
  );
};
