import styles from './styles.module.css';
import { useMemo } from 'react';
import clsx from 'clsx';
import { buildPagination } from '~/shared/helpers/build-pagination';

type RangeParams = {
  currentPageIndex: number;
  total: number;
  perPageCounter: number;
};

const getCurrentRangeEnd = ({ currentPageIndex, total, perPageCounter }: RangeParams) => {
  if (total >= perPageCounter) {
    const value = (currentPageIndex + 1) * perPageCounter;

    if (value > total) {
      return total;
    }

    return value;
  }

  return total;
};

type Props = {
  currentPageIndex?: number;
  total: number;
  onPageChange: (pageIndex: number) => void;
  perPageCounter: number;
  totalLabel?: string;
  wrapperClassName?: string;
};

export const Pagination = ({
  total,
  onPageChange,
  currentPageIndex = 0,
  perPageCounter,
  totalLabel = 'items',
  wrapperClassName,
}: Props) => {
  const pagesCount = Math.ceil(total / perPageCounter);
  const currentRangeEnd = getCurrentRangeEnd({ total, currentPageIndex, perPageCounter });

  const pages = useMemo(() => {
    return buildPagination(currentPageIndex + 1, Math.ceil(total / perPageCounter));
  }, [total, currentPageIndex, perPageCounter]);

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex);
    window.scrollTo(0, 0);
  };

  return (
    <div className={clsx(styles.pagination, wrapperClassName)}>
      {pagesCount > 1 && (
        <div className={styles.pages}>
          {pages.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <div className={styles.dots} key={index}>
                  {page}
                </div>
              );
            }

            return (
              <button
                className={clsx(styles.page_button, {
                  [styles.active]: currentPageIndex + 1 === page,
                })}
                key={index}
                onClick={() => handlePageChange(page - 1)}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
      {total > 0 && (
        <div className={styles.stats}>
          <span className={styles.current_state}>
            {currentPageIndex * perPageCounter + 1} - {currentRangeEnd}
          </span>
          <span>/</span>
          <span>
            {total} {totalLabel}
          </span>
        </div>
      )}
    </div>
  );
};
