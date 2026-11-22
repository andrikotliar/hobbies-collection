import clsx from 'clsx';

type Theme = 'light' | 'dark';
type Size = 'form' | 'video' | 'message';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
  withPaddings?: boolean;
  size?: Size;
  flex?: boolean;
};

const contentSize = {
  form: clsx('max-w-150 max-h-full'),
  video: clsx('max-w-9/10 sm:max-w-8/10'),
  message: clsx('max-w-75'),
};

const contentTheme = {
  light: 'bg-white',
  dark: 'bg-black',
};

export const ModalContent = ({
  children,
  theme = 'light',
  withPaddings = true,
  size = 'form',
  flex,
}: Props) => {
  return (
    <div
      className={clsx(
        'relative rounded-xl w-full flex flex-col overflow-hidden',
        contentTheme[theme],
        contentSize[size],
        withPaddings && 'p-5',
        flex && 'flex flex-col gap-5',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};
