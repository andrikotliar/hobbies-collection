import styles from './pagination.module.css';
import { useMemo } from 'react';
import clsx from 'clsx';
import { buildPagination } from '~/shared';
import { PAGE_LIMITS } from '@hobbies-collection/shared';

export type PaginationProps = {
  currentPageIndex?: number;
  total?: number;
  onPageChange: (pageIndex: number) => void;
  perPageCounter?: number;
  totalLabel?: string;
};

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

export const Pagination = ({
  total = 1,
  onPageChange,
  currentPageIndex = 0,
  perPageCounter = PAGE_LIMITS.default,
  totalLabel = 'items',
}: PaginationProps) => {
  const pagesCount = Math.ceil(total / perPageCounter);
  const currentRangeEnd = getCurrentRangeEnd({ total, currentPageIndex, perPageCounter });

  const pages = useMemo(() => {
    return buildPagination(currentPageIndex + 1, Math.ceil(total / perPageCounter));
  }, [total, currentPageIndex, perPageCounter]);

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex);
    window.scrollTo(0, 0);
  };

  if (pagesCount < 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
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
