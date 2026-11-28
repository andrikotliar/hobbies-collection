import clsx from 'clsx';
import { Loader } from '~/shared/components/ui/loader';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light';

type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  isDisabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  fitWidth?: boolean;
  ref?: React.RefObject<HTMLButtonElement | null>;
  inheritColor?: boolean;
};

const iconSizeClassNames = {
  small: 'size-5',
  medium: 'size-5',
  large: 'size-10',
};

const buttonSizeClassNames = {
  small: clsx('text-sm py-1.5 px-3 leading-3.5'),
  medium: clsx('text-base py-2.5 px-5 leading-4'),
  large: clsx('text-xl py-2.5 px-5 leading-5'),
};

const buttonColorClassNames = {
  primary: clsx(
    'text-white bg-sky-600 disabled:text-gray-500 not-disabled:hover:ring not-disabled:hover:ring-black',
  ),
  secondary: clsx(
    'text-black bg-slate-100 disabled:text-gray-500 not-disabled:hover:ring not-disabled:hover:ring-black',
  ),
  ghost: clsx('text-black bg-transparent rounded-none p-0! not-disabled:hover:text-sky-600'),
  danger: clsx(
    'text-white bg-red-400 disabled:text-gray-500 not-disabled:hover:ring not-disabled:hover:ring-black',
  ),
  light: clsx(
    'text-black bg-white border border-slate-300 disabled:text-gray-500 not-disabled:hover:ring not-disabled:hover:ring-black',
  ),
};

export const Button = ({
  children,
  icon,
  onClick,
  type = 'button',
  variant = 'primary',
  isDisabled,
  isLoading = false,
  size = 'medium',
  fitWidth = false,
  ref,
  inheritColor = false,
}: Props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(
        'flex justify-center items-center gap-1 shrink-0',
        'rounded-lg transition-colors cursor-pointer',
        'cursor-default ',
        buttonColorClassNames[variant],
        buttonSizeClassNames[size],
        fitWidth && 'w-full',
        inheritColor && 'text-inherit',
      )}
      disabled={isDisabled || isLoading}
      ref={ref}
    >
      {isLoading && (
        <div className={clsx('flex items-center justify-center', iconSizeClassNames[size])}>
          <Loader size={20} shouldInheritColor />
        </div>
      )}
      {icon && !isLoading && (
        <div className={clsx('flex items-center justify-center', iconSizeClassNames[size])}>
          {icon}
        </div>
      )}
      {children}
    </button>
  );
};
