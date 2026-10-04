import { Link } from '@tanstack/react-router';
import styles from './rating.module.css';
import { StarIcon } from 'lucide-react';
import clsx from 'clsx';

type RatingProps = {
  value: number;
};

export const Rating = ({ value }: RatingProps) => {
  return (
    <Link className={styles.rating} to="/films" search={{ rating: value }}>
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
