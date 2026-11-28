import type { ApiResponse } from '~/shared/types/extract-params';
import type { api } from '~/shared/services/api';
import clsx from 'clsx';
import { personRoleToTitle } from '~/shared/configs/person-role-to-title';
import { RouterLink } from '~/shared/components/links/router-link';

type Props = {
  data: ApiResponse<typeof api.films.getById>['castAndCrew'];
};

const RoleItem = ({ data }: { data: Props['data'][number] }) => {
  const isActorRole = data.role === 'ACTOR';

  return (
    <div
      className={clsx(
        'flex flex-col md:flex-row gap-2.5 md:gap-0 p-3.5 md:p-5 border-b border-b-slate-300 last:border-0',
        isActorRole && 'items-start',
      )}
    >
      <h3 className="font-stretch-condensed uppercase text-sm w-42.5 shrink-0">
        {personRoleToTitle[data.role]}
      </h3>
      <ul className={clsx('flex', isActorRole ? 'flex-col gap-2.5' : 'flex-wrap gap-4')}>
        {data.people.map((person) => (
          <li key={person.id}>
            <div className={clsx(!isActorRole && 'flex gap-1')}>
              <RouterLink
                to="/"
                search={{
                  personRole: data.role,
                  personId: person.id,
                }}
              >
                {person.name}
              </RouterLink>
              {isActorRole && (
                <>
                  <span className="text-gray-600 text-sm ml-1">as</span> {person.details}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FilmDrawerCastAndCrew = ({ data }: Props) => {
  return (
    <div>
      {data.map((personData) => (
        <RoleItem data={personData} key={personData.role} />
      ))}
    </div>
  );
};
