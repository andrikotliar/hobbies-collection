import { Button } from '~/shared/components/button/button';
import styles from './status.module.css';
import { Image } from '~/shared/components/image/image';
import { Link } from '@tanstack/react-router';
import { HomeIcon, RefreshCcwIcon } from 'lucide-react';

type StatusProps = {
  title: string;
  message: string;
  imageSrc: string;
  isRecoverable?: boolean;
};

export const Status = ({ title, message, imageSrc, isRecoverable = false }: StatusProps) => {
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
          <Link to="/films" className={styles.home_link} replace>
            <HomeIcon />
            <span>Return to Home</span>
          </Link>
        )}
      </div>
    </div>
  );
};
