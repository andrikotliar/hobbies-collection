import clsx from 'clsx';

type Props = {
  hasPaddings?: boolean;
  isFlexContainer?: boolean;
  isScrollable?: boolean;
  children?: React.ReactNode;
};

export const Panel = ({
  children,
  hasPaddings = true,
  isFlexContainer = false,
  isScrollable = false,
}: Props) => {
  return (
    <div
      className={clsx('bg-white rounded-lg shadow-md w-full', {
        ['p-5']: hasPaddings,
        ['flex flex-col gap-5']: isFlexContainer,
        ['overflow-y-auto h-full']: isScrollable,
      })}
    >
      {children}
    </div>
  );
};
