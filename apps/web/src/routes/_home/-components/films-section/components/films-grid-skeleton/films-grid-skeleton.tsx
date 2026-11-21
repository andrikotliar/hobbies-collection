import styles from './styles.module.css';
import { PageTitle } from '~/shared/components/page-title/page-title';
import { SkeletonBlock } from '~/shared/components/skeleton-block/skeleton-block';

export const FilmsGridSkeleton = () => {
  return (
    <>
      <div>
        <PageTitle>Films Collection</PageTitle>
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 48 }, (_, index) => (
          <div className={styles.item} key={index}>
            <SkeletonBlock width="100%" height="100%" />
          </div>
        ))}
      </div>
    </>
  );
};
