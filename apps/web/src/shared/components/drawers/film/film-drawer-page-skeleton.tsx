import { SkeletonBlock } from '~/shared/components/ui/skeleton-block';
import type { SummaryConfig } from '~/shared/configs/get-film-summary-config';
import {
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  HandCoinsIcon,
  StarIcon,
  WalletIcon,
} from 'lucide-react';
import { FilmDrawerSummaryBlock } from './film-drawer-summary-block';
import { PersonRole } from '@hobbies-collection/shared';

const skeletonSummaryConfig: SummaryConfig[] = [
  {
    id: 'genres',
    title: 'Genres',
    content: <SkeletonBlock width="100%" height="41px" />,
    icon: <BookIcon />,
  },
  {
    id: 'releaseDate',
    title: 'Release Date',
    icon: <CalendarIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
  {
    id: 'duration',
    title: 'Runtime',
    icon: <ClockIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
  {
    id: 'countries',
    title: 'Origin countries',
    icon: <GlobeIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
  {
    id: 'studios',
    title: 'Production studios',
    icon: <BuildingIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
  {
    id: 'budget',
    title: 'Budget',
    icon: <WalletIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
  {
    id: 'boxOffice',
    title: 'Box Office',
    icon: <HandCoinsIcon />,
    content: <SkeletonBlock width="100%" height="41px" />,
  },
];

export const FilmDrawerPageSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="relative py-7.5 px-4 sm:p-7.5 bg-black/50">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-1">
            <StarIcon className="size-7 fill-gray-400 stroke-gray-400" />
            <StarIcon className="size-7 fill-gray-400 stroke-gray-400" />
            <StarIcon className="size-7 fill-gray-400 stroke-gray-400" />
          </div>
          <SkeletonBlock width="60%" height="40px" />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 mt-5">
          <div className="flex flex-col gap-4">
            <div className="w-full md:w-96 h-140 lg:h-auto mx-auto lg:mx-0 shrink-0 grow">
              <SkeletonBlock width="100%" height="100%" />
            </div>
            <div className="w-full md:w-96">
              <SkeletonBlock width="100%" height="40px" />
            </div>
          </div>
          <div className="flex flex-col gap-4 grow">
            {skeletonSummaryConfig.map((item) => (
              <FilmDrawerSummaryBlock
                label={item.title}
                icon={item.icon}
                key={item.id}
                hasPadding={false}
              >
                {item.content}
              </FilmDrawerSummaryBlock>
            ))}
            <div className="flex gap-4">
              <SkeletonBlock width="80px" height="28px" />
              <SkeletonBlock width="80px" height="28px" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-300 rounded-b-lg">
        {Object.values(PersonRole).map((role) => (
          <div
            className="flex flex-col gap-2.5 p-4 md:p-5 md:flex-row border-b border-b-slate-300 last:border-b-0"
            key={role}
          >
            <div className="font-stretch-ultra-condensed uppercase text-sm w-42.5 shrink-0">
              {role}
            </div>
            <SkeletonBlock width="100%" height={role === 'ACTOR' ? '340px' : '20px'} />
          </div>
        ))}
      </div>
    </div>
  );
};
