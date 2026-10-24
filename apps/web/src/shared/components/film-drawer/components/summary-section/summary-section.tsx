import styles from './summary-section.module.css';
import { useMemo } from 'react';
import { defineCssProperties, getExternalImageUrl, type api, type ApiResponse } from '~/shared';
import { Collections, Poster, Rating, SummaryBlock, TrailersButton, Title } from './components';
import { getFilmSummaryConfig } from '../../helpers';
import clsx from 'clsx';

type SummarySectionProps = {
  film: ApiResponse<typeof api.films.getById>;
  hasExtendedData: boolean;
};

export const SummarySection = ({ film, hasExtendedData }: SummarySectionProps) => {
  const filmConfig = useMemo(() => {
    return getFilmSummaryConfig(film);
  }, [film]);

  const poster = getExternalImageUrl(film.imagePath);

  return (
    <div
      className={clsx(styles.summary_layout, hasExtendedData && styles.extended_data)}
      style={defineCssProperties({
        '--bg-url': `url(${poster})`,
      })}
    >
      <div className={styles.title_row}>
        <Rating value={film.rating} />
        <Title>{film.title}</Title>
      </div>

      <div className={clsx(styles.content, !poster && styles.content_no_poster)}>
        {(poster || film.trailers.length > 0) && (
          <div className={styles.left_column}>
            {poster && <Poster image={poster} title={film.title} />}
            {film.trailers.length > 0 && <TrailersButton data={film.trailers} type={film.type} />}
          </div>
        )}

        <div className={styles.right_column}>
          {filmConfig.map((item) => (
            <SummaryBlock label={item.title} key={item.id} icon={item.icon}>
              {item.content}
            </SummaryBlock>
          ))}
          {(film.collections.length > 0 || film.chaptersRefId) && (
            <Collections list={film.collections} chaptersRefId={film.chaptersRefId} />
          )}
        </div>
      </div>
    </div>
  );
};
