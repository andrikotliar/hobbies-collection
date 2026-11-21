import { FieldLabel } from '~/shared/components/field-label';
import { Select } from '~/shared/components/select/select';
import styles from './styles.module.css';
import clsx from 'clsx';
import { FieldError } from '~/shared/components/field-error';
import type { FormError } from '~/shared/types/form-error';
import { getDefaultDateCode } from '~/shared/helpers/get-default-date-code';
import { getDateCodeParts } from '~/shared/helpers/get-date-code-parts';
import { getDateCode } from '~/shared/helpers/get-date-code';
import { monthOptions } from '~/shared/configs/month-options';

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
    <div className={styles.wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.main}>
        <Select
          options={monthOptions}
          value={selectedMonth}
          onSelect={handleSelectMonth}
          isSearchable={false}
          onClear={() => handleSelectMonth(1)}
        />
        <div className={styles.grid}>
          {Array.from({ length: monthDays[selectedMonth - 1] }, (_, index) => (
            <button
              type="button"
              onClick={() => handleSelectDate(index + 1)}
              className={clsx(styles.date, {
                [styles.selected]: selectedDate === index + 1,
              })}
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
