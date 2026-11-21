import { FieldError } from './field-error';
import { FieldLabel } from './field-label';
import type { RefCallBack } from 'react-hook-form';

type Props = {
  label?: string;
  error?: string | string[];
  ref?: RefCallBack;
} & Omit<React.ComponentProps<'input'>, 'name' | 'type' | 'className'>;

export const DatePicker = ({ label, error, ref, ...props }: Props) => {
  return (
    <label className="flex flex-col gap-1">
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        ref={ref}
        type="date"
        className="w-full p-2.5 border border-slate-300 bg-white transition-colors cursor-text hover:border-black"
        {...props}
      />
      <FieldError error={error} />
    </label>
  );
};
