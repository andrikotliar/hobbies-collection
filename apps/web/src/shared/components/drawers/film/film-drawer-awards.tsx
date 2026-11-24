import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import { Link } from '@tanstack/react-router';
import { getPluralWord } from '~/shared/helpers/get-plural-word';
import { RouterLink } from '~/shared/components/links/router-link';

type Awards = ApiResponse<typeof api.films.getById>['awards'];

type Props = {
  data: Awards;
};

export const Award = ({ data }: { data: Props['data'][number] }) => {
  return (
    <div>
      <Link
        className="flex justify-between border-b border-b-orange-400"
        to="/"
        search={{ awardId: data.award.id }}
      >
        <div className="text-lg text-orange-400">{data.award.title}</div>{' '}
        <div className="uppercase text-xs">
          Won{' '}
          <span className="font-stretch-ultra-condensed text-base">{data.nominations.length}</span>{' '}
          {getPluralWord('nomination', data.nominations.length)}
        </div>
      </Link>
      <div className="flex flex-col gap-1 mt-2.5 text-sm">
        {data.nominations.map((nomination) => (
          <div key={nomination.title} className="flex gap-1">
            {nomination.title}
            {nomination.person && (
              <>
                <span>—</span>
                <RouterLink to="/" search={{ personId: nomination.person.id, personRole: 'ACTOR' }}>
                  {nomination.person.name}
                </RouterLink>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FilmDrawerAwards = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-4 bg-orange-100 border border-orange-400 p-5 mx-5 mb-5 rounded-lg">
      <div className="bg-orange-400 font-stretch-ultra-condensed text-2xl">Awards</div>
      {data.map((award) => (
        <Award data={award} key={award.award.id} />
      ))}
    </div>
  );
};
