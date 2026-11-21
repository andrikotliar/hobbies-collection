import mainLogoSvg from '~/assets/logos/main-logo.svg';
import { Image } from '~/shared/components/image/image';
import styles from './styles.module.css';

export const PageLoader = () => {
  return (
    <div className={styles.page_loader}>
      <Image src={mainLogoSvg} shouldFitContainer className={styles.loader_logo} />
    </div>
  );
};
