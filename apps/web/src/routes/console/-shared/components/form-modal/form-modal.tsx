import { type FormComponentProps, Modal } from '~/shared';
import styles from './form-modal.module.css';

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
