import styles from './styles.module.css';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

type Props = {
  isFullPage?: boolean;
  size?: number;
  shouldInheritColor?: boolean;
};

export const Loader = ({ isFullPage = false, size = 60, shouldInheritColor = false }: Props) => {
  return (
    <div
      className={clsx(styles.loader_container, {
        [styles.full_page]: isFullPage,
      })}
    >
      <LoaderCircle
        className={clsx(styles.loader, {
          [styles.default_color]: !shouldInheritColor,
        })}
        size={size}
      />
    </div>
  );
};
