import { AppImage } from '~/shared/components/ui/app-image';

type Props = {
  image: string;
  title: string;
};

export const Poster = ({ image, title }: Props) => {
  return (
    <div className="w-full md:w-96 border border-slate-300 rounded-lg overflow-hidden shrink-0 grow mx-auto shadow-sm">
      <AppImage src={image} alt={`Poster of "${title}"`} />
    </div>
  );
};
