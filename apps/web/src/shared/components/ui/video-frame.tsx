type Props = {
  url: string;
};

export const Video = ({ url }: Props) => {
  return (
    <div className="w-full h-full bg-black cursor-pointer overflow-hidden rounded-sm">
      <iframe src={url} allow="autoplay" allowFullScreen className="border-0 w-full h-full" />
    </div>
  );
};
