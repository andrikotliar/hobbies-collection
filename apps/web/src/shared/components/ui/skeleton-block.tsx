type Props = {
  width?: string;
  height: string;
};

export const SkeletonBlock = ({ width = '100%', height }: Props) => {
  return (
    <div
      className="relative rounded-sm overflow-hidden bg-slate-200 bg-linear-to-r from-transparent via-slate-400 to-transparent bg-no-repeat bg-position-[200%] bg-size-[200%_auto]"
      style={{ width, height }}
    />
  );
};
