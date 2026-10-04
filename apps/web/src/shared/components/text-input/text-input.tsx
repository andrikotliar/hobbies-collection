import styles from './text-input.module.css';
import clsx from 'clsx';
import { FieldError } from '../field-error/field-error';
import { FieldLabel } from '../field-label/field-label';
import { type FormError } from '~/shared';
import type { RefCallBack } from 'react-hook-form';
import { XIcon } from 'lucide-react';
import { useRef } from 'react';

export type TextInputProps = {
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
  onChange,
  ...props
}: TextInputProps) => {
  const textInputRef = useRef<HTMLInputElement | null>(null);

  const clearValue = () => {
    if (typeof onChange === 'function') {
      onChange({
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    if (typeof ref === 'object' && ref.current) {
      ref.current.value = '';
      return;
    }

    if (!textInputRef.current) {
      return;
    }

    textInputRef.current.value = '';
  };

  return (
    <label className={clsx(styles.input_wrapper, className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.field_wrapper}>
        <input
          ref={ref ?? textInputRef}
          type={type}
          onChange={onChange}
          className={clsx(styles.text_input, {
            [styles.with_icon]: icon !== undefined,
            [styles.with_clear_button]: isClearable,
          })}
          {...props}
        />
        <div className={styles.icons_bar}>
          {isClearable && (
            <button className={clsx(styles.icon_wrapper, styles.clear_button)} onClick={clearValue}>
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
