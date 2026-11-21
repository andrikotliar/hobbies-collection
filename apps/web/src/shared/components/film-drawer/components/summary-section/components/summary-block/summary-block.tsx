import clsx from 'clsx';
import styles from './styles.module.css';

type Props = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hasPadding?: boolean;
};

export const SummaryBlock = ({ label, icon, children, hasPadding = true }: Props) => {
  return (
    <div className={clsx(styles.summary_block, hasPadding && styles.with_padding)}>
      {label && (
        <div className={styles.label}>
          <div className={styles.icon}>{icon}</div> <span>{label}</span>
        </div>
      )}
      <div className={styles.row}>{children}</div>
    </div>
  );
};
