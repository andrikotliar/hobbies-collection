import { PageTitle, getPluralWord } from '~/shared';
import styles from './hobby-title.module.css';

type HobbyTitleProps = {
  children?: React.ReactNode;
  imagePath?: string | null;
  total: number;
};

export const HobbyTitle = ({ children, total = 0 }: HobbyTitleProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div>
          <PageTitle>{children}</PageTitle>
          <div>
            {total} {getPluralWord('item', total)}
          </div>
        </div>
      </div>
    </div>
  );
};
