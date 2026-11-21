import { SkeletonBlock } from '~/shared/components/skeleton-block/skeleton-block';
import styles from './styles.module.css';
import { Panel } from '~/shared/components/panel/panel';

export const ListSkeleton = () => {
  return (
    <Panel hasPaddings={false}>
      {Array.from({ length: 30 }, (_, index) => (
        <div key={index} className={styles.row}>
          <SkeletonBlock width="50%" height="20px" />
          <div className={styles.left}>
            <SkeletonBlock width="20px" height="20px" />
            <SkeletonBlock width="20px" height="20px" />
          </div>
        </div>
      ))}
    </Panel>
  );
};
