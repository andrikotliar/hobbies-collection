import { useState } from 'react';
import { FormModal } from '~/shared/components/form-modal';
import { FormModalContext } from '~/shared/context/form-modal-context';
import type { Entity } from '~/shared/types/entity';
import type { FormComponentProps } from '~/shared/types/form-component-props';

type FormModalProviderProps<T extends Entity> = {
  form: (props: FormComponentProps<T>) => React.ReactElement;
  children?: React.ReactNode;
};

export const FormModalProvider = <T extends Entity>({
  children,
  form,
}: FormModalProviderProps<T>) => {
  const [data, setData] = useState<T | null>(null);

  const handleClose = () => {
    setData(null);
  };

  return (
    <FormModalContext.Provider
      value={{ onOpen: (values) => setData(values), onClose: handleClose }}
    >
      {children}
      <FormModal values={data} form={form} onClose={handleClose} />
    </FormModalContext.Provider>
  );
};
