import styles from './films-section.module.css';
import { AdditionalInfoSection, CurrentEvents } from './components/index.js';
import { getRouteApi } from '@tanstack/react-router';
import {
  countObjectKeys,
  buildGetFilmsListQueryOptions,
  Pagination,
  useDebouncedSearch,
  type SortingParams,
  PageHeaderFilters,
  PageGrid,
  PageTopNavigation,
  getFilmsPagesTopNavConfig,
} from '~/shared';
import { useQuery } from '@tanstack/react-query';
import type { ListOption } from '@hobbies-collection/shared';
import { TrailerWindow } from './components';
import { useMemo, useState } from 'react';
import { getYearValue } from '../../-helpers';

const routeApi = getRouteApi('/films');

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
    label: 'Collection order',
    value: 'collectionId',
    isNotSelectable: true,
  },
];

type FilmsSectionProps = {
  onToggleFilter: VoidFunction;
};

export const FilmsSection = ({ onToggleFilter }: FilmsSectionProps) => {
  const searchParams = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const { data, isFetching } = useQuery(buildGetFilmsListQueryOptions(searchParams));
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);

  const mappedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.list.map((film) => ({
      ...film,
      year: getYearValue(film),
    }));
  }, [data]);

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

  const getSortingValues = () => {
    if (searchParams.collectionId) {
      return {
        order: 'asc' as const,
        key: 'collectionId',
      };
    }

    if (searchParams.order && searchParams.orderKey) {
      return {
        order: searchParams.order,
        key: searchParams.orderKey,
      };
    }

    return {
      order: 'desc' as const,
      key: 'releaseDate',
    };
  };

  const sortingValues = getSortingValues();

  const filterCount = countObjectKeys(searchParams, ['pageIndex', 'order', 'orderKey']);

  return (
    <div className={styles.films_section}>
      <div className={styles.header}>
        <PageTopNavigation getLinks={getFilmsPagesTopNavConfig} />
        <PageHeaderFilters
          sortingFieldsConfig={sortingFields}
          onSort={handleSorting}
          onSearch={handleSearch}
          sortingValues={sortingValues}
          isSortingDisabled={searchParams.collectionId !== undefined}
          onToggleFilter={onToggleFilter}
          filterCount={filterCount}
        />
      </div>
      <CurrentEvents data={data} />
      <AdditionalInfoSection info={data?.additionalInfo} />
      <PageGrid
        itemLinkTo="/films/$id"
        data={mappedData}
        isFetching={isFetching}
        onUpcomingItemClick={(item) => setSelectedFilmId(item.id)}
      />
      <Pagination
        total={data?.total}
        onPageChange={handlePageNavigation}
        currentPageIndex={searchParams.pageIndex}
        perPageCounter={data?.pageLimit}
        totalLabel="films"
      />
      <TrailerWindow filmId={selectedFilmId} onClose={() => setSelectedFilmId(null)} />
    </div>
  );
};
