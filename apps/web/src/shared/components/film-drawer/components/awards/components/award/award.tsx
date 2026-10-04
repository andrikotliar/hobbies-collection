import { Link } from '@tanstack/react-router';
import styles from './award.module.css';
import { getPluralWord, RouterLink, type api, type ApiResponse } from '~/shared';

type AwardProps = {
  data: ApiResponse<typeof api.films.getById>['awards'][number];
};

export const Award = ({ data }: AwardProps) => {
  return (
    <div className={styles.award}>
      <Link className={styles.header} to="/films" search={{ awardId: data.award.id }}>
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
                <RouterLink
                  to="/films"
                  search={{ personId: nomination.person.id, personRole: 'ACTOR' }}
                >
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
