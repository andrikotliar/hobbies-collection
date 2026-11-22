import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { Image } from '~/shared/components/image';

type Props = {
  items: ApiResponse<typeof api.hobbies.getHobby>['items'];
};

export const HobbyItemsGrid = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-5 p-5">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2.5 bg-white p-5 rounded-sm shadow-sm">
          <div className="flex max-w-38 w-full rounded-sm overflow-hidden shrink-0">
            <Image src={getExternalImageUrl(item.imagePath)} />
          </div>
          <div className="flex flex-col w-full">
            <div className="font-bold text-xl mb-1">{item.title}</div>
            <div className="text-sm text-red-500">
              {item.authors.map((author) => author.name).join(', ')}
            </div>
            <div className="text-sm">Released: {item.releaseYear}</div>
            <div className="text-sm text-justify mt-2.5 p-2.5 bg-gray-100 rounded-sm grow">
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
