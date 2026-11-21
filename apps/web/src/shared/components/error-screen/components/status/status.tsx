import { Button } from '~/shared/components/button';
import styles from './styles.module.css';
import { Image } from '~/shared/components/image/image';
import { Link } from '@tanstack/react-router';
import { HomeIcon, RefreshCcwIcon } from 'lucide-react';

type Props = {
  title: string;
  message: string;
  imageSrc: string;
  isRecoverable?: boolean;
};

export const Status = ({ title, message, imageSrc, isRecoverable = false }: Props) => {
  return (
    <div className={styles.error_screen}>
      <div className={styles.container}>
        <Image src={imageSrc} className={styles.image} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{message}</p>
        {isRecoverable ? (
          <Button icon={<RefreshCcwIcon />} onClick={() => window.location.reload()}>
            Reload
          </Button>
        ) : (
          <Link to="/" className={styles.home_link} replace>
            <HomeIcon />
            <span>Return to Home</span>
          </Link>
        )}
      </div>
    </div>
  );
};
