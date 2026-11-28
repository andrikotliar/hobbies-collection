import clsx from 'clsx';
import { imagePaths } from '~/shared/configs/image-paths';
import { handleImageError } from '~/shared/helpers/handle-image-error';

type Props = {
  src?: string | null;
  errorImageSrc?: string;
  shouldFitContainer?: boolean;
  ref?: React.RefObject<HTMLImageElement | null>;
} & Omit<React.ComponentProps<'img'>, 'onError' | 'src'>;

export const AppImage = ({
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
      className={clsx(
        'w-full h-full select-none pointer-events-none',
        className,
        shouldFitContainer ? 'object-fit' : 'object-cover',
      )}
      onError={handleImageError(errorImageSrc)}
      {...props}
    />
  );
};
