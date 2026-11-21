import styles from './styles.module.css';

type Props = {
  children?: React.ReactNode;
};

export const SectionTitle = ({ children }: Props) => {
  return <h2 className={styles.section_title}>{children}</h2>;
};
