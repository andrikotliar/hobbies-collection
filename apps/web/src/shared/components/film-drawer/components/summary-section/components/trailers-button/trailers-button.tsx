import styles from './styles.module.css';
import { useState } from 'react';
import { PlayIcon } from 'lucide-react';
import { TrailersPlaylist } from './components/trailers-playlist/trailers-playlist';
import type { Enum, TitleType } from '@hobbies-collection/shared';
import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { Modal } from '~/shared/components/modal/modal';

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
        className={styles.play_button}
        title="Play trailer"
        onClick={() => setIsModalOpen(true)}
      >
        <PlayIcon className={styles.play_icon} />
        <span className={styles.play_button_label}>Trailer{data.length > 1 && 's'}</span>
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
