import { useEffect, useState } from 'react';
import type { Toast, ToastType } from '~/shared/types/toaster';
import { eventEmitter } from '~/shared/services/event-emitter';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import clsx from 'clsx';

const messageTypeToTimeout: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  info: 6000,
  warning: 5000,
};

const typeToClassName: Record<ToastType, string> = {
  error: clsx('text-white bg-red-400'),
  success: clsx('text-white bg-teal-600'),
  warning: clsx('bg-yellow-400'),
  info: clsx('bg-purple-200'),
};

const typeToIcon: Record<ToastType, React.ReactNode> = {
  error: <CircleAlertIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon className="text-yellow-600" />,
  info: <InfoIcon className="text-purple-700" />,
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = eventEmitter.on('toaster-message', (toast: Toast) => {
      setToasts((toasts) => [...toasts, toast]);

      setTimeout(() => removeToast(toast.id), messageTypeToTimeout[toast.type]);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: number) => {
    setToasts((toasts) => {
      if (!toasts.length) {
        return [];
      }

      return toasts.filter((toast) => toast.id !== id);
    });
  };

  return (
    <div className="w-[calc(100%-40px)] xs:w-75 flex flex-col gap-5 fixed right-5 top-5 z-99999">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'relative rounded-md py-4 pr-15 pl-5 bg-slate-300 cursor-pointer animate-toast-slide w-full shadow-xl',
            typeToClassName[toast.type],
          )}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex flex-start gap-4">
            <div className="text-[0px]">{typeToIcon[toast.type]}</div>
            <div className="mt-0.5">{toast.message}</div>
          </div>
          <XIcon className="absolute top-2.5 right-2.5" size={18} />
        </div>
      ))}
    </div>
  );
};
