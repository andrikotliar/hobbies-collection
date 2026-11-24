import { FieldLabel } from '../ui/field-label';
import { FieldError } from '../ui/field-error';
import type { RefCallBack } from 'react-hook-form';

type Props = {
  label?: string;
  error?: string | string[];
  isLoading?: boolean;
  ref?: React.RefObject<HTMLTextAreaElement | null> | RefCallBack;
} & Omit<React.ComponentProps<'textarea'>, 'name'>;

export const TextArea = ({ label, error, ref, disabled, ...textAreaProps }: Props) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative text-black">
        <textarea
          className="text-inherit text-[length:inherit] p-2.5 rounded-lg border border-slate-300 outline-sky-600 transition-colors resize-y min-h-40 w-full hover:border-slate-600"
          ref={ref}
          disabled={disabled}
          {...textAreaProps}
        />
      </div>
      <FieldError error={error} />
    </label>
  );
};
