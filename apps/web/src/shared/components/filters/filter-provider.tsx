import { useState } from 'react';
import { FilterContext, type FilterId } from '~/shared/context/filter-context';

export const FilterProvider = ({ children }: React.PropsWithChildren) => {
  const [filterId, setFilterId] = useState<FilterId | null>(null);

  return (
    <FilterContext.Provider value={{ filterId, openFilter: setFilterId }}>
      {children}
    </FilterContext.Provider>
  );
};
