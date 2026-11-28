import { queryOptions } from '@tanstack/react-query';
import { getEmbeddableYoutubeUrl } from '~/shared/helpers/get-embeddable-youtube-url';
import { api, queryKey } from '~/shared/services/api';

export const getFilmTrailersQueryOptions = (id: number | null) => {
  return queryOptions({
    queryKey: queryKey('films.getTrailers', id),
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { trailers } = await api.films.getTrailers({ params: { id } });

      const firstTrailerUrl = trailers[0]?.url;

      if (!firstTrailerUrl) {
        return null;
      }

      const videoParams = getEmbeddableYoutubeUrl(firstTrailerUrl, {
        rel: '0',
        showinfo: '0',
        autoplay: '1',
      });

      return videoParams.value;
    },
    enabled: !!id,
  });
};
