import type { FormComponentProps } from '~/shared/types/form-component-props';
import styles from './styles.module.css';
import { Modal } from '~/shared/components/modal/modal';

type FormModalProps<T extends Record<PropertyKey, unknown>> = {
  onClose: VoidFunction;
  values: T | null;
  form: (props: FormComponentProps<T>) => React.ReactElement;
};

export const FormModal = <T extends Record<PropertyKey, unknown>>({
  values,
  onClose,
  form: FormComponent,
}: FormModalProps<T>) => {
  if (!values) {
    return null;
  }

  return (
    <Modal isOpen onClose={onClose} isAllowedClickOutside={false}>
      <Modal.Content size="form">
        <div className={styles.content_wrapper}>
          <FormComponent values={values} />
        </div>
        <Modal.CloseButton onClick={onClose} />
      </Modal.Content>
    </Modal>
  );
};
