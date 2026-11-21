import { defineCssProperties } from '~/shared/helpers/define-css-properties';
import styles from './styles.module.css';

type Props = {
  width?: string;
  height: string;
};

export const SkeletonBlock = ({ width = '100%', height }: Props) => {
  return (
    <div
      className={styles.skeleton}
      style={defineCssProperties({
        '--skeleton-block-width': width,
        '--skeleton-block-height': height,
      })}
    />
  );
};
