import styles from './styles.module.css';
import { Link, type LinkProps } from '@tanstack/react-router';

type Props = Omit<LinkProps, 'className' | 'children'> & {
  icon: React.ReactNode;
};

export const IconLink = ({ icon, ...props }: Props) => {
  return (
    <Link className={styles.icon_link} {...props}>
      {icon}
    </Link>
  );
};
