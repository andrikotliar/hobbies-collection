import type { ApiResponse } from '~/shared/types/extract-params';
import { RoleItem } from './components/role-item/role-item';
import type { api } from '~/shared/services/api';

type Props = {
  data: ApiResponse<typeof api.films.getById>['castAndCrew'];
};

export const CastAndCrew = ({ data }: Props) => {
  return (
    <div>
      {data.map((personData) => (
        <RoleItem data={personData} key={personData.role} />
      ))}
    </div>
  );
};
