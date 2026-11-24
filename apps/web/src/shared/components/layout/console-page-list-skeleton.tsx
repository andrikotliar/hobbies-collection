import { SkeletonBlock } from '~/shared/components/ui/skeleton-block';

import { Panel } from '~/shared/components/ui/panel';

export const ConsolePageListSkeleton = () => {
  return (
    <Panel hasPaddings={false}>
      {Array.from({ length: 30 }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3.5 border-b border-b-slate-300"
        >
          <SkeletonBlock width="50%" height="20px" />
          <div className="flex items-center gap-5">
            <SkeletonBlock width="20px" height="20px" />
            <SkeletonBlock width="20px" height="20px" />
          </div>
        </div>
      ))}
    </Panel>
  );
};
