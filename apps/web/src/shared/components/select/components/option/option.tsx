import styles from './styles.module.css';
import clsx from 'clsx';
import type { ListOption } from '@hobbies-collection/shared';

type OptionProps<T extends ListOption> = {
  onSelect: (value: T, isActive: boolean) => void;
  data: T;
  selectedValues: (string | number)[];
  ref?: React.RefCallback<HTMLButtonElement>;
};

export const Option = <T extends ListOption>({
  onSelect,
  data,
  selectedValues,
  ref,
}: OptionProps<T>) => {
  const isActive = selectedValues.includes(data.value);

  return (
    <button
      ref={ref}
      onClick={() => onSelect(data, isActive)}
      className={clsx(styles.option, {
        [styles.active]: isActive,
      })}
      type="button"
      role="option"
    >
      {data.label}
    </button>
  );
};
