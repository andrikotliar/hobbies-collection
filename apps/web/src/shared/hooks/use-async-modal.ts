import { useState } from 'react';

type AsyncModalParams<D, R> = {
  data: D;
  resolve: (value: R) => void;
};

export const useAsyncModal = <D, R>() => {
  const [params, setParams] = useState<AsyncModalParams<D, R> | null>(null);

  const openAsyncModal = async (data: D) => {
    const result = await new Promise<R>((resolve) => {
      setParams({
        data,
        resolve,
      });
    });

    setParams(null);
    return result;
  };

  const closeAsyncModal = () => setParams(null);

  return {
    isAsyncModalOpen: params !== null,
    params,
    openAsyncModal,
    closeAsyncModal,
  };
};
