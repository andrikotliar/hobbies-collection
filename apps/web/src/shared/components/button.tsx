import clsx from 'clsx';
import { Loader } from '~/shared/components/loader/loader';

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
  small: 'text-sm py-1.5 px-3',
  medium: 'text-base py-2.5 px-5',
  large: 'text-xl py-2.5 px-5',
};

const buttonColorClassNames = {
  primary: 'bg-sky-600 disabled:text-gray-500',
  secondary: 'text-black text-slate-100 disabled:text-gray-500',
  ghost: 'text-black bg-transparent rounded-none p-0',
  danger: 'text-white bg-red-400 disabled:text-gray-500 not-disabled:hover:text-sky-600',
  light: 'text-black bg-white border border-slate-300 disabled:text-gray-500',
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
        'text-white rounded-lg transition-colors cursor-pointer',
        'cursor-default not-disabled:hover:ring not-disabled:hover:ring-black',
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
