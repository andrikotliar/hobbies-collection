import { convertImageToWebp } from '~/shared/helpers/convert-image-to-webp';
import { titleToFileName } from '~/shared/helpers/title-to-file-name';
import { api } from '~/shared/services/api';

type UploadImageParams = {
  image: File | string | null | undefined;
  title: string;
  folder: string;
};

export const uploadImage = async ({
  image,
  folder,
  title,
}: UploadImageParams): Promise<string | null> => {
  if (!image) {
    return null;
  }

  if (image instanceof File) {
    const transformedPoster = await convertImageToWebp(image);

    const key = `${folder}/${titleToFileName(title)}.webp`;
    const uploadParams = await api.files.getUploadUrl({
      input: {
        key,
        fileType: 'webp',
      },
    });

    await fetch(uploadParams.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'webp',
      },
      body: transformedPoster,
    });

    return key;
  }

  return image;
};
