import { Link } from '@tanstack/react-router';
import { StarIcon } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  value: number;
};

export const Rating = ({ value }: Props) => {
  return (
    <Link className="flex gap-1" to="/" search={{ rating: value }}>
      {Array.from({ length: 3 }, (_, index) => (
        <StarIcon
          key={index}
          className={clsx('size-7 fill-amber-100 stroke-amber-100 opacity-70', {
            'opacity-100 fill-amber-500 stroke-amber-500': index <= value - 1,
          })}
        />
      ))}
    </Link>
  );
};
