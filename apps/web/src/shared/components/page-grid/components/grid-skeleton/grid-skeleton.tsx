import { SkeletonBlock } from '~/shared';
import styles from './grid-skeleton.module.css';

export const GridSkeleton = () => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 48 }, (_, index) => (
        <div className={styles.item} key={index}>
          <SkeletonBlock width="100%" height="100%" />
        </div>
      ))}
    </div>
  );
};
