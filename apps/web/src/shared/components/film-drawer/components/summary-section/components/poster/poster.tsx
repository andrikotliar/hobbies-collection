import styles from './styles.module.css';
import { Image } from '~/shared/components/image/image';

type Props = {
  image: string;
  title: string;
};

export const Poster = ({ image, title }: Props) => {
  return (
    <div className={styles.poster}>
      <Image src={image} alt={`Poster of "${title}"`} />
    </div>
  );
};
