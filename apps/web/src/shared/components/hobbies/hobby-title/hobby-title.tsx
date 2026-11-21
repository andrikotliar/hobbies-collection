import { PageTitle } from '~/shared/components/page-title/page-title';
import styles from './styles.module.css';
import { getPluralWord } from '~/shared/helpers/get-plural-word';

type Props = {
  children?: React.ReactNode;
  imagePath?: string | null;
  total: number;
};

export const HobbyTitle = ({ children, total = 0 }: Props) => {
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
