import { Link } from '@tanstack/react-router';
import styles from './styles.module.css';
import { StarIcon } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  value: number;
};

export const Rating = ({ value }: Props) => {
  return (
    <Link className={styles.rating} to="/" search={{ rating: value }}>
      {Array.from({ length: 3 }, (_, index) => (
        <StarIcon
          key={index}
          className={clsx(styles.star, {
            [styles.filled_star]: index <= value - 1,
          })}
        />
      ))}
    </Link>
  );
};
