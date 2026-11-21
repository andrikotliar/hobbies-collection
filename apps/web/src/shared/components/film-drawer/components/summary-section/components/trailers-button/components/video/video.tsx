import styles from './styles.module.css';

type Props = {
  url: string;
};

export const Video = ({ url }: Props) => {
  return (
    <div className={styles.video}>
      <iframe src={url} allow="autoplay" allowFullScreen />
    </div>
  );
};
