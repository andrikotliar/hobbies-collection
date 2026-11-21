import styles from './styles.module.css';
import clsx from 'clsx';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import type { Toast, ToastType } from '~/shared/types/toaster';

type Props = {
  data: Toast;
  onRemove: (id: number) => void;
};

const typeToClassName: Record<ToastType, string> = {
  error: styles.error_message,
  success: styles.success_message,
  warning: styles.warning_message,
  info: styles.info_message,
};

const typeToIcon: Record<ToastType, React.ReactNode> = {
  error: <CircleAlertIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
  info: <InfoIcon />,
};

export const Message = ({ data, onRemove }: Props) => {
  return (
    <div
      className={clsx(styles.message, typeToClassName[data.type])}
      onClick={() => onRemove(data.id)}
    >
      <div className={styles.body}>
        <div className={styles.type_icon}>{typeToIcon[data.type]}</div>
        <div className={styles.text}>{data.message}</div>
      </div>
      <XIcon className={styles.close_icon} size={18} />
    </div>
  );
};
