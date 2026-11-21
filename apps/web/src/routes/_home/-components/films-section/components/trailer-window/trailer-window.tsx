import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.css';
import { getFilmTrailersQueryOptions } from '~/shared/helpers/query-options/films/get-film-trailers-query-options';
import { Modal } from '~/shared/components/modal/modal';
import { Loader } from '~/shared/components/loader/loader';

type Props = {
  filmId: number | null;
  onClose: VoidFunction;
};

export const TrailerWindow = ({ filmId, onClose }: Props) => {
  const { data, isLoading } = useQuery(getFilmTrailersQueryOptions(filmId));

  return (
    <Modal isOpen={!!filmId} onClose={onClose}>
      <Modal.Content withPaddings={false} theme="dark" size="video">
        <div className={styles.trailer_content}>
          {isLoading && <Loader shouldInheritColor />}
          {!data && !isLoading && <div className={styles.empty}>Trailer not found</div>}
          {data && <iframe src={data} allow="autoplay" allowFullScreen />}
        </div>
        <Modal.CloseButton onClick={onClose} />
      </Modal.Content>
    </Modal>
  );
};
