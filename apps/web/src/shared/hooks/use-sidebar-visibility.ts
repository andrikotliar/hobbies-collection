import type { FilterId } from '~/shared/context/filter-context';
import { useFilterContext } from '~/shared/hooks/use-filter-context';

export const useSidebarVisibility = (filterId: FilterId) => {
  const { filterId: filterIdContextValue, openFilter } = useFilterContext();
  const toggleFilter = () => {
    const isOpen = filterId === filterIdContextValue;
    openFilter(isOpen ? null : filterId);
  };

  const hideFilter = () => {
    openFilter(null);
  };

  return {
    isFilterOpen: filterIdContextValue === filterId,
    toggleFilter,
    hideFilter,
  };
};
