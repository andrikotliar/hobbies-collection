import styles from './styles.module.css';
import { FieldError } from '../field-error/field-error';
import { FieldLabel } from '../field-label/field-label';
import type { RefCallBack } from 'react-hook-form';

type Props = {
  label?: string;
  error?: string | string[];
  ref?: RefCallBack;
} & Omit<React.ComponentProps<'input'>, 'name' | 'type' | 'className'>;

export const DatePicker = ({ label, error, ref, ...props }: Props) => {
  return (
    <label className={styles.wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input ref={ref} type="date" className={styles.input} {...props} />
      <FieldError error={error} />
    </label>
  );
};
