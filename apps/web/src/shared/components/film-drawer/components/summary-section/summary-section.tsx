import styles from './styles.module.css';
import { useMemo } from 'react';
import clsx from 'clsx';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { defineCssProperties } from '~/shared/helpers/define-css-properties';
import { getFilmSummaryConfig } from '~/shared/configs/get-film-summary-config';
import { Rating } from '../summary-section/components/rating/rating';
import { Title } from '../summary-section/components/title/title';
import { Poster } from '../summary-section/components/poster/poster';
import { TrailersButton } from '../summary-section/components/trailers-button/trailers-button';
import { SummaryBlock } from '../summary-section/components/summary-block/summary-block';
import { Collections } from '../summary-section/components/collections/collections';

type Props = {
  film: ApiResponse<typeof api.films.getById>;
  hasExtendedData: boolean;
};

export const SummarySection = ({ film, hasExtendedData }: Props) => {
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
