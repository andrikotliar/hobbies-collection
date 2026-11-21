import styles from './styles.module.css';
import { useMemo, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import clsx from 'clsx';
import { Video } from '../video/video';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getEmbeddableYoutubeUrl } from '~/shared/helpers/get-embeddable-youtube-url';

type Props = {
  trailers: ApiResponse<typeof api.films.getById>['trailers'];
  previewLabel: string;
};

export const TrailersPlaylist = ({ trailers, previewLabel }: Props) => {
  const [shouldAutoPlay, setShouldAutoPlay] = useState(trailers.length === 1);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handleSetActiveVideoIndex = (index: number) => {
    setActiveVideoIndex(index);

    if (!shouldAutoPlay) {
      setShouldAutoPlay(true);
    }
  };

  const videoUrls = useMemo(() => {
    return trailers.map((trailer) =>
      getEmbeddableYoutubeUrl(trailer.url, {
        rel: '0',
        showinfo: '0',
        autoplay: shouldAutoPlay ? '1' : '0',
      }),
    );
  }, [trailers, shouldAutoPlay]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.video_column}>
        <Video url={videoUrls[activeVideoIndex].value} />
      </div>
      {trailers.length > 1 && (
        <div className={styles.track}>
          {trailers.map((trailer, index) => (
            <button
              key={trailer.id}
              className={clsx(styles.trailer_button, {
                [styles.active_trailer_button]: activeVideoIndex === index,
              })}
              onClick={() => handleSetActiveVideoIndex(index)}
              disabled={activeVideoIndex === index}
              style={{
                backgroundImage: `url(${videoUrls[index].preview})`,
              }}
            >
              <span className={styles.preview_title}>
                {previewLabel} {trailer.order}
              </span>
              <PlayIcon className={styles.play_icon} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
