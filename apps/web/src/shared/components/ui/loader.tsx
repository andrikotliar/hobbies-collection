import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

type Props = {
  isFullPage?: boolean;
  size?: number;
  shouldInheritColor?: boolean;
};

export const Loader = ({ isFullPage = false, size = 60, shouldInheritColor = false }: Props) => {
  return (
    <div
      className={clsx('flex justify-center items-center h-full w-full', {
        ['h-screen']: isFullPage,
      })}
    >
      <LoaderCircle
        className={clsx('animate-spin', {
          ['text-sky-600']: !shouldInheritColor,
        })}
        size={size}
      />
    </div>
  );
};
