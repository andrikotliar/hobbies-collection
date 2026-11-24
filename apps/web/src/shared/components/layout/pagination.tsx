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
    <div
      className={clsx(
        'flex justify-between items-center flex-wrap gap-7.5 w-full',
        wrapperClassName,
      )}
    >
      {pagesCount > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {pages.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <div className="mt-auto text-xl text-gray-600 select-none" key={index}>
                  {page}
                </div>
              );
            }

            return (
              <button
                className={clsx(
                  'text-gray-600 border border-slate-300 size-9 rounded-md bg-white transition-colors cursor-pointer hover:text-black hover:bg-gray-100',
                  {
                    'text-white bg-sky-600 border-sky-600': currentPageIndex + 1 === page,
                  },
                )}
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
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <span className="text-sky-600">
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
