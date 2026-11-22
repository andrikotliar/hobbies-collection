import styles from './styles.module.css';
import { Image } from '~/shared/components/image';
import { PlayIcon } from 'lucide-react';
import { imagePaths } from '~/shared/configs/image-paths';

type Props = {
  imagePath: string;
  videoUrl: string;
};

export const VideoPreview = ({ imagePath, videoUrl }: Props) => {
  if (!videoUrl.length) {
    return (
      <div className={styles.preview_wrapper}>
        <Image src={imagePaths.placeholders.videoNotFound} />
      </div>
    );
  }

  return (
    <a className={styles.preview_wrapper} href={videoUrl} target="_blank" rel="noopener noreferrer">
      <Image src={imagePath} />
      <PlayIcon className={styles.play_icon} />
    </a>
  );
};
