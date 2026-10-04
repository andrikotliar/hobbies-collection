import { Link } from '@tanstack/react-router';
import { GridItemsNotFound, GridSkeleton } from '~/shared/components/page-grid/components';
import styles from './page-grid.module.css';
import type { FileRoutesByTo } from '~/routeTree.gen';
import { getExternalImageUrl } from '~/shared/helpers';
import { Image } from '~/shared/components/image/image';

type GenericItem = {
  [key: string]: any;
  id: number;
  title: string;
  imagePath?: string | null;
  sequenceNum?: number;
  year: string | number;
  upcoming?: boolean;
};

type PageGridProps<TData extends GenericItem> = {
  data: TData[];
  isFetching: boolean;
  itemLinkTo: keyof FileRoutesByTo;
  onUpcomingItemClick?: (item: TData) => void;
};

const ItemComponent = <TData extends GenericItem>({
  item,
  itemLinkTo,
  children,
  onUpcomingItemClick,
}: Pick<PageGridProps<TData>, 'itemLinkTo' | 'onUpcomingItemClick'> & {
  item: TData;
  children?: React.ReactNode;
}) => {
  if (item.upcoming && onUpcomingItemClick) {
    return (
      <button className={styles.grid_item} onClick={() => onUpcomingItemClick(item)}>
        {children}
      </button>
    );
  }

  return (
    <Link to={itemLinkTo} className={styles.grid_item} params={{ id: item.id }}>
      {children}
    </Link>
  );
};

export const PageGrid = <TData extends GenericItem>({
  data,
  isFetching,
  itemLinkTo,
}: PageGridProps<TData>) => {
  if (isFetching) {
    return <GridSkeleton />;
  }

  if (!data.length) {
    return <GridItemsNotFound />;
  }

  return (
    <div className={styles.grid}>
      {data.map((item) => (
        <ItemComponent itemLinkTo={itemLinkTo} item={item} key={item.id}>
          <div className={styles.cover}>
            {item.sequenceNum && <div className={styles.counter}>{item.sequenceNum}</div>}
            {item.upcoming && <div className={styles.upcoming}>Upcoming</div>}
            <Image src={getExternalImageUrl(item.imagePath)} alt={item.title} />
          </div>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.year}>{item.year}</p>
        </ItemComponent>
      ))}
    </div>
  );
};
