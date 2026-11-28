type Props = {
  width?: string;
  height: string;
};

export const SkeletonBlock = ({ width = '100%', height }: Props) => {
  return (
    <div
      className="relative rounded-sm overflow-hidden bg-gray-100 bg-linear-to-r from-transparent via-gray-300 to-transparent bg-no-repeat bg-position-[200%] bg-size-[200%_auto] animate-slide"
      style={{ width, height }}
    />
  );
};
