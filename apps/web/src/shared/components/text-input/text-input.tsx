import styles from './styles.module.css';
import clsx from 'clsx';
import { FieldError } from '../field-error/field-error';
import { FieldLabel } from '../field-label/field-label';
import type { RefCallBack } from 'react-hook-form';
import { XIcon } from 'lucide-react';
import type { FormError } from '~/shared/types/form-error';

type Props = {
  type?: 'text' | 'number' | 'password';
  label?: string;
  error?: FormError;
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLInputElement | null> | RefCallBack;
  isClearable?: boolean;
} & Omit<React.ComponentProps<'input'>, 'type' | 'name'>;

export const TextInput = ({
  label,
  type = 'text',
  className,
  error,
  icon,
  ref,
  isClearable,
  ...props
}: Props) => {
  return (
    <label className={clsx(styles.input_wrapper, className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.field_wrapper}>
        <input
          ref={ref}
          type={type}
          className={clsx(styles.text_input, {
            [styles.with_icon]: icon !== undefined,
            [styles.with_clear_button]: isClearable,
          })}
          {...props}
        />
        <div className={styles.icons_bar}>
          {isClearable && (
            <button className={clsx(styles.icon_wrapper, styles.clear_button)}>
              <XIcon />
            </button>
          )}
          <div className={styles.icon_wrapper}>{icon}</div>
        </div>
      </div>
      <FieldError error={error} />
    </label>
  );
};
