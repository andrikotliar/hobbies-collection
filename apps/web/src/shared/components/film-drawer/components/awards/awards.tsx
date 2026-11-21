import type { ApiResponse } from '~/shared/types/extract-params';
import { Award } from './components/award/award';
import styles from './styles.module.css';
import type { api } from '~/shared/services/api';

type Awards = ApiResponse<typeof api.films.getById>['awards'];

type Props = {
  data: Awards;
};

export const Awards = ({ data }: Props) => {
  return (
    <div className={styles.awards}>
      <div className={styles.title}>Awards</div>
      {data.map((award) => (
        <Award data={award} key={award.award.id} />
      ))}
    </div>
  );
};
