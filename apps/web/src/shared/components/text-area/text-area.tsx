import styles from './styles.module.css';
import { FieldLabel } from '../field-label/field-label';
import { FieldError } from '../field-error/field-error';
import { Loader } from '~/shared/components/loader/loader';
import type { RefCallBack } from 'react-hook-form';

type Props = {
  label?: string;
  error?: string | string[];
  isLoading?: boolean;
  ref?: React.RefObject<HTMLTextAreaElement | null> | RefCallBack;
} & Omit<React.ComponentProps<'textarea'>, 'name'>;

export const TextArea = ({
  label,
  error,
  isLoading = false,
  ref,
  disabled,
  ...textAreaProps
}: Props) => {
  return (
    <label className={styles.wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={styles.text_area_wrapper}>
        <textarea
          className={styles.text_area}
          ref={ref}
          disabled={disabled || isLoading}
          {...textAreaProps}
        />
        {isLoading && (
          <div className={styles.loader_wrapper}>
            <Loader size={30} shouldInheritColor />
          </div>
        )}
      </div>
      <FieldError error={error} />
    </label>
  );
};
