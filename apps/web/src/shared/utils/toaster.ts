import type { ToastType } from '~/shared/types/toaster';
import { eventEmitter } from '~/shared/services/event-emitter';

type MessageData = {
  message: string;
};

type Message = string | MessageData | Error;

type ToasterHandler = {
  [key in ToastType]: (message: Message) => void;
};

const addToast = (type: ToastType, values: string | MessageData | Error) => {
  const id = Date.now();

  const newToast = {
    id,
    type,
    message: typeof values === 'object' ? values.message : values,
  };

  eventEmitter.emit('toaster-message', newToast);
};

export const toaster: ToasterHandler = {
  success: (message) => addToast('success', message),
  error: (message) => addToast('error', message),
  warning: (message) => addToast('warning', message),
  info: (message) => addToast('info', message),
};
