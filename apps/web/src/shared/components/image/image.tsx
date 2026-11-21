import styles from './styles.module.css';
import clsx from 'clsx';
import { handleImageError } from './helpers/handle-image-error';
import { imagePaths } from '~/shared/configs/image-paths';

type Props = {
  src?: string | null;
  errorImageSrc?: string;
  shouldFitContainer?: boolean;
  ref?: React.RefObject<HTMLImageElement | null>;
} & Omit<React.ComponentProps<'img'>, 'onError' | 'src'>;

export const Image = ({
  src,
  className,
  errorImageSrc = imagePaths.placeholders.imageNotFound,
  shouldFitContainer = false,
  ref,
  ...props
}: Props) => {
  const getImageSource = () => {
    if (!src) {
      return errorImageSrc;
    }

    return src;
  };

  return (
    <img
      ref={ref}
      src={getImageSource()}
      className={clsx(styles.image, className, {
        [styles.fit_container]: shouldFitContainer,
      })}
      onError={handleImageError(errorImageSrc)}
      {...props}
    />
  );
};
