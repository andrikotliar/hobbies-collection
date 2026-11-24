import { FieldLabel } from '~/shared/components/ui/field-label';
import clsx from 'clsx';
import { FieldError } from '~/shared/components/ui/field-error';
import type { FormError } from '~/shared/types/form-error';
import { getDefaultDateCode } from '~/shared/helpers/get-default-date-code';
import { getDateCodeParts } from '~/shared/helpers/get-date-code-parts';
import { getDateCode } from '~/shared/helpers/get-date-code';
import { monthOptions } from '~/shared/configs/month-options';
import { Select } from '~/shared/components/controls/select';

type Props = {
  value?: number;
  label?: string;
  error?: FormError;
  onChange: (dateCode: number) => void;
};

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const MonthDateSelector = ({
  value = getDefaultDateCode(),
  label,
  error,
  onChange,
}: Props) => {
  const dateParts = getDateCodeParts(value);
  const selectedMonth = dateParts[0];
  const selectedDate = dateParts[1];

  const handleSelectMonth = (value: number) => {
    onChange(getDateCode(value, selectedDate));
  };

  const handleSelectDate = (value: number) => {
    onChange(getDateCode(selectedMonth, value));
  };

  return (
    <div className="flex flex-col gap-1 w-75">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-col gap-2.5 border border-slate-300 rounded-xl p-5">
        <Select
          options={monthOptions}
          value={selectedMonth}
          onSelect={handleSelectMonth}
          isSearchable={false}
          onClear={() => handleSelectMonth(1)}
        />
        <div className="grid grid-cols-7">
          {Array.from({ length: monthDays[selectedMonth - 1] }, (_, index) => (
            <button
              type="button"
              onClick={() => handleSelectDate(index + 1)}
              className={clsx(
                'aspect-square flex items-center justify-center rounded-sm  transition-colors',
                selectedDate === index + 1
                  ? 'text-white bg-sky-600 cursor-default pointer-events-none'
                  : 'hover:bg-slate-100',
              )}
              key={index}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <FieldError error={error} />
    </div>
  );
};
