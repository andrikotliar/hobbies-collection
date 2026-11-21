import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getPluralWord } from '~/shared/helpers/get-plural-word';
import { RouterLink } from '~/shared/components/router-link/router-link';

type Props = {
  data: ApiResponse<typeof api.films.getById>['awards'][number];
};

export const Award = ({ data }: Props) => {
  return (
    <div className={styles.award}>
      <Link className={styles.header} to="/" search={{ awardId: data.award.id }}>
        <div className={styles.title}>{data.award.title}</div>{' '}
        <div className={styles.stats}>
          Won <span className={styles.num}>{data.nominations.length}</span>{' '}
          {getPluralWord('nomination', data.nominations.length)}
        </div>
      </Link>
      <div className={styles.nominations}>
        {data.nominations.map((nomination) => (
          <div key={nomination.title} className={styles.nomination}>
            {nomination.title}
            {nomination.person && (
              <>
                <span>—</span>
                <RouterLink to="/" search={{ personId: nomination.person.id, personRole: 'ACTOR' }}>
                  {nomination.person.name}
                </RouterLink>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
