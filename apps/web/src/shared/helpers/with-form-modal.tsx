import { FormModalProvider } from '~/shared/components/form-modal-provider/form-modal-provider';
import type { Component } from '~/shared/types/component';
import type { Entity } from '~/shared/types/entity';
import type { FormComponentProps } from '~/shared/types/form-component-props';

export const withFormModal = <T extends Entity, C extends Component<any>>(
  form: Component<FormComponentProps<T>>,
  WrapperComponent: C,
) => {
  return (props: any) => (
    <FormModalProvider form={form}>
      <WrapperComponent {...props} />
    </FormModalProvider>
  );
};
