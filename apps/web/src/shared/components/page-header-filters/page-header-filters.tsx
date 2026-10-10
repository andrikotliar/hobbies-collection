import { TextInput } from '~/shared/components/text-input/text-input';
import styles from './page-header-filters.module.css';
import { SearchIcon } from 'lucide-react';
import { SortingPopup, type SortingParams } from '~/shared/components/sorting-popup/sorting-popup';
import type { ListOption, SortingOrder } from '@hobbies-collection/shared';
import { FilterButton } from '~/shared/components/filter-button/filter-button';

type PageHeaderFiltersProps<TSortingField extends ListOption<any>> = {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilter: VoidFunction;
  onSort: (values: SortingParams) => void;
  filterCount: number;
  sortingFieldsConfig: TSortingField[];
  sortingValues: {
    order: SortingOrder;
    key: string;
  };
  isSortingDisabled?: boolean;
};

export const PageHeaderFilters = <TSortingField extends ListOption<any>>({
  onSearch,
  onToggleFilter,
  onSort,
  filterCount,
  sortingFieldsConfig,
  sortingValues,
  isSortingDisabled = false,
}: PageHeaderFiltersProps<TSortingField>) => {
  return (
    <div className={styles.page_header_filters}>
      <TextInput
        icon={<SearchIcon />}
        placeholder="Search films"
        className={styles.search}
        onChange={onSearch}
        isClearable
      />
      <SortingPopup
        fields={sortingFieldsConfig}
        onSorting={onSort}
        defaultOrder={sortingValues.order}
        defaultOrderKey={sortingValues.key}
        isDisabled={isSortingDisabled}
      />
      <FilterButton onClick={onToggleFilter} filterCount={filterCount} />
    </div>
  );
};
