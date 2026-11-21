import { XIcon } from 'lucide-react';
import styles from './styles.module.css';

type Props = {
  onClick: VoidFunction;
};

export const ModalCloseButton = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.close_button}>
      <XIcon size={15} />
    </button>
  );
};
