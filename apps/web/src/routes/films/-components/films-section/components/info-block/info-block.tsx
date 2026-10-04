import styles from './info-block.module.css';
import { XCircleIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '~/shared';

type InfoBlockProps = {
  label: string;
  title: string;
  description?: string | null;
};

export const InfoBlock = ({ label, title, description }: InfoBlockProps) => {
  const navigate = useNavigate();

  const handleClearFilter = () => {
    navigate({ to: '/', replace: true });
  };

  return (
    <div className={styles.info_block}>
      <div className={styles.data}>
        <div className={styles.label}>{label}</div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <Button onClick={handleClearFilter} icon={<XCircleIcon size={20} />} variant="ghost" />
    </div>
  );
};
