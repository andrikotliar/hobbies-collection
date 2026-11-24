import clsx from 'clsx';
import { FieldError } from './ui/field-error';
import { FieldLabel } from './ui/field-label';
import type { RefCallBack } from 'react-hook-form';
import { XIcon } from 'lucide-react';
import type { FormError } from '~/shared/types/form-error';

type Props = {
  type?: 'text' | 'number' | 'password';
  label?: string;
  error?: FormError;
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLInputElement | null> | RefCallBack;
  isClearable?: boolean;
} & Omit<React.ComponentProps<'input'>, 'type' | 'name'>;

const iconWrapperClassNames = clsx('icon-wrapper flex [&>svg]:text-slate-600 [&>svg]:size-5');

export const TextInput = ({
  label,
  type = 'text',
  className,
  error,
  icon,
  ref,
  isClearable,
  ...props
}: Props) => {
  return (
    <label className={clsx('flex flex-col gap-1 w-full', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full p-2.5 rounded-lg border border-slate-300 outline-sky-600 transition-colors bg-white hover:border-slate-600',
            'focus:[&+.icons-bar_.icon-wrapper_svg]:text-sky-600',
            'not-placeholder-shown:[&+.icons-bar_.clear-btn]:flex',
            {
              ['pr-12.5']: icon !== undefined,
              ['pr-17.5']: isClearable,
            },
          )}
          {...props}
        />
        <div className="icons-bar flex items-center gap-2.5 absolute right-2.5 top-1/2 -translate-y-1/2">
          {isClearable && (
            <button className={clsx(iconWrapperClassNames, 'hidden clear-btn')}>
              <XIcon />
            </button>
          )}
          <div className={iconWrapperClassNames}>{icon}</div>
        </div>
      </div>
      <FieldError error={error} />
    </label>
  );
};
