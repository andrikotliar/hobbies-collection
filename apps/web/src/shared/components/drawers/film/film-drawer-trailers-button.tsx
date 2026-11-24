import { useState } from 'react';
import { PlayIcon } from 'lucide-react';
import { TrailersPlaylist } from './film-drawer-trailers-playlist';
import type { Enum, TitleType } from '@hobbies-collection/shared';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { Modal } from '~/shared/components/modals/modal';

type Props = {
  data: ApiResponse<typeof api.films.getById>['trailers'];
  type: Enum<typeof TitleType>;
};

export const TrailersButton = ({ data, type }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const previewLabel = type === 'SERIES' ? 'Season' : 'Trailer #';

  return (
    <>
      <button
        className="w-full md:w-96 relative bg-white flex items-center justify-center gap-1 rounded-lg p-2.5 transition-transform active:scale-95"
        title="Play trailer"
        onClick={() => setIsModalOpen(true)}
      >
        <PlayIcon className="fill-white size-5" />
        <span className="font-stretch-ultra-condensed text-base uppercase">
          Trailer{data.length > 1 && 's'}
        </span>
      </button>
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <Modal.Content withPaddings={false} size="video" theme="dark">
          <TrailersPlaylist trailers={data} previewLabel={previewLabel} />
          <Modal.CloseButton onClick={handleClose} />
        </Modal.Content>
      </Modal>
    </>
  );
};
