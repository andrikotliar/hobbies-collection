import mainLogoSvg from '~/assets/logos/main-logo.svg';
import { AppImage } from '~/shared/components/ui/app-image';

type Props = {
  size?: number;
  className?: string;
};

export const Logo = ({ size = 30, className }: Props) => {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <AppImage src={mainLogoSvg} shouldFitContainer />
    </div>
  );
};
