import type { PropsWithChildren } from 'react';
import styles from './styles.module.css';

type Props = PropsWithChildren;

export const HobbyContainer = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};
