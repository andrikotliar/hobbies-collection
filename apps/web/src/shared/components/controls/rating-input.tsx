import { StarIcon } from 'lucide-react';
import { FieldLabel } from '../ui/field-label';
import clsx from 'clsx';

type Props = {
  name: string;
  size: number;
  onChange: (value: number) => void;
  defaultValue: number;
  label?: string;
};

const labelClassNames = clsx(
  '[--icon-fill:transparent] text-amber-400 cursor-pointer',
  'rating-hover:[--icon-fill:theme(--color-amber-400)]! rating-selected:[--icon-fill::theme(--color-amber-400)]',
);

export const RatingInput = ({ size, name, onChange, defaultValue, label }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-row-reverse justify-end items-center gap-1">
        {Array.from({ length: size }, (_, index) => {
          const value = size - index;
          return (
            <label className={labelClassNames} key={index}>
              <input
                type="radio"
                className="hidden"
                name={name}
                checked={value === defaultValue}
                onChange={() => onChange(value)}
              />
              <StarIcon className="fill-(--icon-fill)" />
            </label>
          );
        })}
      </div>
    </div>
  );
};
