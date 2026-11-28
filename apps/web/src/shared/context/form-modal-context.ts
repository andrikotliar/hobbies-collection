import { createContext, useContext } from 'react';

type FormModalContextParams<T extends Record<string, unknown>> = {
  onOpen: (params: T) => void;
  onClose: () => void;
};

export const FormModalContext = createContext<FormModalContextParams<any>>(null!);

export const useFormModal = <T extends Record<string, unknown>>() => {
  return useContext<FormModalContextParams<T>>(FormModalContext);
};
