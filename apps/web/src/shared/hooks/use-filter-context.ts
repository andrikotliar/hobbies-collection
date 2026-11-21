import { useContext } from 'react';
import { FilterContext } from '~/shared/context/filter-context';

export const useFilterContext = () => useContext(FilterContext);
