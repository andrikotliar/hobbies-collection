import { getHobbyRelatedCollectionsQueryOptions } from '~/shared/helpers/query-options/collections/get-hobby-related-collections-query-options';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TextInput } from '~/shared/components/controls/text-input';
import { Select } from '~/shared/components/controls/select';

type PartialFilters = {
  [key: string]: any;
  collectionId?: number;
};

type HobbyItemFiltersProps<T extends PartialFilters> = {
  hobbyId: string;
  onFilter: VoidFunction;
  onSearch: VoidFunction;
  search: T;
};

export const HobbyItemFilters = <T extends PartialFilters>({
  hobbyId,
  onFilter,
  onSearch,
  search,
}: HobbyItemFiltersProps<T>) => {
  const { data } = useSuspenseQuery(getHobbyRelatedCollectionsQueryOptions(hobbyId));

  return (
    <div className="flex items-center gap-5 px-5 pt-5 max-w-5xl">
      <TextInput label="Search item" onChange={onSearch} />
      <Select options={data} label="Collections" onSelect={onFilter} value={search.collectionId} />
    </div>
  );
};
