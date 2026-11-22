import mainLogoSvg from '~/assets/logos/main-logo.svg';
import { Image } from '~/shared/components/image';

type Props = {
  size?: number;
  className?: string;
};

export const Logo = ({ size = 30, className }: Props) => {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <Image src={mainLogoSvg} shouldFitContainer />
    </div>
  );
};
