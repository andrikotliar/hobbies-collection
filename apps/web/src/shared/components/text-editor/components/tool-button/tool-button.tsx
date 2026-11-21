import styles from './styles.module.css';

import clsx from 'clsx';

type Props = {
  onClick: VoidFunction;
  icon: React.ReactNode;
  isActive?: boolean;
};

export const ToolButton = ({ icon, onClick, isActive = false }: Props) => {
  return (
    <button
      className={clsx(styles.button, {
        [styles.active]: isActive,
      })}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
};
