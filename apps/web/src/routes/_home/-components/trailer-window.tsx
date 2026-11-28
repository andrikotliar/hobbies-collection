import { useQuery } from '@tanstack/react-query';
import { getFilmTrailersQueryOptions } from '~/shared/helpers/query-options/films/get-film-trailers-query-options';
import { Modal } from '~/shared/components/modals/modal';
import { Loader } from '~/shared/components/ui/loader';

type Props = {
  filmId: number | null;
  onClose: VoidFunction;
};

export const TrailerWindow = ({ filmId, onClose }: Props) => {
  const { data, isLoading } = useQuery(getFilmTrailersQueryOptions(filmId));

  return (
    <Modal isOpen={!!filmId} onClose={onClose}>
      <Modal.Content withPaddings={false} theme="dark" size="video">
        <div className="text-white aspect-video bg-black text-[0px]">
          {isLoading && <Loader shouldInheritColor />}
          {!data && !isLoading && (
            <div className="w-full h-full flex items-center justify-center uppercase">
              Trailer not found
            </div>
          )}
          {data && (
            <iframe
              className="w-full h-full border-0"
              src={data}
              allow="autoplay"
              allowFullScreen
            />
          )}
        </div>
        <Modal.CloseButton onClick={onClose} />
      </Modal.Content>
    </Modal>
  );
};
