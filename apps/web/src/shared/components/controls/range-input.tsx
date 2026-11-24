import { useRef } from 'react';
import clsx from 'clsx';

type Props = {
  min: number;
  max: number;
  step: number;
  value?: number[];
  onChange: (value: number[]) => void;
};

const rangeInputClassNames = clsx(
  'appearance-none absolute h-0.75 w-full pointer-events-none bg-sky-600 rounded-2xl',
  'slider-thumb-webkit:appearance-none slider-thumb:size-6 slider-thumb:bg-sky-100 slider-thumb:rounded-full slider-thumb:ring-sky-600 slider-thumb:cursor-pointer slider-thumb:pointer-events-auto slider-thumb:transition-colors',
  'slider-thumb:hover:bg-teal-100 slider-thumb:active:bg-sky-600',
);

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
    <div className="flex justify-between items-center h-10 gap-5 w-full mx-auto">
      <div className="text-sm">{value[0]}</div>
      <div className="relative grow">
        <input
          className={clsx(rangeInputClassNames, 'h-0 z-1 mt-0.5')}
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
          className={rangeInputClassNames}
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

      <div className="text-sm">{value[1]}</div>
    </div>
  );
};
