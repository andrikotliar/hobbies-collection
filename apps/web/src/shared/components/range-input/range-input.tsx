import { useRef } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

type Props = {
  min: number;
  max: number;
  step: number;
  value?: number[];
  onChange: (value: number[]) => void;
};

export const RangeInput = ({ min, max, step, value = [min, max], onChange }: Props) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const numValue = Number(event.target.value);
    const isInvalidNumber = Number.isNaN(numValue);

    if (isInvalidNumber) {
      throw new Error('Input produced invalid value');
    }

    const oppositeIndex = Number(!index);

    if (
      (index === 0 && numValue >= value[oppositeIndex]) ||
      (index === 1 && numValue <= value[oppositeIndex])
    ) {
      if (value[oppositeIndex] === value[index]) {
        return;
      }

      onChange([value[oppositeIndex], value[oppositeIndex]]);
      return;
    }

    const nextValue = [0, 0];

    nextValue[index] = numValue;
    nextValue[oppositeIndex] = value[oppositeIndex];

    onChange(nextValue);
  };

  return (
    <div className={styles.range_input_wrapper}>
      <div className={clsx(styles.number, styles.left_number)}>{value[0]}</div>
      <div className={styles.inputs}>
        <input
          className={clsx(styles.range_input, styles.left_input)}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleValue(e, 0)}
          ref={(ref) => {
            if (ref) {
              inputsRef.current[0] = ref;
            }
          }}
        />
        <input
          className={styles.range_input}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleValue(e, 1)}
          ref={(ref) => {
            if (ref) {
              inputsRef.current[1] = ref;
            }
          }}
        />
      </div>

      <div className={clsx(styles.number, styles.right_number)}>{value[1]}</div>
    </div>
  );
};
