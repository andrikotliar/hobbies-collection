import { useMemo, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import clsx from 'clsx';
import { Video } from '../../ui/video-frame';
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
    <div className="flex flex-col lg:flex-row aspect-square lg:aspect-video overflow-hidden rounded-lg bg-black">
      <div className="aspect-video lg:aspect-auto grow">
        <Video url={videoUrls[activeVideoIndex].value} />
      </div>
      {trailers.length > 1 && (
        <div className="w-full lg:w-62.5 flex flex-row shrink-0 lg:flex-col gap-5 p-5 lg:pt-15 overflow-y-auto scrollbar-none">
          {trailers.map((trailer, index) => (
            <button
              key={trailer.id}
              className={clsx(
                'w-45 h-25 shrink-0 lg:w-full lg:h-30 border-2 border-white rounded-lg overflow-hidden bg-cover bg-no-repeat bg-center',
                {
                  'border-sky-600 cursor-default bg-black/90 group [&_.preview-title]:top-1/2 [&_.preview-title]:left-1/2 [&_.preview-title]:-translate-1/2 [&_.play-icon]:opacity-0':
                    activeVideoIndex === index,
                },
              )}
              onClick={() => handleSetActiveVideoIndex(index)}
              disabled={activeVideoIndex === index}
              style={{
                backgroundImage: `url(${videoUrls[index].preview})`,
              }}
            >
              <div className="absolute w-full h-full top-0 left-0 bg-black/60 hover:bg-black-90 transition-colors z-1" />
              <span className="preview-title text-sm lg:text-base text-white absolute z-2 top-2.5 left-2.5 uppercase font-bold translate-0 transition">
                {previewLabel} {trailer.order}
              </span>
              <PlayIcon className="play-icon size-8 lg:size-10 text-white fill-white top-1/2 left-1/2 -translate-1/2 z-2 transition-opacity group" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
