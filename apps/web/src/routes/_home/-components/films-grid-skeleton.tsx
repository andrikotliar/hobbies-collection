import { PageTitle } from '~/shared/components/layout/page-title';
import { SkeletonBlock } from '~/shared/components/ui/skeleton-block';

export const FilmsGridSkeleton = () => {
  return (
    <>
      <div>
        <PageTitle>Films Collection</PageTitle>
      </div>
      <div className="responsive-grid">
        {Array.from({ length: 48 }, (_, index) => (
          <div className="w-full aspect-video rounded-lg" key={index}>
            <SkeletonBlock width="100%" height="100%" />
          </div>
        ))}
      </div>
    </>
  );
};
