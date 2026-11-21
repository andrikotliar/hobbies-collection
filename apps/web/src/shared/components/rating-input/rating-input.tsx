import { StarIcon } from 'lucide-react';
import styles from './styles.module.css';
import { FieldLabel } from '../field-label';

type Props = {
  name: string;
  size: number;
  onChange: (value: number) => void;
  defaultValue: number;
  label?: string;
};

export const RatingInput = ({ size, name, onChange, defaultValue, label }: Props) => {
  return (
    <div className={styles.wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.rating}>
        {Array.from({ length: size }, (_, index) => {
          const value = size - index;
          return (
            <label className={styles.label} key={index}>
              <input
                type="radio"
                className={styles.input}
                name={name}
                checked={value === defaultValue}
                onChange={() => onChange(value)}
              />
              <StarIcon className={styles.star_icon} />
            </label>
          );
        })}
      </div>
    </div>
  );
};
