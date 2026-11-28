import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';

export type CheckboxType = 'checkbox' | 'radio';

type Props = {
  type: CheckboxType;
  label: string;
  rightIcon?: React.ReactNode;
  ref?: React.RefObject<HTMLInputElement | null>;
} & Omit<React.ComponentProps<'input'>, 'type'>;

export const Checkbox = ({
  type = 'checkbox',
  label,
  rightIcon,
  ref,
  ...checkboxInputProps
}: Props) => {
  return (
    <label className="group flex items-center gap-2.5 cursor-pointer">
      <input ref={ref} type={type} className="hidden peer" {...checkboxInputProps} />
      <div
        className={clsx(
          'flex items-center justify-center border border-sky-600 bg-white size-5.5 p-0.5',
          'peer-checked:bg-sky-600 peer-checked:[&>svg]:text-white peer-checked:[&>svg]:opacity-100',
          {
            'rounded-sm': type === 'checkbox',
            'rounded-full': type === 'radio',
          },
        )}
      >
        <CheckIcon className="size-3 opacity-0" />
      </div>
      <div className="flex items-center grow gap-2.5 justify-between text-sm select-none group-hover:text-sky-600">
        {label}
        {rightIcon}
      </div>
    </label>
  );
};
