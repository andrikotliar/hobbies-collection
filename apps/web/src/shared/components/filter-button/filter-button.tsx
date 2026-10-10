import { FilterIcon } from 'lucide-react';
import styles from './filter-button.module.css';

type FilterButtonProps = {
  onClick: VoidFunction;
  filterCount?: number;
};

export const FilterButton = ({ onClick, filterCount = 0 }: FilterButtonProps) => {
  return (
    <button className={styles.mobile_filter} onClick={onClick}>
      <FilterIcon size={20} />
      <div className={styles.mobile_filter_count}>{filterCount}</div>
    </button>
  );
};
