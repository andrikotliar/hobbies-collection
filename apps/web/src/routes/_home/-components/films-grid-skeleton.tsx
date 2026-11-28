import { SkeletonBlock } from '~/shared/components/ui/skeleton-block';

export const FilmsGridSkeleton = () => {
  return (
    <div className="responsive-grid">
      {Array.from({ length: 48 }, (_, index) => (
        <div className="w-full aspect-10/16 rounded-lg" key={index}>
          <SkeletonBlock width="100%" height="100%" />
        </div>
      ))}
    </div>
  );
};
