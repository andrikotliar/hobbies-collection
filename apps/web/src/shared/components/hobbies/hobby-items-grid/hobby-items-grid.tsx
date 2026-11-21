import type { ApiResponse } from '~/shared/types/extract-params';
import styles from './styles.module.css';
import type { api } from '~/shared/services/api';
import { getExternalImageUrl } from '~/shared/helpers/get-external-image-url';
import { Image } from '~/shared/components/image/image';

type Props = {
  items: ApiResponse<typeof api.hobbies.getHobby>['items'];
};

export const HobbyItemsGrid = ({ items }: Props) => {
  return (
    <div className={styles.wrapper}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.image_wrapper}>
            <Image src={getExternalImageUrl(item.imagePath)} />
          </div>
          <div className={styles.data}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.authors}>
              {item.authors.map((author) => author.name).join(', ')}
            </div>
            <div className={styles.release_year}>Released: {item.releaseYear}</div>
            <div className={styles.description}>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
